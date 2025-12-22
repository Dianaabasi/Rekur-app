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
// 1. Import the Header component
import Header from '@/components/Header';

function InvitePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const ownerId = searchParams.get('owner');
  
  const [status, setStatus] = useState('checking'); // checking, joining, viewing, error
  const [ownerSubscriptions, setOwnerSubscriptions] = useState([]);

  // Handle joining logic
  useEffect(() => {
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

  // Load Owner's Data (View Only)
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

  if (!ownerId || status === 'error') {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* 2. Added Header */}
        <Header /> 
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="p-6 text-center max-w-md w-full">
            <h2 className="text-xl font-bold text-destructive mb-2">Invalid Invitation</h2>
            <p className="text-muted-foreground">The invite link is broken or expired.</p>
            <Button onClick={() => router.push('/')} className="mt-4 w-full">Go Home</Button>
          </Card>
        </div>
      </div>
    );
  }

  if (authLoading || status === 'checking' || status === 'joining') {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading Workspace...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 3. Added Header to main view */}
      <Header />
      
      <main className="flex-1 container mx-auto p-4 sm:p-8 max-w-6xl">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Shared Workspace</h1>
            <p className="text-muted-foreground">You are viewing this dashboard as a team member.</p>
          </div>
          <Button variant="outline" onClick={() => router.push('/dashboard')}>
            Back to My Dashboard
          </Button>
        </div>

        <Card className="p-0 sm:p-6 overflow-hidden">
          <div className="p-4 sm:p-0 border-b sm:border-0 mb-4">
            <h2 className="text-lg font-semibold">Subscriptions ({ownerSubscriptions.length})</h2>
          </div>
          
          {ownerSubscriptions.length === 0 ? (
            <p className="text-muted-foreground text-center py-12 bg-muted/20 rounded-lg m-4">
              This workspace has no subscriptions yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
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
                      <TableCell className="capitalize">
                        <Badge variant="outline" className="font-normal">
                          {sub.category || 'Other'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}

export default function InvitePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <InvitePageContent />
    </Suspense>
  );
}