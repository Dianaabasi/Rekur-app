'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  motion,
  useInView,
  animate,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Bell,
  CheckCircle2,
  Calendar,
  TrendingUp,
  DollarSign,
} from 'lucide-react';

// ── Animated counter hook ─────────────────────────────────────────────────────
function useAnimatedCounter(target, duration = 1.6, delay = 0.8) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const timeout = setTimeout(() => {
      const controls = animate(0, target, {
        duration,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (v) => setValue(v),
      });
      return () => controls.stop();
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [inView, target, duration, delay]);

  return { ref, value };
}

// ── Variants ──────────────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
};

const rowVariant = {
  hidden: { opacity: 0, x: -18 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay: 0.9 + i * 0.12, ease: [0.16, 1, 0.3, 1] },
  }),
};

const cardVariant = {
  hidden: { opacity: 0, scale: 0.92, y: 16 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.55, delay: 0.65 + i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

// ── Mock subscription data ────────────────────────────────────────────────────
const mockSubscriptions = [
  {
    id: 1,
    name: 'Netflix Premium',
    category: 'Entertainment',
    price: 19.99,
    period: 'mo',
    nextBilling: 'In 2 days',
    status: 'urgent',
    channel: 'WhatsApp + Email',
    color: 'bg-red-500/10 text-red-600 border-red-500/20',
    logo: (
      <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center shadow-sm flex-shrink-0">
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#E50914]" role="img" aria-label="Netflix">
          <path d="M5.398 0v24c1.868-.363 3.743-.728 5.617-1.092V7.472l4.821 15.659c2.08-.406 4.159-.811 6.237-1.217V0c-1.867.363-3.743.728-5.617 1.092v15.436L11.635 0H5.398z" />
        </svg>
      </div>
    ),
  },
  {
    id: 2,
    name: 'ChatGPT Plus (OpenAI)',
    category: 'AI & Tools',
    price: 20.00,
    period: 'mo',
    nextBilling: 'In 5 days',
    status: 'warning',
    channel: 'SMS',
    color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    logo: (
      <div className="w-10 h-10 rounded-xl bg-[#10a37f] flex items-center justify-center shadow-sm flex-shrink-0">
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" role="img" aria-label="OpenAI">
          <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
        </svg>
      </div>
    ),
  },
  {
    id: 3,
    name: 'Figma Professional',
    category: 'Design',
    price: 15.00,
    period: 'mo',
    nextBilling: 'In 12 days',
    status: 'normal',
    channel: 'Email',
    color: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    logo: (
      <div className="w-10 h-10 rounded-xl bg-[#1e1e1e] flex items-center justify-center shadow-sm flex-shrink-0">
        <svg viewBox="0 0 24 24" className="w-5 h-5" role="img" aria-label="Figma">
          <path fill="#F24E1E" d="M8 24c2.208 0 4-1.792 4-4v-4H8c-2.208 0-4 1.792-4 4s1.792 4 4 4z" />
          <path fill="#FF7262" d="M4 12c0-2.208 1.792-4 4-4h4v8H8c-2.208 0-4-1.792-4-4z" />
          <path fill="#A259FF" d="M4 4c0-2.208 1.792-4 4-4h4v8H8C5.792 8 4 6.208 4 4z" />
          <path fill="#1ABCFE" d="M12 0h4c2.208 0 4 1.792 4 4s-1.792 4-4 4h-4V0z" />
          <path fill="#0ACF83" d="M20 12c0 2.208-1.792 4-4 4s-4-1.792-4-4 1.792-4 4-4 4 1.792 4 4z" />
        </svg>
      </div>
    ),
  },
  {
    id: 4,
    name: 'Spotify Premium',
    category: 'Audio & Music',
    price: 11.99,
    period: 'mo',
    nextBilling: 'In 19 days',
    status: 'normal',
    channel: 'WhatsApp',
    color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    logo: (
      <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center shadow-sm flex-shrink-0">
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#1ED760]" role="img" aria-label="Spotify">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.498 17.307a.747.747 0 0 1-1.028.247c-2.816-1.721-6.36-2.111-10.536-1.157a.75.75 0 0 1-.336-1.462c4.568-1.044 8.49-.607 11.653 1.328a.75.75 0 0 1 .247 1.044zm1.467-3.262a.936.936 0 0 1-1.287.308c-3.224-1.982-8.139-2.555-11.953-1.397a.937.937 0 1 1-.544-1.792c4.358-1.323 9.774-.682 13.476 1.594a.938.938 0 0 1 .308 1.287zm.126-3.41c-3.864-2.295-10.245-2.508-13.92-1.392a1.124 1.124 0 1 1-.652-2.152c4.227-1.283 11.272-1.034 15.719 1.606a1.125 1.125 0 0 1-1.147 1.938z" />
        </svg>
      </div>
    ),
  },
];

// ── Cycling live notification toast ──────────────────────────────────────────
const toastQueue = [
  { icon: '🔔', text: 'Netflix renews in 2 days — $19.99', color: 'border-red-500/30 bg-red-500/5' },
  { icon: '✅', text: 'Spotify reminder sent via WhatsApp', color: 'border-emerald-500/30 bg-emerald-500/5' },
  { icon: '⚡', text: 'ChatGPT Plus renews in 5 days — $20.00', color: 'border-amber-500/30 bg-amber-500/5' },
];

function FloatingNotification() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const cycle = () => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % toastQueue.length);
        setVisible(true);
      }, 450);
    };
    const id = setInterval(cycle, 3400);
    return () => clearInterval(id);
  }, []);

  const n = toastQueue[index];

  return (
    <div className="absolute -top-5 -right-2 sm:-right-6 z-20 pointer-events-none">
      <AnimatePresence mode="wait">
        {visible && (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -10, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium shadow-lg backdrop-blur-md whitespace-nowrap ${n.color}`}
          >
            <span>{n.icon}</span>
            <span className="text-foreground/90">{n.text}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Top-to-bottom shimmer scan line ──────────────────────────────────────────
function ScanLine() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl"
      aria-hidden="true"
    >
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 3.5, ease: 'linear', repeat: Infinity, repeatDelay: 2 }}
      />
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function LandingHero() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-60px' });

  const { ref: burnRef, value: burnValue } = useAnimatedCounter(66.98, 1.6, 0.8);
  const { ref: daysRef, value: daysValue } = useAnimatedCounter(2, 0.85, 0.95);

  // 3D tilt tracking
  const tiltRef = useRef(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springConfig = { stiffness: 180, damping: 22, mass: 0.6 };
  const springX = useSpring(rawX, springConfig);
  const springY = useSpring(rawY, springConfig);
  const rotateX = useTransform(springY, [-0.5, 0.5], ['10deg', '-10deg']);
  const rotateY = useTransform(springX, [-0.5, 0.5], ['-12deg', '12deg']);

  function handleTiltMove(e) {
    const el = tiltRef.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    rawX.set((e.clientX - left) / width - 0.5);
    rawY.set((e.clientY - top) / height - 0.5);
  }

  function handleTiltLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  // Touch support for mobile
  function handleTouchMove(e) {
    const el = tiltRef.current;
    if (!el || !e.touches[0]) return;
    const touch = e.touches[0];
    const { left, top, width, height } = el.getBoundingClientRect();
    rawX.set((touch.clientX - left) / width - 0.5);
    rawY.set((touch.clientY - top) / height - 0.5);
  }

  function handleTouchEnd() {
    rawX.set(0);
    rawY.set(0);
  }

  // Gyroscope tilt for mobile (passive parallax when not touching)
  useEffect(() => {
    const isTouching = { current: false };
    function onTouch() { isTouching.current = true; }
    function onTouchEnd() { isTouching.current = false; }

    function onOrientation(e) {
      if (isTouching.current) return;
      // gamma = left/right tilt (-90 to 90), beta = front/back (-180 to 180)
      const gamma = Math.max(-30, Math.min(30, e.gamma ?? 0));
      const beta  = Math.max(-30, Math.min(30, (e.beta ?? 0) - 40)); // offset resting angle
      rawX.set(gamma / 30 * 0.45);
      rawY.set(beta  / 30 * 0.3);
    }

    window.addEventListener('deviceorientation', onOrientation, { passive: true });
    window.addEventListener('touchstart', onTouch, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('deviceorientation', onOrientation);
      window.removeEventListener('touchstart', onTouch);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [rawX, rawY]);

  return (
    <section
      ref={sectionRef}
      className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background"
    >
      {/* ── Breathing background orbs ── */}
      <motion.div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/15 blur-[120px] rounded-full pointer-events-none -z-10"
        animate={{ scale: [1, 1.14, 1], opacity: [0.55, 1, 0.55] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none -z-10"
        animate={{ x: [0, 32, 0], y: [0, -22, 0], opacity: [0.45, 0.9, 0.45] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[260px] h-[260px] bg-purple-500/8 blur-[90px] rounded-full pointer-events-none -z-10"
        animate={{ x: [0, -28, 0], y: [0, 18, 0], opacity: [0.35, 0.75, 0.35] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

        {/* ── Hero text block with stagger ── */}
        <motion.div
          className="text-center max-w-3xl mx-auto space-y-6"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={staggerContainer}
        >
          {/* Announcement badge */}
          <motion.div variants={fadeUp} custom={0}>
            <motion.div
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-primary shadow-sm hover:bg-primary/15 transition-colors"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span>Never miss a trial expiration or unwanted renewal</span>
              <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </motion.div>
          </motion.div>

          {/* H1 */}
          <motion.h1
            variants={fadeUp}
            custom={1}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]"
          >
            Track Subscriptions.{' '}
            <motion.span
              className="bg-gradient-to-r from-primary via-indigo-600 to-purple-600 bg-clip-text text-transparent inline-block"
              style={{ backgroundSize: '200% 200%' }}
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            >
              Stop Surprise Charges.
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Rekur automatically monitors all your recurring services and sends instant alerts to your{' '}
            <strong className="text-foreground font-semibold">WhatsApp, SMS, &amp; Email</strong> before money leaves your account.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            custom={3}
            className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button
                size="lg"
                asChild
                className="w-full sm:w-auto h-12 px-8 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-all"
              >
                <Link href="/register" className="flex items-center justify-center gap-2">
                  <span>Start Free</span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.span>
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="w-full sm:w-auto h-12 px-6 text-base font-medium border-border/80 hover:bg-muted/60"
              >
                <Link href="#calculator">Calculate Savings</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            variants={fadeUp}
            custom={4}
            className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-muted-foreground"
          >
            {[
              { icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />, label: 'Free forever plan' },
              { icon: <ShieldCheck className="w-4 h-4 text-primary" />, label: 'Bank-level encryption' },
              { icon: <Zap className="w-4 h-4 text-amber-500" />, label: 'Setup in under 60 seconds' },
            ].map(({ icon, label }, i) => (
              <motion.div
                key={label}
                className="flex items-center gap-1.5"
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7 + i * 0.1, duration: 0.4 }}
              >
                {icon}
                <span>{label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Animated Dashboard Mockup ── */}
        <motion.div
          className="mt-14 md:mt-20 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 55, scale: 0.97 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{ perspective: 1200 }}
        >
          <motion.div
            ref={tiltRef}
            onMouseMove={handleTiltMove}
            onMouseLeave={handleTiltLeave}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            className="relative rounded-2xl border border-border/60 bg-card/70 backdrop-blur-xl p-3 sm:p-6 shadow-2xl shadow-primary/10 will-change-transform touch-none"
          >

            {/* Cycling notification toast */}
            <FloatingNotification />

            {/* Pulsing outer ring */}
            <motion.div
              className="absolute -inset-px rounded-2xl pointer-events-none"
              animate={{
                boxShadow: [
                  '0 0 0px 0px hsl(var(--primary)/0)',
                  '0 0 40px 3px hsl(var(--primary)/0.15)',
                  '0 0 0px 0px hsl(var(--primary)/0)',
                ],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Window chrome bar */}
            <motion.div
              className="flex items-center justify-between border-b border-border/50 pb-4 mb-5"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-2">
                {['bg-red-400/80', 'bg-amber-400/80', 'bg-emerald-400/80'].map((c, i) => (
                  <motion.span
                    key={c}
                    className={`w-3 h-3 rounded-full ${c}`}
                    initial={{ scale: 0 }}
                    animate={inView ? { scale: 1 } : {}}
                    transition={{ delay: 0.65 + i * 0.08, type: 'spring', stiffness: 280, damping: 16 }}
                  />
                ))}
                <motion.span
                  className="ml-2 text-xs font-medium text-muted-foreground hidden sm:inline"
                  initial={{ opacity: 0, x: -10 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.88 }}
                >
                  app.rekur-app.com/dashboard
                </motion.span>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.78 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.92, type: 'spring' }}
              >
                <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20 py-0.5">
                  <motion.span
                    className="mr-1.5 inline-block w-1.5 h-1.5 rounded-full bg-primary"
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ duration: 1.1, repeat: Infinity }}
                  />
                  Live Preview
                </Badge>
              </motion.div>
            </motion.div>

            {/* Metric cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">

              {/* Monthly Burn */}
              <motion.div
                ref={burnRef}
                custom={0}
                variants={cardVariant}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                whileHover={{ y: -4, boxShadow: '0 10px 28px hsl(var(--primary)/0.13)' }}
                className="p-4 rounded-xl bg-background/80 border border-border/60 shadow-sm flex items-center justify-between cursor-default"
              >
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Monthly Burn</p>
                  <p className="text-2xl font-bold text-foreground mt-0.5">
                    ${burnValue.toFixed(2)}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                    <span>4 active services</span>
                  </p>
                </div>
                <motion.div
                  className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
                >
                  <DollarSign className="w-5 h-5" />
                </motion.div>
              </motion.div>

              {/* Next Renewal */}
              <motion.div
                ref={daysRef}
                custom={1}
                variants={cardVariant}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                whileHover={{ y: -4, boxShadow: '0 10px 28px rgba(239,68,68,0.12)' }}
                className="p-4 rounded-xl bg-background/80 border border-border/60 shadow-sm flex items-center justify-between cursor-default"
              >
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Next Renewal</p>
                  <p className="text-2xl font-bold text-red-600 mt-0.5">
                    {Math.round(daysValue)} Days
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">Netflix Premium ($19.99)</p>
                </div>
                <motion.div
                  className="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center"
                  animate={{ scale: [1, 1.18, 1] }}
                  transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Calendar className="w-5 h-5" />
                </motion.div>
              </motion.div>

              {/* Alert Channels */}
              <motion.div
                custom={2}
                variants={cardVariant}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                whileHover={{ y: -4, boxShadow: '0 10px 28px rgba(16,185,129,0.12)' }}
                className="p-4 rounded-xl bg-background/80 border border-border/60 shadow-sm flex items-center justify-between cursor-default"
              >
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Active Alert Channels</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-0.5">WhatsApp + SMS</p>
                  <p className="text-[11px] text-emerald-600 mt-1 font-medium">All reminders enabled</p>
                </div>
                <motion.div
                  className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center"
                  animate={{ rotate: [0, -18, 18, -10, 0] }}
                  transition={{ duration: 0.55, repeat: Infinity, repeatDelay: 2.8 }}
                >
                  <Bell className="w-5 h-5" />
                </motion.div>
              </motion.div>
            </div>

            {/* Subscriptions table */}
            <motion.div
              className="rounded-xl border border-border/60 bg-background/90 overflow-hidden relative"
              initial={{ opacity: 0, y: 22 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.82, duration: 0.52 }}
            >
              <ScanLine />

              <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between bg-muted/20">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Upcoming Renewals
                </span>
                <motion.span
                  className="text-xs text-primary font-medium flex items-center gap-1.5"
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.span
                    className="w-1.5 h-1.5 rounded-full bg-primary inline-block"
                    animate={{ scale: [1, 1.6, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                  Auto-Synced
                </motion.span>
              </div>

              <div className="divide-y divide-border/40">
                {mockSubscriptions.map((sub, i) => (
                  <motion.div
                    key={sub.id}
                    custom={i}
                    variants={rowVariant}
                    initial="hidden"
                    animate={inView ? 'visible' : 'hidden'}
                    whileHover={{ backgroundColor: 'hsl(var(--muted)/0.35)', x: 3 }}
                    className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <motion.div
                        whileHover={{ scale: 1.12, rotate: 6 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 14 }}
                      >
                        {sub.logo}
                      </motion.div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-foreground">{sub.name}</p>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                            {sub.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                          <span className="flex items-center gap-1">
                            <Bell className="w-3 h-3 text-primary" />
                            {sub.channel}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <motion.span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full border ${sub.color}`}
                        animate={sub.status === 'urgent' ? { scale: [1, 1.05, 1] } : {}}
                        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        Renews {sub.nextBilling}
                      </motion.span>
                      <p className="text-sm font-bold text-foreground sm:text-right min-w-[70px]">
                        ${sub.price.toFixed(2)}
                        <span className="text-xs font-normal text-muted-foreground">/{sub.period}</span>
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
