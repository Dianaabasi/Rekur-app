'use client';

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { cn } from "@/lib/utils";
import { useState, useEffect, useContext, useMemo, Suspense } from 'react';
import { format, isToday, parseISO } from 'date-fns';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AuthContext } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Plus, Calendar, Bell, Trash2, Edit, ArrowUpDown, Download, MessageCircle, Smartphone, Users, Mail, Copy, Check, Palette, UserPlus } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useSearchParams } from 'next/navigation';

const PREDEFINED_CATEGORIES = [
  { value: 'dev-tools', label: 'Dev Tools', color: '#3b82f6' },
  { value: 'marketing', label: 'Marketing', color: '#8b5cf6' },
  { value: 'operations', label: 'Operations', color: '#10b981' },
  { value: 'hr', label: 'HR', color: '#f59e0b' },
  { value: 'finance', label: 'Finance', color: '#ef4444' },
  { value: 'other', label: 'Other', color: '#6b7280' },
];

const DEFAULT_COLORS = ['#f87171', '#fb923c', '#fbbf24', '#a3e635', '#34d399', '#22d3ee', '#818cf8', '#c084fc', '#f472b6'];

function DashboardContent() {
  const { user, plan = 'free' } = useContext(AuthContext);
  const { toast } = useToast();
  const isPro = plan === 'pro';
  const isBusiness = plan === 'business';
  const [subscriptions, setSubscriptions] = useState([]);
  const [userCategories, setUserCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const [copied, setCopied] = useState(false);
  const [categoryModal, setCategoryModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState(DEFAULT_COLORS[0]);
  const [editingCat, setEditingCat] = useState(null);
  const [form, setForm] = useState({
    name: '',
    price: '',
    renewalDate: '',
    remindDays: [],
    emailReminder: true,
    smsReminder: false,
    whatsappReminder: false,
    category: 'other'
  });
  const [sortBy, setSortBy] = useState('renewal');
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const searchParams = useSearchParams();
  const success = searchParams.get('success');

  // Load subscriptions
  useEffect(() => {
    if (success) {
      toast({
        title: 'Payment Successful!',
        description: 'Your plan has been upgraded. Enjoy your new features!',
      });
      window.history.replaceState({}, '', '/dashboard');
    }

    if (!user?.uid) return;

    const q = query(collection(db, 'subscriptions'), where('userId', '==', user.uid));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const subs = snap.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            emailReminder: data.emailReminder ?? true,
            smsReminder: data.smsReminder ?? false,
            whatsappReminder: data.whatsappReminder ?? false,
            remindDays: Array.isArray(data.remindDays) ? data.remindDays : [],
            category: data.category || 'other'
          };
        });
        setSubscriptions(subs);
      },
      (err) => {
        console.error("Subscriptions load error:", err);
        toast({
          title: "Error",
          description: "Failed to load subscriptions. Check your connection.",
          variant: "destructive"
        });
      }
    );
    return unsub;
  }, [user, toast, success]);

  // Load custom categories (Business only)
  useEffect(() => {
    if (!isBusiness || !user?.uid) return;

    const q = query(collection(db, 'userCategories'), where('userId', '==', user.uid));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const cats = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUserCategories(cats);
      },
      (err) => {
        console.error("User categories load error:", err);
        toast({
          title: "Error",
          description: "Failed to load custom categories.",
          variant: "destructive"
        });
      }
    );
    return unsub;
  }, [isBusiness, user, toast]);

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
        console.error("Team invites load error:", err);
      }
    );
    return unsub;
  }, [isBusiness, user]);

  const allCategories = useMemo(() => {
    return [...PREDEFINED_CATEGORIES, ...userCategories];
  }, [userCategories]);

  const getCategoryColor = (value) => {
    const cat = allCategories.find(c => c.value === value);
    return cat?.color || '#6b7280';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.uid) return;

    const payload = {
      name: form.name,
      price: parseFloat(form.price),
      renewalDate: form.renewalDate,
      remindDays: form.remindDays.map(Number),
      emailReminder: form.emailReminder,
      smsReminder: form.smsReminder,
      whatsappReminder: form.whatsappReminder,
      category: form.category,
      userId: user.uid,
    };

    try {
      if (editing) {
        await updateDoc(doc(db, 'subscriptions', editing.id), payload);
        toast({ title: "Success", description: "Subscription updated successfully." });
      } else {
        if (!isPro && !isBusiness && subscriptions.length >= 5) {
          toast({ title: "Limit Reached", description: "Free plan allows only 5 subscriptions. Upgrade to Pro.", variant: "destructive" });
          return;
        }
        await addDoc(collection(db, 'subscriptions'), payload);
        toast({ title: "Success", description: "Subscription added successfully." });
      }

      setOpen(false);
      setEditing(null);
      setForm({
        name: '', price: '', renewalDate: '',
        remindDays: [],
        emailReminder: true,
        smsReminder: false,
        whatsappReminder: false,
        category: 'other'
      });
    } catch (error) {
      console.error('Error saving subscription:', error);
      toast({ title: "Error", description: "Failed to save. Please try again.", variant: "destructive" });
    }
  };

  const handleAddCategory = async () => {
    if (!newCatName.trim()) {
      toast({ title: "Error", description: "Category name is required.", variant: "destructive" });
      return;
    }

    const value = newCatName.toLowerCase().replace(/\s+/g, '-');
    if (allCategories.some(c => c.value === value)) {
      toast({ title: "Error", description: "Category already exists.", variant: "destructive" });
      return;
    }

    try {
      if (editingCat) {
        await updateDoc(doc(db, 'userCategories', editingCat.id), {
          label: newCatName,
          value,
          color: newCatColor
        });
        toast({ title: "Updated", description: "Category updated." });
      } else {
        await addDoc(collection(db, 'userCategories'), {
          label: newCatName,
          value,
          color: newCatColor,
          userId: user.uid
        });
        toast({ title: "Added", description: "Custom category created." });
      }
      setNewCatName('');
      setNewCatColor(DEFAULT_COLORS[0]);
      setEditingCat(null);
      setCategoryModal(false);
    } catch (error) {
      console.error("Add category error:", error);
      toast({ title: "Error", description: "Failed to save category.", variant: "destructive" });
    }
  };

  const handleDeleteCategory = async (catId) => {
    const cat = userCategories.find(c => c.id === catId);
    if (subscriptions.some(s => s.category === cat.value)) {
      toast({ title: "Cannot Delete", description: "This category is in use.", variant: "destructive" });
      return;
    }

    try {
      await deleteDoc(doc(db, 'userCategories', catId));
      toast({ title: "Deleted", description: "Category removed." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete category.", variant: "destructive" });
    }
  };

  const handleEditCategory = (cat) => {
    setEditingCat(cat);
    setNewCatName(cat.label);
    setNewCatColor(cat.color);
    setCategoryModal(true);
  };

  // ADDED: Logic to remove a team member
  const handleRemoveMember = async (memberId) => {
    try {
      await deleteDoc(doc(db, 'teamInvites', memberId));
      toast({ title: "Member Removed", description: "Access revoked successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to remove member.", variant: "destructive" });
    }
  };

  const handleAddCustomMember = async () => {
    if (teamMembers.length >= 3) {
      toast({ title: "Limit Reached", description: "Maximum 3 team members allowed.", variant: "destructive" });
      return;
    }
    if (!newMemberEmail.includes('@')) {
      toast({ title: "Invalid Email", description: "Please enter a valid email.", variant: "destructive" });
      return;
    }

    try {
      await addDoc(collection(db, 'teamInvites'), {
        email: newMemberEmail,
        workspaceOwner: user.uid,
        status: 'added',
        type: 'manual',
        addedAt: new Date().toISOString()
      });
      toast({ title: "Member Added", description: `${newMemberEmail} is now in your team.` });
      setNewMemberEmail('');
      setAddMemberOpen(false);
    } catch (error) {
      console.error("Add member error:", error);
      toast({ title: "Error", description: "Failed to add member.", variant: "destructive" });
    }
  };
  
  const handleInvite = async () => {
    if (teamMembers.length >= 3) {
      toast({ title: "Limit Reached", description: "Business plan allows up to 3 team members.", variant: "destructive" });
      return;
    }

    try {
      await addDoc(collection(db, 'teamInvites'), {
        email: inviteEmail,
        workspaceOwner: user.uid,
        status: 'pending',
        invitedAt: new Date().toISOString()
      });
      toast({ title: "Invite Sent", description: `Invitation sent to ${inviteEmail}` });
      setInviteEmail('');
      setInviteOpen(false);
    } catch (error) {
      toast({ title: "Error", description: "Failed to send invite.", variant: "destructive" });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'subscriptions', id));
      toast({ title: "Deleted", description: "Subscription removed." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete.", variant: "destructive" });
    }
  };

  const handleEdit = (sub) => {
    setEditing(sub);
    setForm({
      name: sub.name || '',
      price: sub.price || '',
      renewalDate: sub.renewalDate || '',
      remindDays: Array.isArray(sub.remindDays) ? sub.remindDays : [],
      emailReminder: !!sub.emailReminder,
      smsReminder: !!sub.smsReminder,
      whatsappReminder: !!sub.whatsappReminder,
      category: sub.category || 'other'
    });
    setOpen(true);
  };

  const sortedSubscriptions = useMemo(() => {
    const sorted = [...subscriptions];
    if (sortBy === 'name') {
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'renewal') {
      return sorted.sort((a, b) => new Date(a.renewalDate) - new Date(b.renewalDate));
    }
    return sorted;
  }, [subscriptions, sortBy]);

  const displaySubs = isPro || isBusiness ? sortedSubscriptions : sortedSubscriptions.slice(0, 5);

  const totalMonthlyRaw = useMemo(() => {
    return subscriptions.reduce((sum, sub) => sum + sub.price, 0);
  }, [subscriptions]);

  const totalMonthly = useMemo(() => {
    return totalMonthlyRaw.toFixed(2);
  }, [totalMonthlyRaw]);

  const totalAnnual = useMemo(() => {
    return (totalMonthlyRaw * 12).toFixed(2);
  }, [totalMonthlyRaw]);

  const categoryData = useMemo(() => {
    const grouped = subscriptions.reduce((acc, sub) => {
      const cat = sub.category || 'other';
      acc[cat] = (acc[cat] || 0) + sub.price;
      return acc;
    }, {});

    return allCategories.map(cat => ({
      name: cat.label,
      value: grouped[cat.value] || 0,
      fill: cat.color
    })).filter(d => d.value > 0);
  }, [subscriptions, allCategories]);

  const exportToCSV = () => {
    const headers = ['Name', 'Price', 'Next Renewal', 'Reminders', 'Category'];
    const rows = subscriptions.map(sub => [
      sub.name,
      `$${sub.price}`,
      format(parseISO(sub.renewalDate), 'MMM d, yyyy'),
      `${sub.remindDays.length > 0 ? sub.remindDays.join(', ') + ' days' : 'None'}`,
      allCategories.find(c => c.value === sub.category)?.label || 'Other'
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rekur-subscriptions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  const copyInviteLink = () => {
    const link = `${window.location.origin}/invite?owner=${user.uid}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">
          {isBusiness ? 'Business Workspace' : isPro ? 'Personal Pro Dashboard' : 'Personal Plan Dashboard'}
        </h1>
        <p className="text-sm text-gray-600">
          {isBusiness
            ? 'Team collaboration • Analytics • Categories'
            : isPro
            ? 'Unlimited subscriptions • SMS & WhatsApp alerts • Full control'
            : 'Track up to 5 subscriptions with email reminders'
          }
        </p>
      </div>

      {/* Total Monthly Cost */}
      {(isPro || isBusiness) && (
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-5 sm:p-6 rounded-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <p className="text-sm opacity-90">Total Monthly Cost</p>
              <p className="text-2xl sm:text-3xl font-bold">${totalMonthly}</p>
              {totalMonthlyRaw > 0 && (
                <p className="text-sm opacity-90 mt-1">Annual: ${totalAnnual}</p>
              )}
            </div>
            <p className="text-sm opacity-90">{subscriptions.length} active</p>
          </div>
        </Card>
      )}

      {/* Business: Analytics */}
      {isBusiness && categoryData.length > 0 && (
        <Card className="p-5 sm:p-6">
          <h2 className="text-lg font-semibold mb-4">Spend by Category</h2>
          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h1 className="text-xl font-bold">
          Your Subscriptions ({displaySubs.length}{!(isPro || isBusiness) ? '/5' : ''})
        </h1>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {(isPro || isBusiness) && (
            <Button size="sm" variant="outline" onClick={exportToCSV} className="flex-1 sm:flex-initial">
              <Download className="h-4 w-4 mr-1" /> Export
            </Button>
          )}
          {isBusiness && (
            <>
              <Button size="sm" variant="outline" onClick={() => setInviteOpen(true)} className="flex-1 sm:flex-initial">
                <Users className="h-4 w-4 mr-1" /> Invite
              </Button>
              <Button size="sm" variant="outline" onClick={() => setCategoryModal(true)} className="flex-1 sm:flex-initial">
                <Palette className="h-4 w-4 mr-1" /> Categories
              </Button>
            </>
          )}
          <Dialog open={open} onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) {
              setEditing(null);
              setForm({
                name: '', price: '', renewalDate: '',
                remindDays: [],
                emailReminder: true,
                smsReminder: false,
                whatsappReminder: false,
                category: 'other'
              });
            }
          }}>
            <DialogTrigger asChild>
              <Button size="sm" className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-md mx-auto rounded-xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editing ? 'Edit' : 'Add'} Subscription</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Netflix" required />
                </div>
                <div className="space-y-2">
                  <Label>Price</Label>
                  <Input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="15.99" required />
                </div>
                <div className="space-y-2">
                  <Label>Next Renewal</Label>
                  <Input type="date" value={form.renewalDate} onChange={e => setForm({ ...form, renewalDate: e.target.value })} required />
                </div>

                {isBusiness && (
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {allCategories.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                              {cat.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Email Reminder</Label>
                    <Switch checked={form.emailReminder} onCheckedChange={v => setForm({ ...form, emailReminder: v })} />
                  </div>
                  {(isPro || isBusiness) && (
                    <>
                      <div className="flex items-center justify-between">
                        <Label>SMS Reminder <Smartphone className="inline h-3 w-3 ml-1" /></Label>
                        <Switch checked={form.smsReminder} onCheckedChange={v => setForm({ ...form, smsReminder: v })} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>WhatsApp Reminder <MessageCircle className="inline h-3 w-3 ml-1" /></Label>
                        <Switch checked={form.whatsappReminder} onCheckedChange={v => setForm({ ...form, whatsappReminder: v })} />
                      </div>
                    </>
                  )}
                </div>

                {(isPro || isBusiness) && (
                  <div className="space-y-2">
                    <Label>Remind Days Before</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {[15, 7, 3, 1].map(day => (
                        <label key={day} className="flex flex-col items-center space-y-1 cursor-pointer text-xs">
                          <Checkbox
                            checked={form.remindDays.includes(day)}
                            onCheckedChange={(checked) => {
                              setForm(prev => ({
                                ...prev,
                                remindDays: checked ? [...prev.remindDays, day] : prev.remindDays.filter(d => d !== day),
                              }));
                            }}
                          />
                          <span>{day}d</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {!(isPro || isBusiness) && (
                  <div className="space-y-2">
                    <Label>Remind me</Label>
                    <Select value={form.remindDays[0]?.toString() || ''} onValueChange={v => setForm({ ...form, remindDays: v ? [Number(v)] : [] })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select days" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 day</SelectItem>
                        <SelectItem value="3">3 days</SelectItem>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="14">14 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Button type="submit" className="w-full">
                  {editing ? 'Update' : 'Add'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Grid View */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <Calendar className="h-5 w-5 mr-2" /> All Subscriptions
          </h2>
          <div className="flex gap-1 w-full sm:w-auto overflow-x-auto">
            <Button size="sm" variant={sortBy === 'all' ? 'default' : 'ghost'} onClick={() => setSortBy('all')}>
              All
            </Button>
            <Button size="sm" variant={sortBy === 'name' ? 'default' : 'ghost'} onClick={() => setSortBy('name')}>
              <ArrowUpDown className="h-4 w-4 mr-1" /> Name
            </Button>
            <Button size="sm" variant={sortBy === 'renewal' ? 'default' : 'ghost'} onClick={() => setSortBy('renewal')}>
              <ArrowUpDown className="h-4 w-4 mr-1" /> Renewal
            </Button>
          </div>
        </div>

        {displaySubs.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No subscriptions yet. Add one!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displaySubs.map(sub => {
              const renewalDate = new Date(sub.renewalDate);
              const daysUntil = Math.ceil((renewalDate - new Date()) / 86400000);
              const isSoon = daysUntil <= 3 && daysUntil >= 0;
              const isPast = daysUntil < 0;

              return (
                <div
                  key={sub.id}
                  className={cn(
                    "rounded-lg border p-4 text-center transition-all",
                    isSoon ? "border-destructive/50 bg-destructive/5" :
                    isPast ? "border-muted bg-muted/20" : "bg-card"
                  )}
                >
                  <p className="font-semibold text-base">{sub.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isPast ?
                      <span className="text-destructive">Overdue by {Math.abs(daysUntil)}d</span> :
                      <span>Renews in <strong className={isSoon ? "text-destructive" : ""}>{daysUntil}d</strong></span>
                    }
                  </p>
                  <p className="text-xl font-bold text-primary mt-2">${sub.price}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(renewalDate, 'MMM d, yyyy')}
                  </p>
                  {isBusiness && sub.category && (
                    <Badge variant="secondary" className="mt-2 text-xs" style={{ backgroundColor: getCategoryColor(sub.category) + '20', color: getCategoryColor(sub.category) }}>
                      {allCategories.find(c => c.value === sub.category)?.label || 'Other'}
                    </Badge>
                  )}
                  <div className="flex flex-wrap gap-1 justify-center mt-2">
                    {sub.emailReminder && <Badge variant="secondary" className="text-xs">Email</Badge>}
                    {(isPro || isBusiness) && sub.smsReminder && <Badge variant="outline" className="text-xs">SMS</Badge>}
                    {(isPro || isBusiness) && sub.whatsappReminder && <Badge variant="outline" className="text-xs">WhatsApp</Badge>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Table View */}
      <Card className="p-4 sm:p-6 overflow-x-auto">
        <h2 className="text-lg font-semibold mb-4 sticky left-0 bg-background">All Subscriptions</h2>
        {displaySubs.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No subscriptions yet. Add one!</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Next Renewal</TableHead>
                <TableHead>Reminder</TableHead>
                {isBusiness && <TableHead>Category</TableHead>}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displaySubs.map(sub => (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium">{sub.name}</TableCell>
                  <TableCell>${sub.price}</TableCell>
                  <TableCell>
                    <Badge variant={isToday(new Date(sub.renewalDate)) ? 'default' : 'secondary'}>
                      {format(new Date(sub.renewalDate), 'MMM d, yyyy')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap items-center gap-1 text-xs">
                      {sub.remindDays.length > 0 ? (
                        <span>{sub.remindDays.join(', ')}d</span>
                      ) : (
                        <span className="text-muted-foreground">None</span>
                      )}
                      {sub.emailReminder && <Badge variant="outline" className="text-xs">Email</Badge>}
                      {(isPro || isBusiness) && sub.smsReminder && <Badge variant="outline" className="text-xs">SMS</Badge>}
                      {(isPro || isBusiness) && sub.whatsappReminder && <Badge variant="outline" className="text-xs">WhatsApp</Badge>}
                    </div>
                  </TableCell>
                  {isBusiness && (
                    <TableCell>
                      <Badge variant="secondary" style={{ backgroundColor: getCategoryColor(sub.category) + '20', color: getCategoryColor(sub.category) }}>
                        {allCategories.find(c => c.value === sub.category)?.label || 'Other'}
                      </Badge>
                    </TableCell>
                  )}
                  <TableCell className="text-right space-x-1">
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(sub)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="w-[95vw] max-w-sm mx-auto rounded-xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Remove <strong>{sub.name}</strong>?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                          <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(sub.id)}
                            className="w-full sm:w-auto bg-destructive text-destructive-foreground"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* UPDATED Business: Team Members with Removal Feature */}
      {isBusiness && (
        <Card className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h2 className="text-lg font-semibold">Team Members ({teamMembers.length}/3)</h2>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setAddMemberOpen(true)}
                className="w-full sm:w-auto"
              >
                <UserPlus className="h-4 w-4 mr-1" /> Add
              </Button>
              <Button
                size="sm"
                onClick={copyInviteLink}
                className="w-full sm:w-auto"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? 'Copied!' : 'Copy Invite'}
              </Button>
            </div>
          </div>

          {teamMembers.length === 0 ? (
            <p className="text-muted-foreground text-center sm:text-left">No team members yet. Add or invite up to 3.</p>
          ) : (
            <div className="space-y-3">
              {teamMembers.map(member => (
                <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{member.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {member.status === 'added' ? 'Added manually' : 'View-only'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={member.status === 'pending' ? 'secondary' : 'default'}>
                      {member.status === 'added' ? 'active' : member.status}
                    </Badge>
                    {/* Confirmation Dialog for Removal */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="w-[95vw] max-w-sm mx-auto rounded-xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Member?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove <strong>{member.email}</strong>? They will lose access to your dashboard immediately.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                          <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRemoveMember(member.id)}
                            className="w-full sm:w-auto bg-destructive text-destructive-foreground"
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Add Member Modal */}
      <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
        <DialogContent className="w-[95vw] max-w-sm mx-auto rounded-xl p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={newMemberEmail}
                onChange={e => setNewMemberEmail(e.target.value)}
                placeholder="colleague@company.com"
                required
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setNewMemberEmail('');
                  setAddMemberOpen(false);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddCustomMember}
                disabled={!newMemberEmail.includes('@') || teamMembers.length >= 3}
                className="flex-1"
              >
                Add to Team
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>


      {/* Category Modal */}
      <Dialog open={categoryModal} onOpenChange={setCategoryModal}>
        <DialogContent className="w-[95vw] max-w-md mx-auto rounded-xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Categories</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-3">
              <Label>{editingCat ? 'Edit' : 'Add'} Category</Label>
              <Input value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="Cloud Services" />
              <div className="flex gap-2 flex-wrap">
                {DEFAULT_COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => setNewCatColor(color)}
                    className={cn("w-8 h-8 rounded-full border-2", newCatColor === color && "ring-2 ring-offset-2 ring-primary")}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <Button onClick={handleAddCategory} className="w-full">
                {editingCat ? 'Update' : 'Add'}
              </Button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              <Label>Custom Categories</Label>
              {userCategories.length === 0 ? (
                <p className="text-sm text-muted-foreground">No custom categories yet.</p>
              ) : (
                userCategories.map(cat => (
                  <div key={cat.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-sm">{cat.label}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => handleEditCategory(cat)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="w-[95vw] max-w-sm mx-auto rounded-xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Remove <strong>{cat.label}</strong>?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                            <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteCategory(cat.id)} className="w-full sm:w-auto">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Invite Modal */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="w-[95vw] max-w-sm mx-auto rounded-xl p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="colleague@company.com" />
            </div>
            <Button onClick={handleInvite} className="w-full">
              Send Invite
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* CTA */}
      <Card className={cn(
        "p-5 sm:p-6 mt-8 text-white rounded-xl text-center sm:text-left",
        !(isPro || isBusiness) ? "bg-gradient-to-r from-blue-500 to-blue-600" :
        isPro ? "bg-gradient-to-r from-purple-500 to-purple-600" :
        "bg-gradient-to-r from-emerald-500 to-emerald-600"
      )}>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {!(isPro || isBusiness) ? (
            <>
              <div>
                <h3 className="text-xl font-bold">Unlock Pro Features</h3>
                <p className="text-sm opacity-90 mt-1">
                  Unlimited subs, SMS/WhatsApp, CSV exports.
                </p>
              </div>
              <Button asChild className="bg-white text-blue-600 hover:bg-gray-100 w-full sm:w-auto">
                <Link href="/pricing">View Pro</Link>
              </Button>
            </>
          ) : !isBusiness ? (
            <>
              <div>
                <h3 className="text-xl font-bold">Ready for Teams?</h3>
                <p className="text-sm opacity-90 mt-1">
                  Invite team, shared dashboards, custom categories.
                </p>
              </div>
              <Button asChild className="bg-white text-purple-600 hover:bg-gray-100 w-full sm:w-auto">
                <Link href="/pricing">View Business</Link>
              </Button>
            </>
          ) : (
            <div className="w-full">
              <h3 className="text-xl font-bold">You`re on Business Plan</h3>
              <p className="text-sm opacity-90 mt-1">
                Full team collaboration and analytics.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

// 3. The main export now wraps everything in Suspense
export default function Dashboard() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><p>Loading Dashboard...</p></div>}>
      <DashboardContent />
    </Suspense>
  );
}