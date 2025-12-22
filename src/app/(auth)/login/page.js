'use client';
export const dynamic = 'force-dynamic'; // Disables prerendering

import { useState, useContext } from 'react';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUser } = useContext(AuthContext);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      router.push('/dashboard');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
      console.error(err);
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError('');
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      setUser(userCredential.user);
      router.push('/dashboard');
    } catch (err) {
      setError('Google sign-in failed. Please try again.');
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/rekur.png" alt="Rekur" width={100} height={100} />
          </Link>
        </div>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-sm text-muted-foreground">Sign in to manage your subscriptions</p>
        </div>

        {/* Error */}
        {error && <div className="text-destructive text-sm text-center">{error}</div>}

        {/* Email/Password Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="pl-10 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </Button>
        </form>

        {/* Forgot Password BELOW Button */}
        <div className="text-center">
          <Link href="/forgot-password" className="text-xs text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        {/* Google Button */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or sign in with</span>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogle}
          disabled={loading}
        >
          <Image src="/google-icon.png" alt="Google" width={20} height={20} className="mr-2" />
          Sign in with Google
        </Button>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-muted-foreground">
          Don`t have an account?{' '}
          <Link href="/register" className="text-primary hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

// 'use client';
// export const dynamic = 'force-dynamic';

// import { useState } from 'react';
// import { signInWithEmailAndPassword } from 'firebase/auth';
// import { auth } from '@/lib/firebase'; // Use the auth instance from your firebase lib
// import { useAuth } from '@/context/AuthContext'; // Use the hook you created
// import { useRouter } from 'next/navigation';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import Link from 'next/link';
// import Image from 'next/image';
// import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
  
//   // 1. Correctly consume the context
//   const { setUser, loginWithGoogle } = useAuth(); 
//   const router = useRouter();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       setUser(userCredential.user);
//       router.push('/dashboard');
//     } catch (err) {
//       setError('Invalid email or password. Please try again.');
//       console.error(err);
//     }
//     setLoading(false);
//   };

//   // 2. Local handleGoogle is removed. The button now calls loginWithGoogle from context.

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-background px-4">
//       <div className="w-full max-w-md space-y-8">
//         <div className="flex justify-center">
//           <Link href="/" className="flex items-center gap-2">
//             <Image src="/rekur.png" alt="Rekur" width={100} height={100} />
//           </Link>
//         </div>

//         <div className="text-center">
//           <h1 className="text-2xl font-bold">Welcome Back</h1>
//           <p className="text-sm text-muted-foreground">Sign in to manage your subscriptions</p>
//         </div>

//         {error && <div className="text-destructive text-sm text-center">{error}</div>}

//         <form onSubmit={handleLogin} className="space-y-4">
//           <div>
//             <Label htmlFor="email">Email Address</Label>
//             <div className="relative">
//               <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="you@example.com"
//                 className="pl-10"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>
//           </div>

//           <div>
//             <Label htmlFor="password">Password</Label>
//             <div className="relative">
//               <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//               <Input
//                 id="password"
//                 type={showPassword ? 'text' : 'password'}
//                 placeholder="••••••••"
//                 className="pl-10 pr-10"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
//               >
//                 {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//               </button>
//             </div>
//           </div>

//           <Button type="submit" className="w-full" disabled={loading}>
//             {loading ? 'Signing in...' : 'Login'}
//           </Button>
//         </form>

//         <div className="text-center">
//           <Link href="/forgot-password" className="text-xs text-primary hover:underline">
//             Forgot password?
//           </Link>
//         </div>

//         <div className="relative">
//           <div className="absolute inset-0 flex items-center">
//             <span className="w-full border-t" />
//           </div>
//           <div className="relative flex justify-center text-xs uppercase">
//             <span className="bg-background px-2 text-muted-foreground">Or sign in with</span>
//           </div>
//         </div>

//         {/* 3. Button now correctly triggers the context redirect function */}
//         <Button
//           type="button"
//           variant="outline"
//           className="w-full"
//           onClick={() => {
//             setError('');
//             loginWithGoogle();
//           }}
//           disabled={loading}
//         >
//           <Image src="/google-icon.png" alt="Google" width={20} height={20} className="mr-2" />
//           Sign in with Google
//         </Button>

//         <p className="text-center text-sm text-muted-foreground">
//           Don`t have an account?{' '}
//           <Link href="/register" className="text-primary hover:underline">
//             Sign Up
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }