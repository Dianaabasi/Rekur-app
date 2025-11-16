import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Toaster from '@/components/ui/toaster';

export const metadata = {
  title: 'Rekur - Subscription Tracker',
  description: 'Track your subscriptions easily',
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