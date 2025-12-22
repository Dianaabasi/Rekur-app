// src/app/api/send-email/route.js
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(request) {
  const { to, subject, dynamicData = {} } = await request.json();

  // Validate required fields
  if (!to || !dynamicData.name || !dynamicData.renewalDate) {
    return new Response(
      JSON.stringify({ error: 'Missing required fields: to, name, renewalDate' }),
      { status: 400 }
    );
  }

  try {
    const msg = {
      to,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL,
        name: 'ReKur Team',
      },
      subject, // e.g., "Netflix – Renewal in 1 day"
      templateId: 'd-c87c3bda1be04cb38a71026e72d69c39', // Your template
      dynamicTemplateData: {
        userName: dynamicData.userName || to.split('@')[0],
        name: dynamicData.name,
        price: `$${Number(dynamicData.price).toFixed(2)}`,
        renewalDate: dynamicData.renewalDate,
        plan: dynamicData.plan || 'Personal',
        renewalLink: dynamicData.renewalLink || 'https://rekur.app/dashboard',
        billingLink: dynamicData.billingLink || 'https://rekur.app/account',
        privacyUrl: 'https://rekur.app/privacy',
        ...dynamicData,
      },
      asm: {
        group_id: 31997, // Must exist in SendGrid
        groups_to_display: [31997],
      },
    };

    const response = await sgMail.send(msg);
    console.log(`Email sent: ${response[0].statusCode} to ${to}`);
    return new Response(JSON.stringify({ status: 'sent' }), { status: 200 });
  } catch (error) {
    console.error('SendGrid error:', error.response?.body || error.message);
    return new Response(
      JSON.stringify({ 
        error: error.response?.body || error.message 
      }),
      { status: 500 }
    );
  }
}