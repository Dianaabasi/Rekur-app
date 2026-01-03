import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, cert, getApp } from 'firebase-admin/app';

// Initialize Firebase Admin
let adminApp;
try { adminApp = getApp(); } catch {
  const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'base64').toString());
  adminApp = initializeApp({ credential: cert(serviceAccount) });
}
const auth = getAuth(adminApp);
const db = getFirestore(adminApp);

export async function POST(request) {
  const { variantId, userId, userEmail } = await request.json();

  if (!variantId || !userId) {
    return new Response(JSON.stringify({ error: 'Missing data' }), { status: 400 });
  }

  try {
    // 1. Verify/Heal User in Firestore
    let userDoc = await db.doc(`users/${userId}`).get();
    
    if (!userDoc.exists) {
      try {
        console.log(`User doc missing for ${userId}. Attempting auto-heal...`);
        const emailToUse = userEmail || (await auth.getUser(userId)).email;
        
        await db.doc(`users/${userId}`).set({
          uid: userId,
          email: emailToUse,
          plan: 'free',
          createdAt: new Date().toISOString(),
        });
        userDoc = await db.doc(`users/${userId}`).get();
      } catch (authError) {
        console.error('Auto-heal failed:', authError);
        return new Response(JSON.stringify({ error: 'User account not found' }), { status: 404 });
      }
    }

    const userData = userDoc.data();

    // 2. Create Lemon Squeezy Checkout
    const reqData = {
      type: 'checkouts',
      attributes: {
        checkout_data: {
          custom: {
            user_id: userId, // CRITICAL: Pass userId to webhook
          },
          email: userData.email, // Pre-fill user email
        },
        product_options: {
          // THIS IS THE FIX: Redirect user to your dashboard after payment
          redirect_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.rekur-app.com'}/dashboard?success=true`,
          receipt_button_text: 'Go to Dashboard',
          receipt_thank_you_note: 'Thank you for subscribing to Rekur!'
        }
      },
      relationships: {
        store: {
          data: {
            type: 'stores',
            id: process.env.LEMONSQUEEZY_STORE_ID.toString(),
          },
        },
        variant: {
          data: {
            type: 'variants',
            id: variantId.toString(),
          },
        },
      },
    };

    const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
        'Content-Type': 'application/vnd.api+json',
      },
      body: JSON.stringify({ data: reqData }),
    });

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(data.errors[0]?.detail || 'Failed to create checkout');
    }

    const checkoutUrl = data.data.attributes.url;
    return new Response(JSON.stringify({ url: checkoutUrl }), { status: 200 });

  } catch (error) {
    console.error('Lemon Squeezy error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}