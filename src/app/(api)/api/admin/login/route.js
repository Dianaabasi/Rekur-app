// src/app/(api)/api/admin/login/route.js
import { createAdminToken, buildSetCookieHeader } from '@/lib/admin-auth';

export async function POST(request) {
  const { email, password } = await request.json();

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error('CRITICAL: ADMIN_EMAIL or ADMIN_PASSWORD env vars are not set.');
    return new Response(JSON.stringify({ error: 'Server configuration error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Constant-time string comparison to prevent timing attacks
  const { createHmac } = await import('crypto');
  const secret = process.env.ADMIN_JWT_SECRET || 'fallback';
  const inputHash = createHmac('sha256', secret).update(`${email}:${password}`).digest('hex');
  const validHash = createHmac('sha256', secret).update(`${adminEmail}:${adminPassword}`).digest('hex');

  const emailMatch = email === adminEmail;
  const hashMatch = inputHash === validHash;

  if (!emailMatch || !hashMatch) {
    return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const token = createAdminToken();

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': buildSetCookieHeader(token),
    },
  });
}
