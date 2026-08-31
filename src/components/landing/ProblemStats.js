import { AlertTriangle, Clock, CreditCard, PieChart } from 'lucide-react';

export default function ProblemStats() {
  const stats = [
    {
      stat: '$1,040',
      label: 'Average Annual Waste',
      desc: 'The typical subscriber wastes over a thousand dollars yearly on forgotten services, hidden price hikes, and unused trials.',
      icon: CreditCard,
      badge: 'Per Person',
      accent: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20',
    },
    {
      stat: '42%',
      label: 'Forgotten Trials',
      desc: 'More than 4 out of 10 "free trials" convert into recurring auto-bills because users forget to cancel in time.',
      icon: Clock,
      badge: 'Auto-Renewed',
      accent: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      stat: '12+',
      label: 'Scattered Subscriptions',
      desc: 'Most people manage over a dozen services across 3+ credit cards, PayPal, Apple, and Google Play accounts with zero central visibility.',
      icon: PieChart,
      badge: 'Blind Spots',
      accent: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20',
    },
  ];

  return (
    <section className="py-20 bg-muted/30 border-y border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/20 mb-3">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>The Silent Budget Killer</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Subscription Overload Is Costing You Serious Money
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground">
            Companies design recurring billing to be invisible. Without active alerts before each renewal date, small charges quietly drain your bank account.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {stats.map((item) => (
            <div
              key={item.label}
              className="relative rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-xl ${item.bg}`}>
                    <item.icon className={`w-6 h-6 ${item.accent}`} />
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border/50">
                    {item.badge}
                  </span>
                </div>
                <p className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${item.accent}`}>
                  {item.stat}
                </p>
                <h3 className="mt-3 text-lg font-bold text-foreground">{item.label}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
