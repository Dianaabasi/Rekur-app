'use client';

export const dynamic = 'force-dynamic';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { getAuth, confirmPasswordReset } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

const auth = getAuth(app);

export default function VerifyPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const oobCode = searchParams.get('oobCode');

  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!oobCode) {
    // Redirect if no code (runs client‑side because of 'use client')
    router.replace('/login?error=invalid-link');
    return null;
  }

  const handleReset = async () => {
    if (!newPassword.trim()) {
      setMessage('Please enter a new password');
      return;
    }

    setLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setMessage('Password reset successful! Redirecting...');
      setTimeout(() => router.push('/login'), 2000);
    } catch (error) {
      setMessage(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Reset Your Password</h1>
          <p className="text-sm text-gray-600 mt-2">Enter your new password below</p>
        </div>

        <div className="space-y-4">
          <Input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
          />
          <Button 
            onClick={handleReset} 
            className="w-full" 
            disabled={loading || !newPassword.trim()}
          >
            {loading ? 'Saving...' : 'Set New Password'}
          </Button>
        </div>

        {message && (
          <p className={`text-center text-sm ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}