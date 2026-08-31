export const dynamic = 'force-dynamic';

import Stripe from 'stripe';
import { isAdminRequest } from '@/lib/admin-auth';
import { getAdminDb } from '@/lib/firebase-admin';

export async function GET(request) {
  if (!isAdminRequest(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const db = getAdminDb();

    // ---- Users ----
    const userSnap = await db.collection('users').get();
    const users = userSnap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        email: data.email,
        plan: data.plan || 'free',
        stripeCustomerId: data.stripeCustomerId || null,
        disabled: data.disabled || false,
        createdAt: data.createdAt,
      };
    });

    // ---- Subscriptions ----
    const subSnap = await db.collection('subscriptions').get();
    const subs = subSnap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        name: data.name,
        price: data.price,
        renewalDate: data.renewalDate,
        remindDays: data.remindDays || [],
      };
    });

    // ---- Payments (Stripe) ----
    let payments = [];
    if (process.env.STRIPE_SECRET_KEY) {
      try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const charges = await stripe.charges.list({ limit: 100 });
        payments = charges.data.map((c) => ({
          id: c.payment_intent,
          customer: c.customer,
          amount: c.amount, // in cents
          currency: c.currency,
          created: new Date(c.created * 1000),
          refunded: c.refunded,
          receipt_url: c.receipt_url,
        }));
      } catch (stripeErr) {
        console.warn('Stripe fetch error in admin data:', stripeErr.message);
      }
    }

    return new Response(
      JSON.stringify({ users, subs, payments }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    console.error('Admin data error:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}