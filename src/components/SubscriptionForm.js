'use client';

import { useState, useContext } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { AuthContext } from '@/context/AuthContext';

export default function SubscriptionForm({ onSubmit }) {
  const { plan } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [firstBillingDate, setFirstBillingDate] = useState('');
  const [category, setCategory] = useState('');
  const [reminderType, setReminderType] = useState('email');
  const [reminderPeriods, setReminderPeriods] = useState('7'); // String for input, split to array

  const handleSubmit = () => {
    const periods = reminderPeriods.split(',').map(p => parseInt(p.trim(), 10)).filter(p => !isNaN(p));
    onSubmit({
      name,
      amount: parseFloat(amount),
      currency,
      billingCycle,
      firstBillingDate,
      category: plan === 'business' ? category : undefined,
      reminders: { type: reminderType, periods },
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Subscription</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Subscription</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
          <Label>Amount</Label>
          <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <Label>Currency</Label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger>
              <SelectValue placeholder="USD" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
            </SelectContent>
          </Select>
          <Label>Billing Cycle</Label>
          <Select value={billingCycle} onValueChange={setBillingCycle}>
            <SelectTrigger>
              <SelectValue placeholder="Monthly" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="annual">Annual</SelectItem>
            </SelectContent>
          </Select>
          <Label>First Billing Date</Label>
          <Input type="date" value={firstBillingDate} onChange={(e) => setFirstBillingDate(e.target.value)} />
          {plan === 'business' && (
            <>
              <Label>Category</Label>
              <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g., Dev Tools" />
            </>
          )}
          <Label>Reminder Type</Label>
          <Select value={reminderType} onValueChange={setReminderType} disabled={plan === 'free'}>
            <SelectTrigger>
              <SelectValue placeholder="Email" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Email</SelectItem>
              {plan !== 'free' && <SelectItem value="sms">SMS</SelectItem>}
              {plan !== 'free' && <SelectItem value="whatsapp">WhatsApp</SelectItem>}
            </SelectContent>
          </Select>
          <Label>Reminder Periods (comma-separated days before, e.g., 7,3,1)</Label>
          <Input value={reminderPeriods} onChange={(e) => setReminderPeriods(e.target.value)} disabled={plan === 'free'} />
          <Button onClick={handleSubmit}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}