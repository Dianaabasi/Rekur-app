import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Toaster from '@/components/ui/toaster';

export const metadata = {
  title: {
    default: "Rekur - Smart Subscription Tracker",
    template: "%s | Rekur"
  },
  description: "Track all your subscriptions in one place. Get reminders via Email, SMS, and WhatsApp so you never pay for an unwanted service again.",
  keywords: ["subscription tracker", "finance manager", "bill reminders", "saas management"],
  openGraph: {
    title: "Rekur - Never Miss a Payment",
    description: "Manage your Netflix, Spotify, and SaaS subscriptions effortlessly.",
    url: 'https://rekur-app.com',
    siteName: 'Rekur',
    images: [
      {
        url: '/rekur.png', // Ensure this image exists in your public folder
        width: 800,
        height: 600,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
            {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}