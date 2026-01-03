// 'use client';

// import { createContext, useState, useEffect, useContext } from 'react';
// import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
// import { app } from '@/lib/firebase';
// import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
// import { useRouter } from 'next/navigation';

// const auth = getAuth(app);
// const db = getFirestore(app);

// export const AuthContext = createContext();

// // Hook for components to easily consume the context
// export const useAuth = () => useContext(AuthContext);

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [plan, setPlan] = useState(null);
//   const [phone, setPhone] = useState('');
//   const [stripeCustomerId, setStripeCustomerId] = useState(null); // ← NEW
//   const [teamMembers, setTeamMembers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       setUser(currentUser);
//       if (currentUser) {
//         const userRef = doc(db, 'users', currentUser.uid);
        
//         const unsubSnapshot = onSnapshot(userRef, (snap) => {
//           if (snap.exists()) {
//             const data = snap.data();
//             setPlan(data?.plan || 'free');
//             setPhone(data?.phone || '');
//             setStripeCustomerId(data?.stripeCustomerId || null); // ← LOAD IT
//             setTeamMembers(data?.teamMembers || []);
//           } else {
//             setPlan('free');
//             setStripeCustomerId(null);
//           }
//           setLoading(false);
//         });
        
//         return () => unsubSnapshot();
//       } else {
//         setPlan(null);
//         setPhone('');
//         setStripeCustomerId(null); // ← CLEAR ON LOGOUT
//         setTeamMembers([]);
//         setLoading(false);
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   const handleSignOut = async () => {
//     try {
//       await signOut(auth);
//       router.push('/login');
//     } catch (error) {
//       console.error('Logout error:', error);
//       throw error;
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ 
//       user, 
//       setUser, 
//       plan, 
//       setPlan, 
//       phone, 
//       setPhone,
//       stripeCustomerId,        // ← EXPORT
//       setStripeCustomerId,     // ← EXPORT
//       teamMembers,
//       loading,
//       signOut: handleSignOut
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }


'use client';

import { createContext, useState, useEffect, useContext } from 'react';
import { getAuth, onAuthStateChanged, signOut, signInWithRedirect, GoogleAuthProvider, getRedirectResult } from 'firebase/auth';
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
  const router = useRouter();

  useEffect(() => {
    getRedirectResult(auth).catch((error) => console.error("Redirect login error:", error));

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const unsubSnapshot = onSnapshot(userRef, (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            setPlan(data?.plan || 'free');
          } else {
            setPlan('free');
          }
          setLoading(false);
        });
        return () => unsubSnapshot();
      } else {
        setPlan(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try { await signInWithRedirect(auth, provider); } 
    catch (error) { console.error("Login failed:", error); throw error; }
  };

  const handleSignOut = async () => {
    try { await signOut(auth); router.push('/login'); } 
    catch (error) { console.error('Logout error:', error); }
  };

  return (
    <AuthContext.Provider value={{ user, plan, loading, loginWithGoogle, signOut: handleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
}