'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, onSnapshot } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format, isToday } from 'date-fns';
import { useToast } from "@/components/ui/use-toast";

function InvitePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const ownerId = searchParams.get('owner');
  
  const [status, setStatus] = useState('checking'); // checking, joining, viewing, error
  const [ownerSubscriptions, setOwnerSubscriptions] = useState([]);

  // 1. Handle joining logic
  useEffect(() => {
    // If auth is loading or there's no ownerId, we don't need to run this effect
    // (The 'no ownerId' case is now handled by the render logic below)
    if (authLoading || !ownerId) return;

    if (!user) {
      const returnUrl = encodeURIComponent(`/invite?owner=${ownerId}`);
      router.push(`/register?redirect=${returnUrl}`);
      return;
    }

    const checkAndJoinTeam = async () => {
      try {
        if (user.uid === ownerId) {
            router.push('/dashboard');
            return;
        }

        const q = query(
          collection(db, 'teamInvites'), 
          where('workspaceOwner', '==', ownerId),
          where('email', '==', user.email)
        );
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          setStatus('joining');
          await addDoc(collection(db, 'teamInvites'), {
            email: user.email,
            workspaceOwner: ownerId,
            status: 'accepted',
            joinedAt: new Date().toISOString()
          });
          toast({ title: "Welcome!", description: "You have joined the workspace." });
        }
        
        setStatus('viewing');
      } catch (error) {
        console.error("Join error:", error);
        setStatus('error');
      }
    };

    checkAndJoinTeam();
  }, [user, authLoading, ownerId, router, toast]);

  // 2. Load Owner's Data (View Only)
  useEffect(() => {
    if (status !== 'viewing' || !ownerId) return;

    const q = query(collection(db, 'subscriptions'), where('userId', '==', ownerId));
    const unsub = onSnapshot(q, (snap) => {
      const subs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOwnerSubscriptions(subs);
    });

    return () => unsub();
  }, [status, ownerId]);

  // --- RENDER LOGIC ---

  // 1. Immediate Error Check: If ownerId is missing, show error immediately.
  // This avoids calling setStatus('error') inside the useEffect.
  if (!ownerId || status === 'error') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6 text-center">
          <h2 className="text-xl font-bold text-destructive mb-2">Invalid Invitation</h2>
          <p>The invite link is broken or expired.</p>
          <Button onClick={() => router.push('/')} className="mt-4">Go Home</Button>
        </Card>
      </div>
    );
  }

  // 2. Loading States
  if (authLoading || status === 'checking' || status === 'joining') {
    return <div className="flex items-center justify-center min-h-screen">Loading Workspace...</div>;
  }

  // 3. Success State
  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-6xl">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Shared Workspace</h1>
          <p className="text-muted-foreground">Viewing read-only access</p>
        </div>
        <Button variant="outline" onClick={() => router.push('/dashboard')}>
          Back to My Dashboard
        </Button>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Subscriptions ({ownerSubscriptions.length})</h2>
        {ownerSubscriptions.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">This workspace has no subscriptions yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Renewal</TableHead>
                <TableHead>Category</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ownerSubscriptions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium">{sub.name}</TableCell>
                  <TableCell>${sub.price}</TableCell>
                  <TableCell>
                    <Badge variant={isToday(new Date(sub.renewalDate)) ? 'default' : 'secondary'}>
                      {format(new Date(sub.renewalDate), 'MMM d, yyyy')}
                    </Badge>
                  </TableCell>
                  <TableCell className="capitalize">{sub.category || 'Other'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}

export default function InvitePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InvitePageContent />
    </Suspense>
  );
}