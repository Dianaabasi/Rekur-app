// src/lib/admin-auth.js
// Server-only utility — never import this from a client component.
import crypto from 'crypto';

export const ADMIN_COOKIE_NAME = 'rekur_admin_session';
const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Creates a signed admin session token:
 *   base64(payload) + "." + HMAC-SHA256(payload, ADMIN_JWT_SECRET)
 */
export function createAdminToken() {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) throw new Error('ADMIN_JWT_SECRET env var is not set.');

  const payload = `admin:${Date.now()}`;
  const sig = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return `${Buffer.from(payload).toString('base64')}.${sig}`;
}

/**
 * Returns true if the token is valid and not expired.
 */
export function verifyAdminToken(token) {
  if (!token || typeof token !== 'string') return false;

  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) return false;

  try {
    const dotIndex = token.lastIndexOf('.');
    if (dotIndex === -1) return false;

    const b64Payload = token.slice(0, dotIndex);
    const receivedSig = token.slice(dotIndex + 1);
    const payload = Buffer.from(b64Payload, 'base64').toString('utf-8');

    const expectedSig = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    // Constant-time comparison to prevent timing attacks
    const receivedBuf = Buffer.from(receivedSig, 'utf-8');
    const expectedBuf = Buffer.from(expectedSig, 'utf-8');
    if (receivedBuf.length !== expectedBuf.length) return false;
    if (!crypto.timingSafeEqual(receivedBuf, expectedBuf)) return false;

    // Check expiry
    const timestamp = parseInt(payload.split(':')[1], 10);
    if (isNaN(timestamp) || Date.now() - timestamp > SESSION_MAX_AGE_MS) return false;

    return true;
  } catch {
    return false;
  }
}

/**
 * Extracts the admin session token from a Request's Cookie header.
 */
export function getAdminTokenFromRequest(request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(
    new RegExp(`(?:^|;\\s*)${ADMIN_COOKIE_NAME}=([^;]+)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Verifies the admin token from a Request object.
 * Returns true if the caller is a valid admin session.
 */
export function isAdminRequest(request) {
  const token = getAdminTokenFromRequest(request);
  return verifyAdminToken(token);
}

/**
 * Returns a Set-Cookie string that sets the admin session cookie.
 */
export function buildSetCookieHeader(token) {
  const isProduction = process.env.NODE_ENV === 'production';
  return [
    `${ADMIN_COOKIE_NAME}=${encodeURIComponent(token)}`,
    'HttpOnly',
    'Path=/',
    `Max-Age=${SESSION_MAX_AGE_MS / 1000}`,
    'SameSite=Strict',
    isProduction ? 'Secure' : '',
  ]
    .filter(Boolean)
    .join('; ');
}

/**
 * Returns a Set-Cookie string that clears the admin session cookie.
 */
export function buildClearCookieHeader() {
  const isProduction = process.env.NODE_ENV === 'production';
  return [
    `${ADMIN_COOKIE_NAME}=`,
    'HttpOnly',
    'Path=/',
    'Max-Age=0',
    'SameSite=Strict',
    isProduction ? 'Secure' : '',
  ]
    .filter(Boolean)
    .join('; ');
}
