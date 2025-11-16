import { initializeApp, cert } from 'firebase-admin/app';

const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'base64').toString('utf-8'));

const adminApp = initializeApp({
  credential: cert(serviceAccount),
}, 'admin');

export { adminApp };