# Rekur – Subscription Tracker

Never forget a Subscription again.


## Overview

Rekur is a modern, beautiful subscription management app built with Next.js 16 (App Router), Firebase, and Shadcn UI. Track your recurring expenses, get smart reminders via Email, SMS, or WhatsApp, and upgrade to Pro or Business plans with Stripe.


## Feature Comparison

| Feature                                      | Free | Pro | Business |
|---------------------------------------------|:----:|:---:|:--------:|
| Track up to 5 subscriptions                  | Yes  | Yes | Yes      |
| Unlimited subscriptions                      | No   | Yes | Yes      |
| Email reminders                              | Yes  | Yes | Yes      |
| SMS & WhatsApp reminders (Twilio)            | No   | Yes | Yes      |
| Custom reminder days (15, 7, 3, 1)           | No   | Yes | Yes      |
| Export to CSV                                | No   | Yes | Yes      |
| Total monthly cost widget                    | No   | Yes | Yes      |
| Team collaboration & invites                 | No   | No  | Yes      |
| Priority support                             | No   | No  | Yes      |


## Tech Stack

- Framework: Next.js 16 (App Router + Turbopack)
- UI: Shadcn UI + Tailwind CSS
- Auth & DB: Firebase (Authentication + Firestore)
- Payments: Stripe (Checkout + Webhooks)
- Icons: Lucide React
- Date utilities: date-fns
- Deployment: Hostinger


## Project Structure

```
rekur-app/
├── src/
│   ├── app/
│   │   ├── (dashboard)/dashboard/page.js     → Main dashboard
│   │   ├── pricing/page.js                   → Stripe plans
│   │   └── layout.js
│   ├── components/
│   │   ├── ui/                               → Shadcn components
│   │   └── Header.js
│   ├── lib/
│   │   ├── firebase.js                       → Firebase config
│   │   └── utils.js
│   └── context/
│       └── AuthContext.js                    → User & plan state
├── public/
├── .env.local                                → Firebase + Stripe keys
└── package.json
```


## License

MIT © Rekur


Made with love by Diana-Abasi Ekpenyong.

rekur.app • Twitter • hello@rekur.app