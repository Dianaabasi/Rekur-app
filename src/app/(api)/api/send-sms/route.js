// import axios from 'axios';

// export async function POST(request) {
//   const { to, body } = await request.json();

//   // Validate
//   if (!to || !body) {
//     return new Response(JSON.stringify({ error: 'Missing to or body' }), { status: 400 });
//   }

//   try {
//     const response = await axios.post(
//       'https://api.ng.termii.com/api/sms/send',
//       {
//         to: to.replace('+', ''), // e.g., 2348147615490
//         from: process.env.TERMII_SENDER_ID,
//         sms: body,
//         type: 'plain',
//         api_key: process.env.TERMII_API_KEY,
//         channel: 'dnd',
//       },
//       {
//         headers: { 'Content-Type': 'application/json' },
//         timeout: 10000,
//       }
//     );

//     console.log(`SMS sent: ${response.data.message} (ID: ${response.data.request_id})`);
//     return new Response(JSON.stringify({ status: 'sent', data: response.data }), { status: 200 });
//   } catch (error) {
//     const errMsg = error.response?.data?.message || error.message;
//     console.error('Termii SMS error:', errMsg);
//     return new Response(JSON.stringify({ error: errMsg }), { status: 500 });
//   }
// }

// src/app/api/send-sms/route.js (Termii Demo Mode - Working)
export async function POST(request) {
  const { to, body } = await request.json();

  // Demo mode (logs only, no approval needed)
  const demoMode = true; // Set to false for production

  if (demoMode) {
    console.log(`🧪 DEMO SMS: To ${to}: "${body}"`);
    return new Response(JSON.stringify({ status: 'sent (demo)', message: 'Demo mode - SMS logged' }), { status: 200 });
  }

  try {
    const response = await fetch('https://api.ng.termii.com/api/sms/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: to.replace('+', ''), // e.g., 2348147615490
        from: process.env.TERMII_SENDER_ID,
        sms: body,
        type: 'plain',
        api_key: process.env.TERMII_API_KEY,
        channel: 'dnd',
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'SMS failed');

    console.log(`✅ SMS sent: ${data.message} (ID: ${data.request_id})`);
    return new Response(JSON.stringify({ status: 'sent', data }), { status: 200 });
  } catch (error) {
    console.error('Termii SMS error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}