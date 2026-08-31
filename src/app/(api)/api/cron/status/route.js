export const dynamic = 'force-dynamic';

import { getAdminDb } from '@/lib/firebase-admin';
import { isAdminRequest } from '@/lib/admin-auth';

export async function GET(request) {
  const incomingSecret = request.headers.get('x-cron-secret') || request.headers.get('authorization')?.replace('Bearer ', '');
  const isCronAuth = process.env.CRON_SECRET && incomingSecret === process.env.CRON_SECRET;
  const isAdmin = isAdminRequest(request);

  if (!isCronAuth && !isAdmin) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }


  try {
    const db = getAdminDb();
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