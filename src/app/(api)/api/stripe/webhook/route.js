import Stripe from 'stripe';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, cert, getApp } from 'firebase-admin/app';
import { sendEmail } from '@/lib/nodemailer';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

let adminApp;
try { adminApp = getApp(); } catch {
  const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'base64').toString());
  adminApp = initializeApp({ credential: cert(serviceAccount) });
}
const db = getFirestore(adminApp);

export async function POST(request) {
  const sig = request.headers.get('stripe-signature');
  let event;

  try {
    const body = await request.text(); // Read raw body
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle successful checkout
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const uid = session.metadata.firebaseUid;
    const userEmail = session.customer_details?.email; // Get email from Stripe session

    if (!uid) {
      console.warn('No firebaseUid in metadata');
      return new Response('Missing UID', { status: 400 });
    }

    try {
      const subscription = await stripe.subscriptions.retrieve(session.subscription);
      const priceId = subscription.items.data[0].price.id;

      const planMap = {
        'price_1SMfSu6ATC65iqtLhvHYjaH9': 'pro',     // $3/mo
        'price_1SMfUS6ATC65iqtLqlxcOPH0': 'pro',     // $25/yr
        'price_1SMfW36ATC65iqtLGUC00tQU': 'business',// $10/mo
        'price_1SMfXB6ATC65iqtLBth2CbBm': 'business',// $100/yr
      };

      const plan = planMap[priceId] || 'free';

      await db.doc(`users/${uid}`).update({
        plan,
        stripeCustomerId: session.customer,
        stripeSubscriptionId: session.subscription,
        updatedAt: new Date().toISOString(),
      });

      console.log(`User ${uid} upgraded to ${plan}`);

      // Send Confirmation Email via Nodemailer
      if (userEmail) {
        await sendEmail({
          to: userEmail,
          subject: 'Payment Successful - Welcome to Rekur! 🚀',
          html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
              <h2 style="color: #2563eb;">Upgrade Complete!</h2>
              <p>Hello,</p>
              <p>Your payment was successful. You have been upgraded to the <strong>${plan.toUpperCase()}</strong> plan.</p>
              <p>You now have full access to premium features.</p>
              <br/>
              <a href="https://www.rekur-app.com/dashboard" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Dashboard</a>
            </div>
          `
        });
      }

    } catch (err) {
      console.error('Failed to update user:', err);
      return new Response('Update failed', { status: 500 });
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}