import {
  Calendar,
  Bell,
  BarChart3,
  Users,
  ShieldCheck,
  FileDown,
  Layers,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function FeatureBento() {
  return (
    <section id="features" className="py-20 md:py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Complete Subscription Control</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            Everything You Need To Master Your Recurring Expenses
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground">
            Engineered for individuals, freelancers, and businesses who want absolute visibility over every dollar leaving their accounts.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Bento Item 1: Calendar View (Span 2) */}
          <div className="md:col-span-2 rounded-3xl border border-border/80 bg-gradient-to-br from-card to-card/60 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="p-3 rounded-2xl bg-primary/10 text-primary w-fit mb-4">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                Visual Renewal Calendar
              </h3>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-xl">
                See all your upcoming charges laid out on a clean timeline. Never wonder when your next bill is due or get surprised on the 1st of the month.
              </p>
            </div>

            {/* Interactive Timeline Mock */}
            <div className="mt-6 pt-6 border-t border-border/60 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { day: 'Sep 02', name: 'Netflix', price: '$19.99', badge: 'bg-red-500/10 text-red-600' },
                { day: 'Sep 05', name: 'ChatGPT', price: '$20.00', badge: 'bg-emerald-500/10 text-emerald-600' },
                { day: 'Sep 12', name: 'Figma', price: '$15.00', badge: 'bg-purple-500/10 text-purple-600' },
                { day: 'Sep 18', name: 'GitHub', price: '$10.00', badge: 'bg-blue-500/10 text-blue-600' },
              ].map((item) => (
                <div key={item.name} className="p-3 rounded-xl bg-background border border-border/60 text-center">
                  <span className="text-[11px] font-semibold text-muted-foreground block">{item.day}</span>
                  <span className="text-xs font-bold text-foreground block mt-1">{item.name}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block mt-1 ${item.badge}`}>
                    {item.price}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bento Item 2: Multi-Channel Alerts (Span 1) */}
          <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-card to-card/60 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 w-fit mb-4">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                WhatsApp, SMS & Email
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Set custom reminder windows (1 day, 3 days, 7 days prior) delivered straight to the messaging channels you check every day.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Real-time instant delivery</span>
            </div>
          </div>

          {/* Bento Item 3: Spend Analytics & Burn Rate */}
          <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-card to-card/60 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 w-fit mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Spend Analytics</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Get a single consolidated breakdown of your monthly & yearly burn rate categorized by entertainment, work, software, and tools.
              </p>
            </div>
            <div className="mt-6 p-3 rounded-xl bg-background border border-border/60 flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Total Annual Spend</span>
              <span className="font-bold text-primary text-sm">$1,480.00 / yr</span>
            </div>
          </div>

          {/* Bento Item 4: Team Workspaces */}
          <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-card to-card/60 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 w-fit mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Team Workspaces</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Invite co-founders, accounting teammates, or family members to view shared subscriptions without sharing credentials.
              </p>
            </div>
            <div className="mt-6 flex -space-x-2 overflow-hidden">
              <div className="inline-block h-8 w-8 rounded-full ring-2 ring-background bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center">D</div>
              <div className="inline-block h-8 w-8 rounded-full ring-2 ring-background bg-purple-600 text-white font-bold text-xs flex items-center justify-center">S</div>
              <div className="inline-block h-8 w-8 rounded-full ring-2 ring-background bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">A</div>
            </div>
          </div>

          {/* Bento Item 5: Security & Export */}
          <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-card to-card/60 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-600 w-fit mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Encrypted & Private</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Your data is strictly yours. Bank-grade Firestore security rules, zero data selling, and one-click CSV backup anytime.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs text-muted-foreground">
              <FileDown className="w-4 h-4 text-primary" />
              <span>Full CSV export included</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
