'use client';

import { createContext, useState, useEffect, useContext } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  signOut, 
  signInWithPopup, 
  GoogleAuthProvider 
} from 'firebase/auth';
import { app } from '@/lib/firebase';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const auth = getAuth(app);
const db = getFirestore(app);

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState(''); 
  const [stripeCustomerId, setStripeCustomerId] = useState(null); 
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const unsubSnapshot = onSnapshot(userRef, (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            setPlan(data?.plan || 'free');
            setPhone(data?.phone || '');
            setStripeCustomerId(data?.stripeCustomerId || data?.lemonCustomerId || null);
          } else {
            setPlan('free');
          }
          setLoading(false);
        }, (error) => {
          console.error("Auth Snapshot Error:", error);
          setLoading(false);
        });
        return () => unsubSnapshot();
      } else {
        setPlan(null);
        setPhone('');
        setStripeCustomerId(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google Login failed:", error);
      throw error;
    }
  };

  const handleSignOut = async () => {
    try { await signOut(auth); router.push('/login'); } 
    catch (error) { console.error('Logout error:', error); }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      plan, 
      loading, 
      phone, 
      stripeCustomerId, 
      loginWithGoogle, 
      signOut: handleSignOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
}