'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { useState } from 'react';
import { getAuth, confirmPasswordReset } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSearchParams, useRouter } from 'next/navigation';

const auth = getAuth(app);

export default function VerifyPassword() {
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const oobCode = searchParams.get('oobCode'); // From reset email link

  const handleVerify = async () => {
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setMessage('Password reset successful.');
      router.push('/login');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-4">
        <Input placeholder="Verification Code (if needed)" value={code} onChange={(e) => setCode(e.target.value)} /> {/* Optional if using link */}
        <Input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        <Button onClick={handleVerify}>Verify and Reset</Button>
        <p>{message}</p>
      </div>
    </div>
  );
}