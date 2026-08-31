export const dynamic = 'force-dynamic';

import { isAdminRequest } from '@/lib/admin-auth';
import { getAdminDb, getAdminAuth } from '@/lib/firebase-admin';

export async function POST(request) {
  if (!isAdminRequest(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { userId } = await request.json();

  if (!userId) {
    return new Response(JSON.stringify({ error: 'Missing userId' }), { status: 400 });
  }

  const auth = getAdminAuth();
  const db = getAdminDb();

  await auth.updateUser(userId, { disabled: true });
  await db.doc(`users/${userId}`).update({ disabled: true });
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}