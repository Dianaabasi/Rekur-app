'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { MessageSquare, Mail, Smartphone, Bell, CheckCircle2 } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.48, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -16, scale: 0.97, transition: { duration: 0.25, ease: 'easeIn' } },
};

const msgItem = {
  hidden: { opacity: 0, x: -10 },
  visible: (i) => ({
    opacity: 1, x: 0,
    transition: { delay: 0.1 + i * 0.08, duration: 0.38, ease: [0.16, 1, 0.3, 1] },
  }),
};

const channels = [
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare, activeClass: 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25' },
  { id: 'sms',      label: 'SMS',      icon: Smartphone,    activeClass: 'bg-primary text-primary-foreground shadow-md shadow-primary/25' },
  { id: 'email',    label: 'Email',    icon: Mail,          activeClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25' },
];

export default function NotificationShowcase() {
  const [activeChannel, setActiveChannel] = useState('whatsapp');
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} id="notifications" className="py-20 md:py-28 bg-muted/20 border-y border-border/50 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

        {/* ── Header ── */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} custom={0}>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-3">
              <motion.span animate={{ rotate: [0, -15, 15, -8, 0] }} transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 3 }}>
                <Bell className="w-3.5 h-3.5" />
              </motion.span>
              <span>Multi-Channel Delivery</span>
            </div>
          </motion.div>

          <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} custom={1}
            className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Alerts Exactly Where You Actually Check
          </motion.h2>

          <motion.p initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} custom={2}
            className="mt-3 text-base sm:text-lg text-muted-foreground">
            Don&apos;t let renewals hide in your cluttered spam folder. Choose between instant WhatsApp, SMS text, or Email notifications.
          </motion.p>

          {/* Pills */}
          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} custom={3}
            className="mt-8 inline-flex flex-wrap justify-center p-1.5 rounded-full bg-background border border-border/80 shadow-sm gap-1">
            {channels.map(({ id, label, icon: Icon, activeClass }, i) => (
              <motion.button key={id} onClick={() => setActiveChannel(id)}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.35 + i * 0.07, type: 'spring', stiffness: 260, damping: 18 }}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors ${
                  activeChannel === id ? activeClass : 'text-muted-foreground hover:text-foreground'
                }`}>
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* ── Card ── */}
        <motion.div className="max-w-xl mx-auto"
          initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}>
          <AnimatePresence mode="wait">

            {activeChannel === 'whatsapp' && (
              <motion.div key="whatsapp" variants={cardVariants} initial="hidden" animate="visible" exit="exit"
                className="rounded-3xl border border-emerald-500/30 bg-[#0b141a] text-white p-5 sm:p-7 shadow-2xl shadow-emerald-500/15">
                {/* Header */}
                <motion.div custom={0} variants={msgItem} initial="hidden" animate="visible"
                  className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <motion.div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-white shadow"
                      animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
                      R
                    </motion.div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-semibold text-sm">Rekur Assistant</p>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                      </div>
                      <p className="text-[11px] text-white/60">Verified Business Account</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-white/50">Today 9:00 AM</span>
                </motion.div>
                {/* Bubble */}
                <motion.div custom={1} variants={msgItem} initial="hidden" animate="visible"
                  className="bg-[#202c33] rounded-2xl rounded-tl-none p-4 text-sm space-y-2.5 border border-white/5 shadow-inner">
                  <motion.p custom={0} variants={msgItem} initial="hidden" animate="visible" className="font-bold text-emerald-400">🔔 Upcoming Subscription Renewal</motion.p>
                  <motion.p custom={1} variants={msgItem} initial="hidden" animate="visible" className="text-white/90 leading-relaxed">
                    Hi Diana! Your <strong className="text-white">Adobe Creative Cloud</strong> subscription is set to renew in{' '}
                    <span className="text-amber-300 font-semibold">2 days</span>.
                  </motion.p>
                  <motion.div custom={2} variants={msgItem} initial="hidden" animate="visible" className="p-3 rounded-xl bg-black/30 border border-white/5 space-y-1 text-xs">
                    <div className="flex justify-between text-white/70"><span>Service:</span><span className="text-white font-medium">Adobe Creative Cloud</span></div>
                    <div className="flex justify-between text-white/70"><span>Renewal Date:</span><span className="text-white font-medium">September 2, 2026</span></div>
                    <div className="flex justify-between text-white/70"><span>Amount:</span><span className="text-emerald-400 font-bold text-sm">$54.99 / mo</span></div>
                  </motion.div>
                  <motion.p custom={3} variants={msgItem} initial="hidden" animate="visible" className="text-xs text-white/70">
                    Want to cancel or manage this before you are billed?
                  </motion.p>
                  <motion.div custom={4} variants={msgItem} initial="hidden" animate="visible" className="pt-2">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      className="block text-center py-2 px-4 rounded-lg bg-emerald-600 text-white font-semibold text-xs shadow-sm cursor-default">
                      Open in Rekur Dashboard →
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {activeChannel === 'sms' && (
              <motion.div key="sms" variants={cardVariants} initial="hidden" animate="visible" exit="exit"
                className="rounded-3xl border border-primary/30 bg-card p-5 sm:p-7 shadow-2xl shadow-primary/10">
                <motion.div custom={0} variants={msgItem} initial="hidden" animate="visible"
                  className="flex items-center justify-between border-b border-border pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <motion.div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold"
                      animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
                      <Smartphone className="w-5 h-5" />
                    </motion.div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">Rekur SMS Alert</p>
                      <p className="text-[11px] text-muted-foreground">+1 (800) REKUR-APP</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-muted-foreground">Just now</span>
                </motion.div>
                <motion.div custom={1} variants={msgItem} initial="hidden" animate="visible"
                  className="bg-primary/10 text-foreground rounded-2xl rounded-tl-none p-4 text-sm space-y-2 border border-primary/20">
                  <motion.p custom={0} variants={msgItem} initial="hidden" animate="visible" className="font-semibold text-primary">Rekur Alert:</motion.p>
                  <motion.p custom={1} variants={msgItem} initial="hidden" animate="visible" className="text-sm leading-relaxed">
                    Your <strong>ChatGPT Plus (OpenAI)</strong> plan renews tomorrow for <strong>$20.00</strong>.
                  </motion.p>
                  <motion.p custom={2} variants={msgItem} initial="hidden" animate="visible" className="text-xs text-muted-foreground">
                    Manage your renewal alerts in your Rekur settings.
                  </motion.p>
                </motion.div>
              </motion.div>
            )}

            {activeChannel === 'email' && (
              <motion.div key="email" variants={cardVariants} initial="hidden" animate="visible" exit="exit"
                className="rounded-3xl border border-indigo-500/30 bg-card p-5 sm:p-7 shadow-2xl shadow-indigo-500/10">
                <motion.div custom={0} variants={msgItem} initial="hidden" animate="visible"
                  className="flex items-center justify-between border-b border-border pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <motion.div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold"
                      animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
                      <Mail className="w-5 h-5" />
                    </motion.div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">Rekur Notifications</p>
                      <p className="text-[11px] text-muted-foreground">notifications@rekur-app.com</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-muted-foreground">8:30 AM</span>
                </motion.div>
                <motion.div custom={1} variants={msgItem} initial="hidden" animate="visible"
                  className="rounded-xl border border-border/80 bg-background p-4 space-y-3 text-sm">
                  <motion.div custom={0} variants={msgItem} initial="hidden" animate="visible" className="flex items-center justify-between pb-2 border-b border-border">
                    <p className="font-bold text-foreground">Figma Professional — Renewal in 3 Days</p>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary">$15.00/mo</span>
                  </motion.div>
                  <motion.p custom={1} variants={msgItem} initial="hidden" animate="visible" className="text-muted-foreground text-xs leading-relaxed">
                    Hi Diana, this is your scheduled reminder that your annual Figma team billing will process on September 3, 2026.
                  </motion.p>
                  <motion.div custom={2} variants={msgItem} initial="hidden" animate="visible" className="pt-2 flex gap-2">
                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                      className="inline-block py-1.5 px-3.5 rounded-md bg-primary text-primary-foreground text-xs font-medium cursor-default">
                      View in Dashboard
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                      className="inline-block py-1.5 px-3.5 rounded-md border border-border text-xs font-medium text-muted-foreground cursor-default">
                      Manage Preferences
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}

