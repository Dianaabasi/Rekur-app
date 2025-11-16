'use client';

import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { doc, getDoc, updateDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';
import { ChevronLeft, LogOut, CreditCard, Download, Calendar, AlertCircle, CheckCircle, Users, Copy, Check, Settings } from 'lucide-react';
import Header from '@/components/Header';
import { cn } from "@/lib/utils";

export default function Account() {
  const { user, phone, setPhone, plan = 'free', signOut, stripeCustomerId } = useContext(AuthContext);
  const { toast } = useToast();
  const isPro = plan === 'pro';
  const isBusiness = plan === 'business';

  const [newPhone, setNewPhone] = useState(phone || '');
  const [isSavingPhone, setIsSavingPhone] = useState(false);
  const [workspaceName, setWorkspaceName] = useState('');
  const [isSavingWorkspace, setIsSavingWorkspace] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [loadingSub, setLoadingSub] = useState(true);
  const [teamMembers, setTeamMembers] = useState([]);
  const [copied, setCopied] = useState(false);

  // Load user data (phone + workspace name)
  useEffect(() => {
    if (!user?.uid) return;

    const loadUserData = async () => {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setNewPhone(data.phone || '');
        setWorkspaceName(data.workspaceName || '');
      }
    };
    loadUserData();
  }, [user]);

  // Load Stripe subscription
  useEffect(() => {
    if (!isPro && !isBusiness || !stripeCustomerId) {
      setLoadingSub(false);
      return;
    }

    const fetchSubscription = async () => {
      try {
        const res = await fetch(`/api/stripe/subscription?customer=${stripeCustomerId}`);
        if (res.ok) {
          const data = await res.json();
          setSubscription(data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoadingSub(false);
      }
    };

    fetchSubscription();
  }, [isPro, isBusiness, stripeCustomerId]);

  // Load team members (Business only)
  useEffect(() => {
    if (!isBusiness || !user?.uid) return;

    const q = query(collection(db, 'teamInvites'), where('workspaceOwner', '==', user.uid));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const members = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTeamMembers(members);
      },
      (err) => {
        console.error("Team load error:", err);
        toast({
          title: "Error",
          description: "Failed to load team members.",
          variant: "destructive"
        });
      }
    );
    return unsub;
  }, [isBusiness, user, toast]);

  const handleUpdatePhone = async () => {
    if (!user?.uid || newPhone.trim() === phone) return;

    setIsSavingPhone(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), { phone: newPhone.trim() });
      setPhone(newPhone.trim());
      toast({ title: "Phone Updated", description: "Your phone number has been saved." });
    } catch (error) {
      console.error('Error:', error);
      toast({ title: "Update Failed", description: "Could not save phone number.", variant: "destructive" });
    } finally {
      setIsSavingPhone(false);
    }
  };

  const handleUpdateWorkspace = async () => {
    if (!user?.uid || !workspaceName.trim()) return;

    setIsSavingWorkspace(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), { workspaceName: workspaceName.trim() });
      toast({ title: "Workspace Updated", description: "Your workspace name has been saved." });
    } catch (error) {
      console.error('Error:', error);
      toast({ title: "Update Failed", description: "Could not save workspace name.", variant: "destructive" });
    } finally {
      setIsSavingWorkspace(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({ title: "Logged Out", description: "See you soon!" });
    } catch (error) {
      toast({ title: "Logout Failed", variant: "destructive" });
    }
  };

  // const openPortal = async () => {
  //   try {
  //     const res = await fetch('/api/stripe/portal', { method: 'POST' });
  //     const { url } = await res.json();
  //     window.location.href = url;
  //   } catch (error) {
  //     toast({ title: "Failed to open billing", variant: "destructive" });
  //   }
  // };

  const openPortal = async () => {
    if (!stripeCustomerId) {
      toast({ title: "No billing info", description: "Customer not found.", variant: "destructive" });
      return;
    }

    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: stripeCustomerId }),
      });

      if (!res.ok) throw new Error('Failed to create portal');

      const { url } = await res.json();
      window.location.href = url;
    } catch (error) {
      console.error('Portal error:', error);
      toast({ title: "Failed to open billing", description: error.message, variant: "destructive" });
    }
  };

  const downloadInvoice = async (invoiceId) => {
    try {
      const res = await fetch(`/api/stripe/invoice?invoice=${invoiceId}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoiceId}.pdf`;
      a.click();
    } catch (error) {
      toast({ title: "Download failed", variant: "destructive" });
    }
  };

  const copyInviteLink = () => {
    const link = `${window.location.origin}/invite?owner=${user.uid}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-muted-foreground">Loading account...</p>
      </div>
    );
  }

  return (
    <>
      <Header />

      <div className="container mx-auto p-4 sm:p-6 max-w-2xl space-y-6">

        {/* Back + Title */}
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon" className="rounded-full">
            <Link href="/dashboard">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Account Settings</h1>
            <p className="text-sm text-gray-600 mt-1">Manage profile, plan, and workspace</p>
          </div>
        </div>

        {/* Profile Card */}
        <Card className="p-5 sm:p-6 space-y-5">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={user.email || ''} disabled className="bg-muted" />
            <p className="text-xs text-muted-foreground">Your login email</p>
          </div>

          <div className="space-y-2">
            <Label>Phone Number {isPro && <Badge variant="secondary" className="ml-2">Pro</Badge>}</Label>
            <Input
              type="tel"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder="+1234567890"
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              {isPro
                ? "Used for SMS & WhatsApp alerts"
                : "Enable Pro to use SMS alerts"
              }
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleUpdatePhone}
              disabled={isSavingPhone || newPhone.trim() === phone}
              className="w-full"
            >
              {isSavingPhone ? 'Saving...' : 'Update Phone'}
            </Button>

            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full text-destructive border-destructive hover:bg-destructive/5"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </Card>

        {/* Business: Workspace Name */}
        {isBusiness && (
          <Card className="p-5 sm:p-6 bg-emerald-50 border-emerald-200">
            <div className="flex items-center gap-2 mb-3">
              <Settings className="h-5 w-5 text-emerald-700" />
              <h3 className="font-semibold text-emerald-900">Workspace</h3>
            </div>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Workspace Name</Label>
                <Input
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  placeholder="Acme Inc"
                />
                <p className="text-xs text-emerald-700">Visible to team members</p>
              </div>
              <Button
                onClick={handleUpdateWorkspace}
                disabled={isSavingWorkspace || !workspaceName.trim()}
                size="sm"
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                {isSavingWorkspace ? 'Saving...' : 'Update Workspace'}
              </Button>
            </div>
          </Card>
        )}

        {/* Plan & Billing */}
        <Card className={cn(
          "p-5 sm:p-6",
          isBusiness ? "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200" :
          isPro ? "bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200" :
          "bg-blue-50 border-blue-200"
        )}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">
                {isBusiness ? 'Business Plan' : isPro ? 'Pro Plan' : 'Free Plan'}
              </h3>
              {(isPro || isBusiness) ? (
                <Badge variant="default" className={isBusiness ? "bg-emerald-600" : "bg-purple-600"}>
                  <CheckCircle className="h-3 w-3 mr-1" /> Active
                </Badge>
              ) : (
                <Badge variant="secondary">Limited</Badge>
              )}
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            {isBusiness
              ? 'Team invites • Categories • Analytics'
              : isPro
              ? 'Unlimited subscriptions • SMS & WhatsApp • CSV export'
              : '5 subscriptions • Email reminders only'
            }
          </p>

          {!isPro && !isBusiness ? (
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link href="/pricing">Upgrade to Pro</Link>
            </Button>
          ) : (
            <div className="space-y-4">
              {loadingSub ? (
                <p className="text-sm text-muted-foreground">Loading billing...</p>
              ) : subscription ? (
                <>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Next Invoice</span>
                      <span className="font-medium">
                        {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="font-medium">
                        ${(subscription.plan.amount / 100).toFixed(2)} / month
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={openPortal} size="sm" className="flex-1">
                      <CreditCard className="h-4 w-4 mr-1" />
                      Manage Billing
                    </Button>
                    {subscription.latest_invoice && (
                      <Button
                        onClick={() => downloadInvoice(subscription.latest_invoice)}
                        size="sm"
                        variant="outline"
                        className="flex-1"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Last Invoice
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <Button onClick={openPortal} size="sm" className="w-full">
                  <CreditCard className="h-4 w-4 mr-1" />
                  View Billing
                </Button>
              )}
            </div>
          )}
        </Card>

        {/* Business: Team Members */}
        {isBusiness && (
          <Card className="p-5 sm:p-6 bg-gradient-to-br from-teal-50 to-emerald-50 border-teal-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-teal-700" />
                <h3 className="font-semibold text-teal-900">Team Members ({teamMembers.length}/3)</h3>
              </div>
              <Button size="sm" variant="outline" onClick={copyInviteLink}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy Invite'}
              </Button>
            </div>

            {teamMembers.length === 0 ? (
              <p className="text-sm text-teal-700">No team members yet. Invite up to 3 view-only members.</p>
            ) : (
              <div className="space-y-2">
                {teamMembers.map(member => (
                  <div key={member.id} className="flex items-center justify-between p-2 border border-teal-200 rounded-lg bg-white/50">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-xs font-medium text-teal-700">
                        {member.email[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{member.email}</p>
                        <p className="text-xs text-teal-600">View-only</p>
                      </div>
                    </div>
                    <Badge variant={member.status === 'pending' ? 'secondary' : 'default'}>
                      {member.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Pro/Business Stats */}
        {(isPro || isBusiness) && (
          <Card className={cn(
            "p-5 sm:p-6",
            isBusiness ? "bg-emerald-50 border-emerald-200" : "bg-purple-50 border-purple-200"
          )}>
            <h3 className="font-semibold mb-3">
              {isBusiness ? 'Business' : 'Pro'} Usage
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Subscriptions</p>
                <p className="text-2xl font-bold">Unlimited</p>
              </div>
              <div>
                <p className="text-muted-foreground">Team Members</p>
                <p className="text-2xl font-bold">{isBusiness ? `${teamMembers.length}/3` : '—'}</p>
                {!isBusiness && <p className="text-xs">Business only</p>}
              </div>
            </div>
          </Card>
        )}

        <div className="text-center text-xs text-muted-foreground">
          <p>Need help? Contact <a href="mailto:support@rekur.app" className="underline">support@rekur.app</a></p>
        </div>
      </div>
    </>
  );
}