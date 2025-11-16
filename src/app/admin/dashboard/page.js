'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Search, UserX, Clock, Users, Briefcase, Package } from 'lucide-react';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [subs, setSubs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [disableDialogOpen, setDisableDialogOpen] = useState(false);
  const [newPlan, setNewPlan] = useState('');
  const [loading, setLoading] = useState(true);
  const [cronStatus, setCronStatus] = useState({ lastRun: null, sent: 0 });
  const { toast } = useToast();

  const fmt = (ts) =>
    ts?.toDate?.()?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) ?? '—';

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dataRes, cronRes] = await Promise.all([
          fetch('/api/admin/data', {
            headers: { Authorization: 'Bearer admin-authenticated' },
          }),
          fetch('/api/cron/status'),
        ]);

        if (!dataRes.ok || !cronRes.ok) {
          const errData = dataRes.ok ? await cronRes.json() : await dataRes.json();
          throw new Error(errData.error || 'Failed to load data');
        }

        const { users, subs } = await dataRes.json();
        const cronData = await cronRes.json();

        setUsers(users);
        setSubs(subs);
        setCronStatus(cronData);
      } catch (err) {
        toast({ title: 'Error', description: err.message, variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Search
  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats
  const proCount = users.filter((u) => u.plan === 'pro').length;
  const businessCount = users.filter((u) => u.plan === 'business').length;

  // Run Cron
  const runCron = async () => {
    toast({ title: 'Running Cron…', description: 'Please wait' });
    try {
      const res = await fetch('/api/cron/check-reminders');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Cron failed');

      setCronStatus({ lastRun: new Date(), sent: data.sent });
      toast({ title: 'Success', description: `Sent ${data.sent} reminders` });
    } catch (err) {
      toast({ title: 'Cron Error', description: err.message, variant: 'destructive' });
    }
  };

  // Change Plan
  const changePlan = async () => {
    try {
      const res = await fetch('/api/admin/change-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer admin-authenticated',
        },
        body: JSON.stringify({ userId: selectedUser.id, plan: newPlan }),
      });

      if (!res.ok) throw new Error('Failed to update plan');

      setUsers((prev) =>
        prev.map((u) => (u.id === selectedUser.id ? { ...u, plan: newPlan } : u))
      );
      toast({ title: 'Success', description: 'Plan updated' });
      setPlanDialogOpen(false);
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  // Disable User
  const disableUser = async () => {
    try {
      const res = await fetch('/api/admin/disable-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer admin-authenticated',
        },
        body: JSON.stringify({ userId: selectedUser.id }),
      });

      if (!res.ok) throw new Error('Failed to disable user');

      setUsers((prev) =>
        prev.map((u) => (u.id === selectedUser.id ? { ...u, disabled: true } : u))
      );
      toast({ title: 'Success', description: 'User disabled' });
      setDisableDialogOpen(false);
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  if (loading) return <div className="text-center py-10">Loading…</div>;

  return (
    <div className="space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="font-medium">Pro: {proCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-purple-600" />
            <span className="font-medium">Business: {businessCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-green-600" />
            <span className="font-medium">Subs: {subs.length}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600 flex items-center gap-1">
            <Clock className="w-4 h-4" />
            Last cron: {cronStatus.lastRun ? fmt(cronStatus.lastRun) : '—'}
          </div>
          <Button onClick={runCron} size="sm">Run Cron</Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-gray-500" />
            <Input
              placeholder="Search users by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((u) => (
                <TableRow key={u.id}>
                  <TableCell
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => setSelectedUser(u)}
                  >
                    {u.email}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        u.plan === 'pro'
                          ? 'default'
                          : u.plan === 'business'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {u.plan || 'free'}
                    </Badge>
                  </TableCell>
                  <TableCell>{fmt(u.createdAt)}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedUser(u);
                        setNewPlan(u.plan || 'free');
                        setPlanDialogOpen(true);
                      }}
                    >
                      Change Plan
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setSelectedUser(u);
                        setDisableDialogOpen(true);
                      }}
                      disabled={u.disabled}
                    >
                      {u.disabled ? 'Disabled' : 'Disable'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Subscriptions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Subscriptions ({subs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Renewal</TableHead>
                <TableHead>Remind Days</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subs.map((s) => {
                const user = users.find((u) => u.id === s.userId);
                return (
                  <TableRow key={s.id}>
                    <TableCell>{user?.email || '—'}</TableCell>
                    <TableCell>{s.name}</TableCell>
                    <TableCell>${s.price?.toFixed(2)}</TableCell>
                    <TableCell>{fmt(s.renewalDate)}</TableCell>
                    <TableCell>{s.remindDays?.join(', ') || '—'}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={!!selectedUser && !planDialogOpen && !disableDialogOpen} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-3 text-sm">
              <div><strong>Email:</strong> {selectedUser.email}</div>
              <div><strong>Plan:</strong> {selectedUser.plan || 'free'}</div>
              <div><strong>Stripe ID:</strong> {selectedUser.stripeCustomerId || '—'}</div>
              <div><strong>Created:</strong> {fmt(selectedUser.createdAt)}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Change Plan Dialog */}
      <Dialog open={planDialogOpen} onOpenChange={setPlanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Plan for {selectedUser?.email}</DialogTitle>
          </DialogHeader>
          <Select value={newPlan} onValueChange={setNewPlan}>
            <SelectTrigger>
              <SelectValue placeholder="Select plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="pro">Pro</SelectItem>
              <SelectItem value="business">Business</SelectItem>
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPlanDialogOpen(false)}>Cancel</Button>
            <Button onClick={changePlan}>Update Plan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Disable User Dialog */}
      <Dialog open={disableDialogOpen} onOpenChange={setDisableDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disable User</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to disable <strong>{selectedUser?.email}</strong>?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDisableDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={disableUser}>Disable User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}