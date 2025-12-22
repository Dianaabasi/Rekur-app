'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from "@/components/ui/use-toast";

function InviteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const ownerId = searchParams.get('owner');
  const [processing, setProcessing] = useState(false);

  const handleJoin = async () => {
    if (!user) {
      router.push(`/register?redirect=/invite?owner=${ownerId}`);
      return;
    }

    setProcessing(true);
    try {
      // Check if already a member
      const q = query(
        collection(db, 'teamInvites'), 
        where('workspaceOwner', '==', ownerId),
        where('email', '==', user.email)
      );
      const existing = await getDocs(q);

      if (existing.empty) {
        await addDoc(collection(db, 'teamInvites'), {
          email: user.email,
          workspaceOwner: ownerId,
          status: 'accepted',
          joinedAt: new Date().toISOString()
        });
      }

      toast({ title: "Joined Team", description: "You now have access to this workspace." });
      router.push('/dashboard');
    } catch (error) {
      toast({ title: "Error", description: "Failed to join team.", variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-6 text-center space-y-4">
        <h1 className="text-2xl font-bold">Team Invitation</h1>
        <p className="text-muted-foreground">
          You`ve been invited to view a subscription workspace.
        </p>
        <Button onClick={handleJoin} disabled={processing} className="w-full">
          {processing ? 'Joining...' : user ? 'Accept Invitation' : 'Sign up to Join'}
        </Button>
      </Card>
    </div>
  );
}

export default function InvitePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InviteContent />
    </Suspense>
  );
}