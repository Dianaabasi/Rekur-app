'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { parsePhoneNumber } from 'libphonenumber-js';
import { app } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext'; // Use the hook for Google login
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, User, Mail, Phone, Lock, Loader2 } from 'lucide-react';

const auth = getAuth(app);
const db = getFirestore(app);

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+1');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { loginWithGoogle } = useAuth(); // Only import loginWithGoogle, NO setUser
  const router = useRouter();

  const validatePhone = (value) => {
    try {
      const phoneNumber = parsePhoneNumber(value);
      return phoneNumber && phoneNumber.isValid();
    } catch {
      return false;
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!fullName.trim()) return setError('Full name is required');
    if (password !== confirmPassword) return setError('Passwords do not match');
    if (!validatePhone(phone)) return setError('Please enter a valid phone number with country code');

    setLoading(true);
    try {
      // 1. Create Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Update Profile Display Name
      await updateProfile(user, { displayName: fullName });

      // 3. Create Firestore Document
      const phoneNumber = parsePhoneNumber(phone);
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        fullName: fullName,
        displayName: fullName, // Useful to have standard field too
        phone: phoneNumber ? phoneNumber.formatInternational() : phone,
        plan: 'free',
        teamMembers: [],
        createdAt: new Date().toISOString(),
      });

      // 4. Redirect (AuthContext updates automatically)
      router.push('/dashboard');

    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Try logging in.');
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError('');
    try {
      await loginWithGoogle(); // Uses the context popup method
      
      // Auto-heal logic handles DB creation, but we can enforce it here if needed
      // ensuring we don't overwrite if it already exists is handled by merge: true in most auto-heal scripts
      // For now, simply redirecting is safe as the Dashboard handles checking/healing the user doc.
      
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Google sign-up failed. Please try again.');
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-sm text-muted-foreground">Join Rekur and take control of your subscriptions</p>
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 rounded-md text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="fullName"
                placeholder="John Doe"
                className="pl-10"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          </div>

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
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                className="pl-10"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Include country code (e.g. +1)</p>
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

          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                placeholder="••••••••"
                className="pl-10 pr-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </form>

        {/* Google Button */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or sign up with</span>
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
          Sign up with Google
        </Button>

        {/* Sign In Link */}
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}