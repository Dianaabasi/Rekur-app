// src/app/(api)/api/send-sms/route.js
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '@/lib/firebase';

const functions = getFunctions(app);
// Optional: connect to emulator when developing
// connectFunctionsEmulator(functions, 'localhost', 5001);

export async function POST(request) {
  const { to, body } = await request.json();

  // Basic validation
  if (!to || !body) {
    return new Response(JSON.stringify({ error: 'Missing to or body' }), { status: 400 });
  }

  try {
    const sendSms = httpsCallable(functions, 'ext-twilio-send-sms-sendSms');

    const result = await sendSms({
      to: to.startsWith('+') ? to : `+${to}`, // ensure + prefix
      message: body,
    });

    console.log('Twilio SMS sent:', result.data);

    return new Response(
      JSON.stringify({ status: 'sent', sid: result.data.sid }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Twilio SMS error:', error.message, error.details);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to send SMS' }),
      { status: 500 }
    );
  }
}