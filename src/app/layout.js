import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Toaster from '@/components/ui/toaster';

export const metadata = {
  metadataBase: new URL('https://www.rekur-app.com'),
  title: {
    default: 'Rekur - Smart Subscription Tracker & Multi-Channel Reminders',
    template: '%s | Rekur',
  },
  description:
    'Stop surprise charges and save money. Track all your recurring subscriptions in one sleek dashboard with automatic reminders via Email, SMS, and WhatsApp.',
  keywords: [
    'subscription tracker',
    'recurring expense tracker',
    'subscription manager',
    'bill reminder app',
    'whatsapp bill alert',
    'sms subscription reminder',
    'saas spend management',
    'personal finance tool',
  ],
  authors: [{ name: 'Rekur Team', url: 'https://www.rekur-app.com' }],
  creator: 'Rekur',
  publisher: 'Rekur',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Rekur - Never Forget a Subscription Again',
    description:
      'Track all recurring expenses, analyze monthly burn rate, and receive intelligent renewal alerts via Email, SMS, or WhatsApp.',
    url: 'https://www.rekur-app.com',
    siteName: 'Rekur',
    images: [
      {
        url: '/rekur.png',
        width: 1200,
        height: 630,
        alt: 'Rekur Subscription Tracker Dashboard',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rekur - Smart Subscription Tracker',
    description:
      'Never get hit with a surprise subscription renewal again. Multi-channel alerts on WhatsApp, SMS, and Email.',
    images: ['/rekur.png'],
    creator: '@rekurapp',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/rekur.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}