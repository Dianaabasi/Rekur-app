import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Heart } from 'lucide-react';

export default function LandingFooter() {
  return (
    <>
      {/* Final Call to Action Banner */}
      <section className="relative py-20 md:py-28 bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Ready To Take Full Control Of Your Subscriptions?
          </h2>
          <p className="text-base sm:text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
            Join thousands of smart subscribers saving hundreds of dollars each year. Set up in less than 60 seconds.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="w-full sm:w-auto h-12 px-8 text-base font-bold shadow-xl hover:scale-105 transition-all text-primary bg-white hover:bg-white/95"
            >
              <Link href="/register" className="flex items-center gap-2">
                <span>Start Your Free Plan Today</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="w-full sm:w-auto h-12 px-6 text-base font-medium border-white/30 text-primary hover:bg-white/10"
            >
              <Link href="/pricing">View Pricing Plans</Link>
            </Button>
          </div>
          <p className="text-xs opacity-75 pt-2">
            No credit card required • Cancel or upgrade anytime
          </p>
        </div>
      </section>

      {/* Main Footer */}
      <footer className="bg-card border-t border-border/80 pt-16 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-border/60">
            {/* Column 1: Brand */}
            <div className="col-span-2 sm:col-span-2 md:col-span-4 lg:col-span-2 space-y-4">
              <Link href="/" className="flex items-center space-x-2">
                <Image src="/rekur.png" alt="Rekur" width={100} height={100} />
              </Link>



              <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                Rekur is the modern subscription tracking platform designed to eliminate unwanted auto-renewals, surprise bills, and zombie SaaS charges.
              </p>
              
            </div>

            {/* Column 2: Product */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-foreground">Product</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-primary transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#notifications" className="hover:text-primary transition-colors">
                    Multi-Channel Alerts
                  </Link>
                </li>
                <li>
                  <Link href="#calculator" className="hover:text-primary transition-colors">
                    Savings Calculator
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-primary transition-colors">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Company & Resources */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-foreground">Company</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-primary transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-primary transition-colors">
                    Contact Support
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-primary transition-colors">
                    Customer Sign In
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Legal & Security */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-foreground">Legal & Security</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/privacy" className="hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-primary transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li className="flex items-center gap-1.5 text-xs text-primary font-medium pt-1">
                  <Shield className="w-3.5 h-3.5" />
                  <span>256-Bit Encrypted</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} Rekur. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Built for smarter personal finance and subscription control.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
