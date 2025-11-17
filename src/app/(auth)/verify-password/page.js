// 'use client';

// export const dynamic = 'force-dynamic';

// import { useState } from 'react';
// import { getAuth, confirmPasswordReset } from 'firebase/auth';
// import { app } from '@/lib/firebase';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { useSearchParams, useRouter } from 'next/navigation';

// const auth = getAuth(app);

// export default function VerifyPassword() {
//   const [code, setCode] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const oobCode = searchParams.get('oobCode'); // From reset email link

//   const handleVerify = async () => {
//     try {
//       await confirmPasswordReset(auth, oobCode, newPassword);
//       setMessage('Password reset successful.');
//       router.push('/login');
//     } catch (error) {
//       setMessage(error.message);
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center">
//       <div className="w-full max-w-md space-y-4">
//         <Input placeholder="Verification Code (if needed)" value={code} onChange={(e) => setCode(e.target.value)} /> {/* Optional if using link */}
//         <Input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
//         <Button onClick={handleVerify}>Verify and Reset</Button>
//         <p>{message}</p>
//       </div>
//     </div>
//   );
// }

// app/(auth)/verify-password/page.js

// THIS MUST BE A SERVER COMPONENT — NO 'use client' HERE
export const dynamic = 'force-dynamic';
export const revalidate = false;  // false = never prerender

import { useSearchParams } from 'next/navigation';
import { getAuth, confirmPasswordReset } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { redirect } from 'next/navigation';

const auth = getAuth(app);

export default function VerifyPasswordPage() {
  const searchParams = useSearchParams();
  const oobCode = searchParams.get('oobCode');

  if (!oobCode) {
    redirect('/login?error=invalid-link');
  }

  // This part is now a Client Component (we'll extract it)
  return <ResetForm oobCode={oobCode} />;
}

// Separate Client Component
function ResetForm({ oobCode }) {
  'use client';

  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async () => {
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setMessage('Password reset successful! Redirecting...');
      setTimeout(() => redirect('/login'), 2000);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow">
        <h1 className="text-2xl font-bold text-center">Reset Your Password</h1>
        <Input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Button onClick={handleReset} className="w-full">
          Set New Password
        </Button>
        {message && <p className="text-center text-sm">{message}</p>}
      </div>
    </div>
  );
}