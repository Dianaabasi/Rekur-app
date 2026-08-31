// src/app/(api)/api/send-sms/route.js
import { createHmac } from 'crypto';

export async function POST(request) {
  // Only allow internal calls from the cron job
  const incomingSecret = request.headers.get('x-cron-secret');
  if (!process.env.CRON_SECRET || incomingSecret !== process.env.CRON_SECRET) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { to, body } = await request.json();

  if (!to || !body) {
    return new Response(JSON.stringify({ error: 'Missing to or body' }), { status: 400 });
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    console.error('Missing Twilio credentials in env');
    return new Response(JSON.stringify({ error: 'Server configuration error' }), { status: 500 });
  }

  const toNumber = to.startsWith('+') ? to : `+${to}`;

  try {
    const credentials = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: toNumber,
          From: fromNumber,
          Body: body,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Twilio SMS failed');
    }

    console.log('Twilio SMS sent:', data.sid);
    return new Response(JSON.stringify({ status: 'sent', sid: data.sid }), { status: 200 });
  } catch (error) {
    console.error('Twilio SMS error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to send SMS' }),
      { status: 500 }
    );
  }
}