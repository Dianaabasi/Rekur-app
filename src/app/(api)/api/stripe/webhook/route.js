import Stripe from 'stripe';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, cert, getApp } from 'firebase-admin/app';

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
    } catch (err) {
      console.error('Failed to update user:', err);
      return new Response('Update failed', { status: 500 });
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}