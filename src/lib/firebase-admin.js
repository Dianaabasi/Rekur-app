// src/lib/firebase-admin.js
// Lazy-initialized Firebase Admin SDK.
// IMPORTANT: Call getAdminApp() / getAdminDb() / getAdminAuth()
// from INSIDE route handlers only — never at module scope.
import { initializeApp, cert, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

export function getAdminApp() {
  try {
    return getApp('admin');
  } catch {
    const serviceAccount = JSON.parse(
      Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'base64').toString('utf-8')
    );
    return initializeApp({ credential: cert(serviceAccount) }, 'admin');
  }
}

export function getAdminDb() {
  return getFirestore(getAdminApp());
}

export function getAdminAuth() {
  return getAuth(getAdminApp());
}