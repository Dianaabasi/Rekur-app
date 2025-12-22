// src/app/api/cron/status/route.js
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, cert, getApp } from 'firebase-admin/app';

let adminApp;
try {
  adminApp = getApp();
} catch {
  const serviceAccount = JSON.parse(
    Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'base64').toString()
  );
  adminApp = initializeApp({ credential: cert(serviceAccount) });
}

const db = getFirestore(adminApp);

export async function GET() {
  try {
    const logSnap = await db
      .collection('reminderLogs')
      .orderBy('sentAt', 'desc')
      .limit(1)
      .get();

    if (logSnap.empty) {
      return new Response(
        JSON.stringify({ lastRun: null, sent: 0 }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const latest = logSnap.docs[0].data();
    const successCount = logSnap.docs.filter(doc => doc.data().success).length;

    return new Response(
      JSON.stringify({
        lastRun: latest.sentAt?.toDate?.().toISOString() || null,
        sent: successCount,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Cron status error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}