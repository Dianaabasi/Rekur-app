'use client';

import { createContext, useState, useEffect, useContext } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { getFirestore, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const auth = getAuth(app);
const db = getFirestore(app);

export const AuthContext = createContext();

// Hook for components to easily consume the context
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [plan, setPlan] = useState(null);
  const [phone, setPhone] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        
        // Use onSnapshot to listen for real-time plan changes
        const unsubSnapshot = onSnapshot(userRef, (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            setPlan(data?.plan || 'free'); // Set plan from data
            setPhone(data?.phone || '');
            setTeamMembers(data?.teamMembers || []);
          } else {
            
            setPlan('free'); 
          }
          setLoading(false); // Set loading false *after* plan is set
        });
        
        // Return the snapshot listener to be cleaned up when auth state changes
        return () => unsubSnapshot();

      } else {
        // User is logged out
        setPlan(null); // <-- Set plan to null for logged-out user
        setPhone('');
        setTeamMembers([]);
        setLoading(false); // <-- FIX 3: Set loading false for logged-out user
      }
    });

    // Return the auth listener to be cleaned up
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      plan, 
      setPlan, 
      phone, 
      setPhone, 
      teamMembers,
      loading, // Export the loading state
      signOut: handleSignOut
    }}>
      {/* !loading check not needed here, 
          as consumers will check it */}
      {children}
    </AuthContext.Provider>
  );
}