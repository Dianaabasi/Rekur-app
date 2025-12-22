// src/app/api/cron/check-reminders/route.js
import { initializeApp, cert, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { isToday, subDays, parseISO } from 'date-fns';

// ---------- Firebase Admin ----------
let adminApp;
try {
  adminApp = getApp('reminder-cron');
} catch {
  const serviceAccount = JSON.parse(
    Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'base64').toString('utf-8')
  );
  adminApp = initializeApp(
    { credential: cert(serviceAccount) },
    'reminder-cron'
  );
}
const db = getFirestore(adminApp);

// ---------- Helper API callers ----------
async function sendEmail(to, subject, dynamicData) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/send-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, subject, dynamicData }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Email failed');
  console.log(`Email sent to ${to}`);
  return data;
}

async function sendSMS(to, body) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/send-sms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, body }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'SMS failed');
  console.log(`SMS sent to ${to}`);
  return data;
}

async function sendWhatsApp(to, body) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/send-whatsapp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, body }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'WhatsApp failed');
  console.log(`WhatsApp sent to ${to}`);
  return data;
}

// ---------- Main GET (cron) ----------
export async function GET() {
  try {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    console.log(`Cron running at ${now.toISOString()} - checking reminders due ${todayStr}`);

    const snap = await db.collection('subscriptions').get();
    console.log(`Found ${snap.size} subscriptions`);

    const promises = [];
    let sentCount = 0;

    for (const doc of snap.docs) {
      const sub = doc.data();
      const {
        renewalDate,
        remindDays = [],
        name,
        price,
        userId,
        emailReminder,
        smsReminder,
        whatsappReminder,
      } = sub;

      console.log(`Checking sub "${name}" (ID: ${doc.id})`);

      if (!remindDays.length) {
        console.log(`   → Skipping (no remindDays)`);
        continue;
      }

      const renewal = parseISO(renewalDate);
      if (isNaN(renewal.getTime())) {
        console.log(`   → Skipping (invalid renewalDate: ${renewalDate})`);
        continue;
      }

      const userDoc = await db.doc(`users/${userId}`).get();
      if (!userDoc.exists) {
        console.log(`   → Skipping (user ${userId} not found)`);
        continue;
      }
      const user = userDoc.data();
      const { email, phone, plan } = user;
      const canSMS = plan === 'pro' || plan === 'business';
      const canWA = plan === 'pro' || plan === 'business';

      console.log(`   → User: ${email} (plan: ${plan})`);

      let sentAny = false;

      for (const days of remindDays) {
        const remindDate = subDays(renewal, days);
        if (!isToday(remindDate)) {
          console.log(`   → Skip ${days}d (due ${remindDate.toISOString().split('T')[0]})`);
          continue;
        }

        console.log(`   → Due today for ${days}d reminder`);

        const renewalDateStr = renewal.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });

        const message = `Reminder: ${name} renews in ${days} day${days > 1 ? 's' : ''} on ${renewalDateStr} for $${price.toFixed(2)}.`;
        const subject = `${name} - Renewal Reminder (${days} day${days > 1 ? 's' : ''})`;

        // === EMAIL (HTML Dynamic Template) ===
        if (emailReminder !== false && email) {
          const dynamicData = {
            userName: user.displayName || email.split('@')[0],
            name,
            price: price.toFixed(2),
            renewalDate: renewalDateStr,
            plan: user.plan || 'Personal',
            renewalLink: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
            billingLink: `${process.env.NEXT_PUBLIC_URL}/account`,
          };

          sentAny = true;
          promises.push(
            sendEmail(email, subject, dynamicData)
              .then(() => logReminder(doc.id, userId, 'email', days, true))
              .catch((err) => {
                console.error(`   → Email failed: ${err.message}`);
                logReminder(doc.id, userId, 'email', days, false, err.message);
              })
          );
        }

        // === SMS ===
        if (smsReminder && canSMS && phone) {
          sentAny = true;
          promises.push(
            sendSMS(phone, message)
              .then(() => logReminder(doc.id, userId, 'sms', days, true))
              .catch((err) => {
                console.error(`   → SMS failed: ${err.message}`);
                logReminder(doc.id, userId, 'sms', days, false, err.message);
              })
          );
        }

        // === WHATSAPP ===
        if (whatsappReminder && canWA && phone) {
          sentAny = true;
          promises.push(
            sendWhatsApp(phone, message)
              .then(() => logReminder(doc.id, userId, 'whatsapp', days, true))
              .catch((err) => {
                console.error(`   → WhatsApp failed: ${err.message}`);
                logReminder(doc.id, userId, 'whatsapp', days, false, err.message);
              })
          );
        }
      }

      if (sentAny) sentCount++;
    }

    await Promise.allSettled(promises);
    console.log(`Sent reminders for ${sentCount} subscriptions`);

    return new Response(
      JSON.stringify({ status: 'ok', processed: snap.size, sent: sentCount }),
      { status: 200 }
    );
  } catch (err) {
    console.error('Cron error:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// Log helper
async function logReminder(subId, userId, channel, days, success, error = null) {
  await db.collection('reminderLogs').add({
    subscriptionId: subId,
    userId,
    channel,
    daysBefore: days,
    success,
    error,
    sentAt: new Date().toISOString(),
  });
}