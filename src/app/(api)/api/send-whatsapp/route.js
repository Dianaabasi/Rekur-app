// src/app/api/send-whatsapp/route.js (WhatsApp Cloud API)
import axios from 'axios';

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

  try {
    const response = await axios.post(
      `https://graph.facebook.com/${process.env.WHATSAPP_VERSION}/${process.env.WHATSAPP_PHONE_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: to.replace('+', ''),  // e.g., 2348147615490
        type: 'text',
        text: {
          body: body,
        },
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(`✅ WhatsApp sent: ID=${response.data.messages[0].id}`);
    return new Response(JSON.stringify({ status: 'sent' }), { status: 200 });
  } catch (error) {
    console.error('WhatsApp Cloud error:', error.response?.data || error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}