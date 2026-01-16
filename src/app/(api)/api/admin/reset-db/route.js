import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, cert, getApp } from 'firebase-admin/app';
import { NextResponse } from 'next/server';

// Initialize Firebase Admin
let adminApp;
try {
  adminApp = getApp();
} catch {
  const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'base64').toString());
  adminApp = initializeApp({ credential: cert(serviceAccount) });
}
const db = getFirestore(adminApp);

export const dynamic = 'force-dynamic';

export async function GET(request) {
  // Security: Simple check to prevent accidental public access
  // You can remove this check if you are just running it locally once
  const { searchParams } = new URL(request.url);
  if (searchParams.get('key') !== 'secure_reset_123') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const usersSnapshot = await db.collection('users').get();
    const batch = db.batch();
    let count = 0;

    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      
      // Only reset users who actually have a paid plan or IDs
      if (userData.plan !== 'free' || userData.lemonCustomerId || userData.lemonSubscriptionId) {
        const ref = db.collection('users').doc(doc.id);
        batch.update(ref, {
          plan: 'free',
          lemonCustomerId: null, // Clear the ID
          lemonSubscriptionId: null, // Clear the ID
          updatedAt: new Date().toISOString()
        });
        count++;
      }
    });

    if (count > 0) {
      await batch.commit();
    }

    return NextResponse.json({ 
      success: true, 
      message: `Reset complete. ${count} users downgraded to free.` 
    });

  } catch (error) {
    console.error('Reset error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}