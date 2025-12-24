// import Stripe from 'stripe';
// import { getAuth } from 'firebase-admin/auth';
// import { getFirestore } from 'firebase-admin/firestore';
// import { initializeApp, cert, getApp } from 'firebase-admin/app';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// let adminApp;
// try { adminApp = getApp(); } catch {
//   const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'base64').toString());
//   adminApp = initializeApp({ credential: cert(serviceAccount) });
// }
// const auth = getAuth(adminApp);
// const db = getFirestore(adminApp);

// export async function POST(request) {
//   const { priceId, userId } = await request.json();

//   if (!priceId || !userId) {
//     return new Response(JSON.stringify({ error: 'Missing data' }), { status: 400 });
//   }

//   try {
//     // Verify user exists
//     const userDoc = await db.doc(`users/${userId}`).get();
//     if (!userDoc.exists) {
//       return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
//     }

//     const user = userDoc.data();

//     // Create or get Stripe customer
//     let customer;
//     if (user.stripeCustomerId) {
//       customer = await stripe.customers.retrieve(user.stripeCustomerId);
//       if (customer.deleted) delete user.stripeCustomerId;
//     }

//     if (!user.stripeCustomerId) {
//       customer = await stripe.customers.create({
//         email: user.email,
//         metadata: { firebaseUid: userId },
//       });
//       await db.doc(`users/${userId}`).update({ stripeCustomerId: customer.id });
//     }

//     const session = await stripe.checkout.sessions.create({
//       customer: customer.id || customer.id,
//       mode: 'subscription',
//       payment_method_types: ['card'],
//       line_items: [{ price: priceId, quantity: 1 }],
//       // success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard?success=true`,
//       // cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/pricing`,
//       success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://rekur-app.com'}/dashboard?success=true`,
//       cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://rekur-app.com'}/pricing`,
//       metadata: { firebaseUid: userId },
//     });

//     return new Response(JSON.stringify({ url: session.url }), { status: 200 });
//   } catch (error) {
//     console.error('Stripe error:', error);
//     return new Response(JSON.stringify({ error: error.message }), { status: 500 });
//   }
// }

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
    // 1. Try to get user from Firestore
    let userDoc = await db.doc(`users/${userId}`).get();
    let userData = userDoc.exists ? userDoc.data() : null;

    // 2. AUTO-HEAL: If user is missing in DB, verify they exist in Auth and create the doc
    if (!userData) {
      try {
        console.log(`User doc missing for ${userId}. Attempting auto-heal...`);
        const firebaseUser = await auth.getUser(userId);
        
        userData = {
          uid: userId,
          email: firebaseUser.email,
          plan: 'free',
          createdAt: new Date().toISOString(),
        };
        
        // Save the missing document
        await db.doc(`users/${userId}`).set(userData);
        console.log(`Auto-healed user document for ${userId}`);
      } catch (authError) {
        console.error('Auth check failed:', authError);
        return new Response(JSON.stringify({ error: 'User account not found' }), { status: 404 });
      }
    }

    // 3. Create or get Stripe customer
    let customer;
    
    // Check if existing stripe ID is valid
    if (userData.stripeCustomerId) {
      try {
        customer = await stripe.customers.retrieve(userData.stripeCustomerId);
        if (customer.deleted) {
            customer = null;
        }
      } catch (e) {
        console.warn('Stripe customer lookup failed, will create new one');
        customer = null;
      }
    }

    // Create new customer if needed
    if (!customer) {
      customer = await stripe.customers.create({
        email: userData.email,
        metadata: { firebaseUid: userId },
      });
      // Save the new Stripe ID to their profile
      await db.doc(`users/${userId}`).update({ stripeCustomerId: customer.id });
    }

    // 4. Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      // Updated URLs to match your live domain
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.rekur-app.com'}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.rekur-app.com'}/pricing`,
      metadata: { firebaseUid: userId },
    });

    return new Response(JSON.stringify({ url: session.url }), { status: 200 });
  } catch (error) {
    console.error('Stripe error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}