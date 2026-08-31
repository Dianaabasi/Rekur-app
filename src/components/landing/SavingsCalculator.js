'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, Check, PiggyBank, Calculator } from 'lucide-react';

export default function SavingsCalculator() {
  const [subCount, setSubCount] = useState(8);
  const [avgPrice, setAvgPrice] = useState(18);

  // Industry average: ~20% of subscriptions are unused or forgotten
  const monthlyTotal = subCount * avgPrice;
  const annualTotal = monthlyTotal * 12;
  const estimatedAnnualWaste = Math.round(annualTotal * 0.22); // 22% average unused
  const estimatedSavings = estimatedAnnualWaste;

  return (
    <section id="calculator" className="py-20 md:py-28 bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive ROI Calculator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            How Much Money Are You Losing Every Year?
          </h2>
          <p className="mt-3 text-base sm:text-lg text-muted-foreground">
            Adjust the sliders below to calculate your estimated annual savings with Rekur.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-card border border-border/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-primary/5">
          {/* Sliders Side */}
          <div className="lg:col-span-7 space-y-8">
            {/* Slider 1: Number of subscriptions */}
            <div className="space-y-3">
              <div className="flex flex-col xs:flex-row sm:flex-row justify-between items-start sm:items-center gap-1.5">
                <label className="text-sm font-semibold text-foreground">
                  Number of active subscriptions &amp; trials
                </label>
                <span className="px-3 py-1 bg-primary/10 text-primary font-bold rounded-lg text-sm whitespace-nowrap">
                  {subCount} services
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="30"
                value={subCount}
                onChange={(e) => setSubCount(Number(e.target.value))}
                className="w-full h-2.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                aria-label="Subscription count slider"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>2 (Minimal)</span>
                <span>10 (Average)</span>
                <span>30+ (Power User)</span>
              </div>
            </div>

            {/* Slider 2: Average monthly price */}
            <div className="space-y-3">
              <div className="flex flex-col xs:flex-row sm:flex-row justify-between items-start sm:items-center gap-1.5">
                <label className="text-sm font-semibold text-foreground">
                  Average cost per subscription
                </label>
                <span className="px-3 py-1 bg-primary/10 text-primary font-bold rounded-lg text-sm whitespace-nowrap">
                  ${avgPrice} / month
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="1"
                value={avgPrice}
                onChange={(e) => setAvgPrice(Number(e.target.value))}
                className="w-full h-2.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                aria-label="Average price per subscription slider"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>$5 (Streaming)</span>
                <span>$20 (SaaS / Tools)</span>
                <span>$60+ (Pro Suites)</span>
              </div>
            </div>

            {/* Summary Metrics */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/60">
              <div className="p-3 rounded-xl bg-muted/40">
                <p className="text-xs text-muted-foreground">Your Monthly Spend</p>
                <p className="text-xl font-bold text-foreground mt-0.5">${monthlyTotal.toLocaleString()}/mo</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/40">
                <p className="text-xs text-muted-foreground">Annual Recurring Total</p>
                <p className="text-xl font-bold text-foreground mt-0.5">${annualTotal.toLocaleString()}/yr</p>
              </div>
            </div>
          </div>

          {/* Results Side */}
          <div className="lg:col-span-5 rounded-2xl bg-gradient-to-br from-primary/15 via-primary/5 to-purple-600/10 border border-primary/20 p-6 sm:p-8 flex flex-col justify-between text-center space-y-6">
            <div>
              <div className="inline-flex p-3 rounded-2xl bg-primary text-primary-foreground mx-auto shadow-md shadow-primary/30 mb-3">
                <PiggyBank className="w-7 h-7" />
              </div>
              <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                Potential Money Saved
              </p>
              <p className="text-4xl sm:text-5xl font-extrabold text-foreground mt-1 tracking-tight">
                ${estimatedSavings.toLocaleString()}
                <span className="text-base font-normal text-muted-foreground"> / year</span>
              </p>
              <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                By eliminating accidental trial rollovers, duplicate services, and zombie charges.
              </p>
            </div>

            <div className="space-y-3">
              <Button size="lg" asChild className="w-full shadow-lg shadow-primary/20 hover:shadow-primary/30">
                <Link href="/register" className="flex items-center justify-center gap-2 font-semibold">
                  <span>Save This With Rekur</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <p className="text-[11px] text-muted-foreground">
                Rekur starts free. Personal Pro is only $3/mo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
