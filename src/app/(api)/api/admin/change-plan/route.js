export const dynamic = 'force-dynamic';

import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, cert, getApp } from 'firebase-admin/app';

let adminApp;
try { adminApp = getApp(); } catch {
  const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'base64').toString());
  adminApp = initializeApp({ credential: cert(serviceAccount) });
}
const db = getFirestore(adminApp);

export async function POST(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer admin-authenticated')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { userId, plan } = await request.json();
  await db.doc(`users/${userId}`).update({ plan });
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}