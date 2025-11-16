// src/app/api/admin/data/route.js
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, cert, getApp } from 'firebase-admin/app';

// ---------- Init Admin ----------
let adminApp;
try {
  adminApp = getApp('admin-data');
} catch {
  const serviceAccount = JSON.parse(
    Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'base64').toString()
  );
  adminApp = initializeApp(
    { credential: cert(serviceAccount) },
    'admin-data'
  );
}
const db = getFirestore(adminApp);
const auth = getAuth(adminApp);

const ADMIN_EMAIL = 'dianaabasiekpenyong@gmail.com';

export async function GET(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const token = authHeader.split('Bearer ')[1];
  const isAdmin = token === 'admin-authenticated';

  if (!isAdmin) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // ---- Users ----
    const userSnap = await db.collection('users').get();
    const users = userSnap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Convert Firestore Timestamp → ISO string
        createdAt: data.createdAt?.toDate?.().toISOString() || null,
      };
    });

    // ---- Subscriptions ----
    const subSnap = await db.collection('subscriptions').get();
    const subs = subSnap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Convert renewalDate → ISO string
        renewalDate: data.renewalDate?.toDate?.().toISOString() || null,
      };
    });

    return new Response(
      JSON.stringify({ users, subs }),
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