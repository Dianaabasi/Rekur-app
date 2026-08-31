export const dynamic = 'force-dynamic';

import { isAdminRequest } from '@/lib/admin-auth';
import { getAdminDb } from '@/lib/firebase-admin';

const VALID_PLANS = ['free', 'pro', 'business'];

export async function POST(request) {
  if (!isAdminRequest(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { userId, plan } = await request.json();

  if (!userId || !plan) {
    return new Response(JSON.stringify({ error: 'Missing userId or plan' }), { status: 400 });
  }

  if (!VALID_PLANS.includes(plan)) {
    return new Response(JSON.stringify({ error: 'Invalid plan value' }), { status: 400 });
  }

  const db = getAdminDb();
  await db.doc(`users/${userId}`).update({ plan });
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}