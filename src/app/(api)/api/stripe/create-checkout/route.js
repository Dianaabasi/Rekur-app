import Stripe from 'stripe';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, cert, getApp } from 'firebase-admin/app';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

let adminApp;
try { adminApp = getApp(); } catch {
  const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'base64').toString());
  adminApp = initializeApp({ credential: cert(serviceAccount) });
}
const auth = getAuth(adminApp);
const db = getFirestore(adminApp);

export async function POST(request) {
  const { priceId, userId } = await request.json();

  if (!priceId || !userId) {
    return new Response(JSON.stringify({ error: 'Missing data' }), { status: 400 });
  }

  try {
    // Verify user exists
    const userDoc = await db.doc(`users/${userId}`).get();
    if (!userDoc.exists) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    const user = userDoc.data();

    // Create or get Stripe customer
    let customer;
    if (user.stripeCustomerId) {
      customer = await stripe.customers.retrieve(user.stripeCustomerId);
      if (customer.deleted) delete user.stripeCustomerId;
    }

    if (!user.stripeCustomerId) {
      customer = await stripe.customers.create({
        email: user.email,
        metadata: { firebaseUid: userId },
      });
      await db.doc(`users/${userId}`).update({ stripeCustomerId: customer.id });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customer.id || customer.id,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/pricing`,
      // success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://iliana-unmodelled-exclusively.ngrok-free.dev'}/dashboard?success=true`,
      // cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://iliana-unmodelled-exclusively.ngrok-free.dev'}/pricing`,
      metadata: { firebaseUid: userId },
    });

    return new Response(JSON.stringify({ url: session.url }), { status: 200 });
  } catch (error) {
    console.error('Stripe error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}