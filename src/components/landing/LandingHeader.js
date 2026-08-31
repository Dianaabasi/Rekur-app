'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';

export default function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm py-2'
          : 'bg-transparent py-3 sm:py-3.5'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/rekur.png" alt="Rekur" width={150} height={150} priority />
        </Link>



        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-border/50 bg-background/60 backdrop-blur-md px-4 py-1.5 shadow-sm">
          <Link
            href="#features"
            className="px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/50 rounded-full"
          >
            Features
          </Link>
          <Link
            href="#notifications"
            className="px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/50 rounded-full"
          >
            Alerts
          </Link>
          <Link
            href="#calculator"
            className="px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/50 rounded-full"
          >
            Calculator
          </Link>
          <Link
            href="#pricing"
            className="px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/50 rounded-full"
          >
            Pricing
          </Link>
          <Link
            href="#faq"
            className="px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/50 rounded-full"
          >
            FAQ
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild className="font-medium text-sm">
            <Link href="/login">Sign In</Link>
          </Button>
          <Button size="sm" asChild className="shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all">
            <Link href="/register" className="flex items-center gap-1.5">
              <span>Start Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background/95 backdrop-blur-xl px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-1">
            <Link
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-base font-medium rounded-lg text-foreground hover:bg-muted"
            >
              Features
            </Link>
            <Link
              href="#notifications"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-base font-medium rounded-lg text-foreground hover:bg-muted"
            >
              Multi-Channel Alerts
            </Link>
            <Link
              href="#calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-base font-medium rounded-lg text-foreground hover:bg-muted"
            >
              Calculator
            </Link>
            <Link
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-base font-medium rounded-lg text-foreground hover:bg-muted"
            >
              Pricing
            </Link>
            <Link
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-base font-medium rounded-lg text-foreground hover:bg-muted"
            >
              FAQ
            </Link>
          </nav>

          <div className="pt-4 border-t border-border flex flex-col gap-2">
            <Button variant="outline" asChild className="w-full justify-center">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                Sign In
              </Link>
            </Button>
            <Button asChild className="w-full justify-center shadow-md">
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                Start Free Trial
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
