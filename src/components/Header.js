'use client';

import { useState, useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { AuthContext } from '@/context/AuthContext';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, plan = 'free' } = useContext(AuthContext);

   // Smart fallback initials
  const getInitials = () => {
    if (user?.displayName) {
      return user.displayName
        .trim()
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  const initials = getInitials();

  const logoHref = user ? '/dashboard' : '/';

  // Dynamic CTA: Hide on Business, show Pro → Business or Free → Pro
  const upgradeInfo = (() => {
    if (plan === 'business') return null;
    if (plan === 'pro') return { text: 'Upgrade to Business', href: '/pricing' };
    return { text: 'Upgrade to Pro', href: '/pricing' };
  })();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">

        {/* Logo */}
        <Link href={logoHref} className="flex items-center gap-2">
          <Image src="/rekur.png" alt="Rekur" width={100} height={100} />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-4">
          {upgradeInfo && (
            <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href={upgradeInfo.href}>{upgradeInfo.text}</Link>
            </Button>
          )}

          {/* Direct Avatar Link to Account */}
          <Link href="/account">
            <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-transparent hover:ring-primary/20 transition-all">
              <AvatarImage src={user?.photoURL} alt={user?.displayName || 'User'} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu (no Logout) */}
      {mobileOpen && (
        <div className="border-t bg-background md:hidden">
          <nav className="flex flex-col p-4 gap-3">
            {upgradeInfo && (
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <Link href={upgradeInfo.href}>{upgradeInfo.text}</Link>
              </Button>
            )}
            <div className="h-px bg-border" />
            <Link
              href="/account"
              className="text-sm font-medium px-2 py-1.5 rounded-md hover:bg-accent"
              onClick={() => setMobileOpen(false)}
            >
              Profile
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}