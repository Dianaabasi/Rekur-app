'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Calendar,
  Bell,
  BarChart3,
  Users,
  Lock,
  FileDown,
  ArrowRight,
  Check,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* ========= HEADER ========= */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/rekur.png" alt="Rekur Logo" width={100} height={50} />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center space-x-8 md:flex">
            <Link href="#features" className="text-sm font-medium hover:text-primary">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-primary">
              Pricing
            </Link>
            <Link href="/login" className="text-sm font-medium hover:text-primary">
              Login
            </Link>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="border-t bg-background md:hidden">
            <nav className="flex flex-col space-y-4 p-4">
              <Link href="#features" className="text-sm font-medium">
                Features
              </Link>
              <Link href="#pricing" className="text-sm font-medium">
                Pricing
              </Link>
              <Link href="/login" className="text-sm font-medium">
                Login
              </Link>
              <Button asChild className="w-full">
                <Link href="/register">Get Started</Link>
              </Button>
            </nav>
          </div>
        )}
      </header>

      {/* ========= HERO ========= */}
      <section className="bg-gradient-to-b from-primary/10 via-primary/5 to-background py-20 md:py-32">
        <div className="container mx-auto px-4 text-center md:px-6">
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-6xl">
            Never Forget a Subscription Again
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Smarter Tracking, Simplified Finances with Rekur
          </p>
          <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
            Stop getting surprise charges. Track all your subscriptions in one place and get smart
            reminders via email, SMS, or WhatsApp.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link href="/register">
                Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#demo">Watch Demo</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            No credit card required • Free forever plan available
          </p>

          {/* Example subscriptions */}
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: 'Netflix', price: '$15.99', days: 5 },
              { name: 'Adobe Creative Cloud', price: '$54.99', days: 12 },
              { name: 'GitHub Pro', price: '$4/mo', days: 8 },
            ].map((sub) => (
              <Card key={sub.name} className="bg-card/80 backdrop-blur">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{sub.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Renews in {sub.days} days
                      </p>
                    </div>
                    <p className="font-semibold text-primary">{sub.price}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Card className="bg-primary/5">
              <CardContent className="flex h-full items-center justify-center p-4">
                <p className="text-sm font-medium text-primary">
                  Total Monthly: <span className="text-lg">$74.98</span>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ========= PROBLEM SECTION ========= */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              The Problem with Subscriptions
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-muted-foreground">
              Subscription chaos is costing you money
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                stat: '$1,000+',
                title: 'Wasted Annually',
                desc: 'Average person pays for unused subscriptions they forgot about',
                color: 'text-destructive',
              },
              {
                stat: '47%',
                title: 'Forgotten Subscriptions',
                desc: 'Nearly half of all subscriptions are forgotten within a year',
                color: 'text-destructive',
              },
              {
                stat: 'Scattered',
                title: 'No Central View',
                desc: 'Subscriptions spread across emails, credit cards, and apps',
                color: 'text-destructive',
              },
            ].map((item) => (
              <Card key={item.title} className="text-center">
                <CardHeader>
                  <p className={`text-4xl font-bold ${item.color}`}>{item.stat}</p>
                  <CardTitle className="mt-2">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ========= FEATURES ========= */}
      <section id="features" className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Powerful Features</h2>
            <p className="mx-auto mb-12 max-w-2xl text-muted-foreground">
              Everything you need to manage subscriptions effortlessly
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Calendar,
                title: 'Smart Calendar',
                desc: 'Visualize all your upcoming renewal dates at a glance',
              },
              {
                icon: Bell,
                title: 'Multi-Channel Reminders',
                desc: 'Get notified via email, SMS, or WhatsApp before charges',
              },
              {
                icon: BarChart3,
                title: 'Spend Analytics',
                desc: 'Track your total monthly burn rate and spending trends',
              },
              {
                icon: Users,
                title: 'Team Collaboration',
                desc: 'Invite team members to manage business subscriptions',
              },
              {
                icon: Lock,
                title: 'Secure & Private',
                desc: 'Your data is encrypted and never shared with third parties',
              },
              {
                icon: FileDown,
                title: 'CSV Export',
                desc: 'Export your subscription data anytime for backup',
              },
            ].map((f) => (
              <Card key={f.title}>
                <CardHeader>
                  <f.icon className="mb-3 h-10 w-10 text-primary" />
                  <CardTitle>{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ========= PRICING ========= */}
      <section id="pricing" className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-muted-foreground">
              Choose the plan that fits your needs
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Personal */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Personal</CardTitle>
                <p className="text-sm text-muted-foreground">Perfect for individuals</p>
                <p className="mt-4 text-4xl font-bold">Free</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="flex items-center text-sm">
                  <Check className="mr-2 h-4 w-4 text-primary" /> Track up to 5 subscriptions
                </p>
                <p className="flex items-center text-sm">
                  <Check className="mr-2 h-4 w-4 text-primary" /> Calendar view
                </p>
                <p className="flex items-center text-sm">
                  <Check className="mr-2 h-4 w-4 text-primary" /> Email reminders
                </p>
              </CardContent>
              <div className="p-6 pt-0">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            </Card>

            {/* Personal Pro – Most Popular */}
            <Card className="ring-2 ring-primary relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                Most Popular
              </div>
              <CardHeader className="pt-8">
                <CardTitle className="text-2xl">Personal Pro</CardTitle>
                <p className="text-sm text-muted-foreground">For power users</p>
                <p className="mt-4 text-4xl font-bold">
                  $3<span className="text-sm font-normal text-muted-foreground">/month</span>
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="flex items-center text-sm">
                  <Check className="mr-2 h-4 w-4 text-primary" /> Unlimited subscriptions
                </p>
                <p className="flex items-center text-sm">
                  <Check className="mr-2 h-4 w-4 text-primary" /> SMS & WhatsApp alerts
                </p>
                <p className="flex items-center text-sm">
                  <Check className="mr-2 h-4 w-4 text-primary" /> Custom reminder periods
                </p>
                <p className="flex items-center text-sm">
                  <Check className="mr-2 h-4 w-4 text-primary" /> CSV export
                </p>
              </CardContent>
              <div className="p-6 pt-0">
                <Button className="w-full" asChild>
                  <Link href="/pricing">Subscribe</Link>
                </Button>
              </div>
            </Card>

            {/* Business */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Business</CardTitle>
                <p className="text-sm text-muted-foreground">For teams & businesses</p>
                <p className="mt-4 text-4xl font-bold">
                  $10<span className="text-sm font-normal text-muted-foreground">/month</span>
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="flex items-center text-sm">
                  <Check className="mr-2 h-4 w-4 text-primary" /> All Pro features
                </p>
                <p className="flex items-center text-sm">
                  <Check className="mr-2 h-4 w-4 text-primary" /> Category tracking
                </p>
                <p className="flex items-center text-sm">
                  <Check className="mr-2 h-4 w-4 text-primary" /> Spend analytics
                </p>
                <p className="flex items-center text-sm">
                  <Check className="mr-2 h-4 w-4 text-primary" /> Invite 3 team members
                </p>
              </CardContent>
              <div className="p-6 pt-0">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/pricing">Subscribe</Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ========= FINAL CTA ========= */}
      <section className="bg-primary py-16 text-primary-foreground md:py-20">
        <div className="container mx-auto px-4 text-center md:px-6">
          <h2 className="mb-4 text-3xl font-bold md:text-5xl">Ready to Take Control?</h2>
          <p className="mx-auto mb-8 max-w-xl text-lg opacity-90">
            Join thousands of users saving money on subscriptions
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/register">Start Your Free Trial Today</Link>
          </Button>
        </div>
      </section>

      {/* ========= FOOTER ========= */}
      <footer className="bg-muted/30 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center space-x-2">
                <Image src="/rekur.png" alt="Rekur Logo" width={100} height={50} />
              </div>
              <p className="text-sm text-muted-foreground">
                Take control of your subscriptions
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-primary">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-primary">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="hover:text-primary">
                    Security
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-primary">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-primary">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-primary">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/privacy" className="hover:text-primary">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-primary">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground">
            © 2025 Rekur. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}