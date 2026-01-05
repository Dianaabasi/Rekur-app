import crypto from 'crypto';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, cert, getApp } from 'firebase-admin/app';
import { sendEmail } from '@/lib/nodemailer';

// Initialize Firebase Admin
let adminApp;
try { adminApp = getApp(); } catch {
  const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'base64').toString());
  adminApp = initializeApp({ credential: cert(serviceAccount) });
}
const db = getFirestore(adminApp);

export async function POST(request) {
  try {
    // 1. Validate Signature
    const rawBody = await request.text();
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    
    if (!secret) {
      console.error('CRITICAL: LEMONSQUEEZY_WEBHOOK_SECRET is missing.');
      return new Response('Server Config Error', { status: 500 });
    }

    const hmac = crypto.createHmac('sha256', secret);
    const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
    const signature = Buffer.from(request.headers.get('x-signature') || '', 'utf8');

    if (!crypto.timingSafeEqual(digest, signature)) {
      return new Response('Invalid signature', { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta.event_name;
    const data = payload.data.attributes;
    const { type, id: objectId } = payload.data; // Extract root type and ID for subscriptions
    const customData = payload.meta.custom_data; // This contains user_id

    // 2. Handle Subscription Created/Updated
    if (eventName === 'subscription_created' || eventName === 'subscription_updated' || eventName === 'order_created') {
      
      const userId = customData?.user_id;
      const userEmail = data.user_email;
      const variantId = data.variant_id.toString();
      
      if (!userId) {
        console.error('No user_id found in webhook custom_data');
        return new Response('No User ID', { status: 200 }); 
      }

      // Determine Plan based on Variant ID
      let plan = 'free';
      const proVariants = [
        process.env.NEXT_PUBLIC_LEMON_PRO_MONTHLY_VARIANT_ID, 
        process.env.NEXT_PUBLIC_LEMON_PRO_YEARLY_VARIANT_ID
      ];
      const businessVariants = [
        process.env.NEXT_PUBLIC_LEMON_BUSINESS_MONTHLY_VARIANT_ID, 
        process.env.NEXT_PUBLIC_LEMON_BUSINESS_YEARLY_VARIANT_ID
      ];

      if (proVariants.includes(variantId)) plan = 'pro';
      else if (businessVariants.includes(variantId)) plan = 'business';

      if (plan === 'free') {
         console.warn(`Variant ID ${variantId} did not match any Pro or Business IDs.`);
      }

      // --- FIX START: Intelligent ID Selection ---
      // Subscriptions have the ID at the root (payload.data.id)
      // Orders have the ID in attributes (data.identifier)
      let lemonSubscriptionId = null;
      
      if (type === 'subscriptions') {
        lemonSubscriptionId = objectId; 
      } else if (data.identifier) {
        lemonSubscriptionId = data.identifier; 
      }
      // --- FIX END ---

      // Update Firestore (With || null check to prevent crashes)
      await db.doc(`users/${userId}`).update({
        plan: plan,
        lemonCustomerId: data.customer_id ? data.customer_id.toString() : null,
        lemonSubscriptionId: lemonSubscriptionId || null, 
        updatedAt: new Date().toISOString(),
      });

      console.log(`User ${userId} upgraded to ${plan} via Lemon Squeezy (ID: ${lemonSubscriptionId})`);

      // 3. Send Email Notification (Only on creation to avoid spam)
      if (eventName === 'subscription_created' || eventName === 'order_created') {
        if (userEmail) {
          await sendEmail({
            to: userEmail,
            subject: 'Payment Successful - Welcome to Rekur! 🚀',
            html: `
              <div style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #6366f1;">Upgrade Complete!</h2>
                <p>Hello,</p>
                <p>Your payment was successful. You have been upgraded to the <strong>${plan.toUpperCase()}</strong> plan.</p>
                <p>You now have full access to premium features.</p>
                <br/>
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" style="background-color: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Dashboard</a>
              </div>
            `
          });
        }
      }
    }

    return new Response('Webhook received', { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(`Webhook Error: ${error.message}`, { status: 500 });
  }
}