'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [activeIndex, setActiveIndex] = useState(1); // Default to 'Personal Pro' (popular)
  const scrollRef = useRef(null);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-60px' });

  const plans = [
    {
      id: 'personal',
      name: 'Personal',
      description: 'Ideal for getting started with basic subscription tracking.',
      price: '$0',
      period: 'forever',
      popular: false,
      ctaText: 'Get Started Free',
      ctaLink: '/register',
      ctaVariant: 'outline',
      features: [
        'Track up to 5 subscriptions',
        'Email renewal reminders',
        'Clean Calendar view',
        'Mobile responsive dashboard',
        'Basic spend summary',
      ],
    },
    {
      id: 'pro',
      name: 'Personal Pro',
      description: 'For individuals who want multi-channel alerts and unlimited tracking.',
      price: billingCycle === 'monthly' ? '$3' : '$25',
      period: billingCycle === 'monthly' ? 'per month' : 'per year (Save 30%)',
      popular: true,
      ctaText: 'Start 14-Day Free Trial',
      ctaLink: '/pricing',
      ctaVariant: 'default',
      features: [
        'Unlimited subscriptions & trials',
        'WhatsApp Cloud reminders',
        'SMS text message alerts',
        'Custom reminder windows (1, 3, 7 days)',
        'Full CSV data export',
        'Priority customer support',
      ],
    },
    {
      id: 'business',
      name: 'Business',
      description: 'For teams, agencies, and small businesses managing SaaS spend.',
      price: billingCycle === 'monthly' ? '$10' : '$100',
      period: billingCycle === 'monthly' ? 'per month' : 'per year (Save 17%)',
      popular: false,
      ctaText: 'Get Business Plan',
      ctaLink: '/pricing',
      ctaVariant: 'outline',
      features: [
        'All Personal Pro features',
        'Workspace collaboration (Invite 3 teammates)',
        'Custom spending categories',
        'Advanced monthly & yearly burn analytics',
        'Central billing management',
        'Dedicated onboarding support',
      ],
    },
  ];

  // Sync active scroll index on swipe
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    if (clientWidth === 0) return;
    const newIndex = Math.round(scrollLeft / (clientWidth * 0.85));
    setActiveIndex(Math.max(0, Math.min(plans.length - 1, newIndex)));
  };

  const scrollToPlan = (index) => {
    if (!scrollRef.current) return;
    const cards = scrollRef.current.children;
    if (cards && cards[index]) {
      cards[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      setActiveIndex(index);
    }
  };

  // Scroll to popular card on first mobile render
  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.innerWidth < 768 && scrollRef.current) {
        scrollToPlan(1);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section ref={sectionRef} id="pricing" className="py-20 md:py-32 bg-muted/20 border-y border-border/50 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Transparent Pricing</span>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight"
          >
            Simple Plans That Pay For Themselves
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-muted-foreground"
          >
            Catching just one unwanted subscription renewal covers your Rekur subscription for years.
          </motion.p>

          {/* Billing Cycle Switcher */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 inline-flex flex-wrap justify-center items-center gap-1 p-1.5 rounded-full bg-background border border-border/80 shadow-sm"
          >
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                billingCycle === 'yearly'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                Save 30%
              </span>
            </button>
          </motion.div>

          {/* Mobile Swipe Hint with Prev/Next Controls */}
          <div className="flex md:hidden items-center justify-between mt-6 px-2 text-xs text-muted-foreground font-medium">
            <span className="flex items-center gap-1">
              👈 Swipe horizontally to compare plans
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scrollToPlan(Math.max(0, activeIndex - 1))}
                disabled={activeIndex === 0}
                className="w-8 h-8 rounded-full border border-border bg-background flex items-center justify-center disabled:opacity-40 disabled:pointer-events-none active:scale-95 transition-all shadow-sm"
                aria-label="Previous Plan"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollToPlan(Math.min(plans.length - 1, activeIndex + 1))}
                disabled={activeIndex === plans.length - 1}
                className="w-8 h-8 rounded-full border border-border bg-background flex items-center justify-center disabled:opacity-40 disabled:pointer-events-none active:scale-95 transition-all shadow-sm"
                aria-label="Next Plan"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards: Horizontally swipeable on mobile/tablet, 3-column grid on desktop */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar md:grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch pb-6 pt-4 -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0"
          style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.35 + index * 0.1 }}
              whileHover={{ y: -4 }}
              className={`relative rounded-3xl border bg-card p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 snap-center shrink-0 w-[85vw] sm:w-[360px] md:w-auto ${
                plan.popular
                  ? 'border-primary shadow-xl shadow-primary/10 ring-2 ring-primary lg:-translate-y-2'
                  : 'border-border/80 shadow-sm hover:shadow-md'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground font-bold text-xs px-3.5 py-1 shadow">
                    Most Popular
                  </Badge>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                  {plan.popular && (
                    <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full md:hidden">
                      Popular
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1 min-h-[32px]">{plan.description}</p>

                <div className="mt-6 mb-6 pb-6 border-b border-border/60">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-extrabold text-foreground">{plan.price}</span>
                    <span className="text-sm font-medium text-muted-foreground">/{plan.period}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <p className="text-xs font-bold text-foreground uppercase tracking-wider">What&apos;s included:</p>
                  <ul className="space-y-2.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <Button
                  variant={plan.ctaVariant}
                  asChild
                  className={`w-full h-11 text-sm font-semibold ${
                    plan.popular ? 'shadow-md shadow-primary/25' : ''
                  }`}
                >
                  <Link href={plan.ctaLink} className="flex items-center justify-center gap-2">
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Swipe Pagination Indicator Dots */}
        <div className="flex md:hidden items-center justify-center gap-2 mt-4">
          {plans.map((plan, i) => (
            <button
              key={plan.id}
              onClick={() => scrollToPlan(i)}
              aria-label={`Go to ${plan.name} plan`}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIndex === i ? 'w-7 bg-primary' : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

