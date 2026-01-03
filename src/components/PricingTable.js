// 'use client';

// import { useState } from 'react';
// import { useAuth } from '@/context/AuthContext'; // <-- This now imports the hook
// import { loadStripe } from '@stripe/stripe-js';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Check, Loader2 } from 'lucide-react';
// import Link from 'next/link';
// import { useToast } from '@/components/ui/use-toast';

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// // Real Price IDs
// const PRICE_IDS = {
//   pro: {
//     monthly: 'price_1SMfSu6ATC65iqtLhvHYjaH9',  // $3/mo
//     yearly: 'price_1SMfUS6ATC65iqtLqlxcOPH0',   // $25/yr
//   },
//   business: {
//     monthly: 'price_1SMfW36ATC65iqtLGUC00tQU', // $10/mo
//     yearly: 'price_1SMfXB6ATC65iqtLBth2CbBm',   // $100/yr
//   },
// };

// export default function PricingTable() {
//   // AuthContext provides 'loading' and 'plan'
//   const { user, plan: currentPlan, loading } = useAuth();
//   const { toast } = useToast();
//   const [billing, setBilling] = useState('monthly');
//   const [isRedirecting, setIsRedirecting] = useState(false);

//   const handleUpgrade = async (planKey) => {
//     if (!user) {
//       window.location.href = '/login';
//       return;
//     }

//     setIsRedirecting(true);
//     const priceId = PRICE_IDS[planKey][billing];

//     try {
//       const res = await fetch('/api/stripe/create-checkout', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ priceId, userId: user.uid }),
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.error || 'Checkout session creation failed');
//       }

//       const { url } = await res.json();
//       if (!url) {
//         throw new Error('No checkout URL returned');
//       }
//       window.location.href = url;

//     } catch (err) {
//       console.error('Checkout error:', err);
//       toast({
//         title: "Error",
//         description: err.message || 'Failed to start checkout. Please try again.',
//         variant: "destructive",
//       });
//       setIsRedirecting(false);
//     }
//   };

//   // This `if (loading)` block is the key. 
//   // correctly wait for the context to be ready.
//   if (loading) {
//     return (
//       <div className="max-w-6xl mx-auto p-6">
//         {/* Placeholder for billing toggle */}
//         <div className="flex justify-center mb-8">
//           <div className="inline-flex items-center bg-gray-100 dark:bg-gray-800 rounded-full p-1 h-10 w-48 animate-pulse">
//           </div>
//         </div>
//         {/* Placeholder for pricing grid */}
//         <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//           <div className="bg-gray-100 dark:bg-gray-800 rounded-lg h-96 animate-pulse"></div>
//           <div className="bg-gray-100 dark:bg-gray-800 rounded-lg h-96 animate-pulse"></div>
//         </div>
//       </div>
//     );
//   }

//   // --- Auth is loaded, it now safely renders ---

//   // === ALL PLANS ===
//   const allPlans = [
//     {
//       name: 'Personal (Free)',
//       price: '$0',
//       features: ['Track up to 5 subs', 'Email reminders'],
//       cta: null,
//       current: currentPlan === 'free',
//       planKey: 'free',
//     },
//     {
//       name: 'Personal Pro',
//       price: billing === 'monthly' ? '$3' : '$25',
//       subtitle: billing === 'monthly' ? '/mo' : '/yr',
//       features: ['Unlimited subs', 'SMS/WhatsApp', 'CSV Export'],
//       planKey: 'pro',
//       current: currentPlan === 'pro',
//     },
//     {
//       name: 'Business',
//       price: billing === 'monthly' ? '$10' : '$100',
//       subtitle: billing === 'monthly' ? '/mo' : '/yr',
//       features: ['Team invites', 'Spend analytics', 'Categories'],
//       planKey: 'business',
//       current: currentPlan === 'business',
//     },
//   ];

//   // === SMART FILTERING (This logic is now correct) ===
//   let plansToShow = [];

//   if (!user) {
//     // Story 1: Not logged in → Show only paid plans (Pro, Business)
//     plansToShow = allPlans.filter(p => p.planKey !== 'free');
//   } else if (currentPlan === 'pro') {
//     // Story 3: Pro user → Show only Pro (current) + Business
//     plansToShow = allPlans.filter(p => p.planKey === 'pro' || p.planKey === 'business');
//   } else if (currentPlan === 'business') {
//     // Story 4: Business user → Show only Business
//     plansToShow = allPlans.filter(p => p.planKey === 'business');
//   } else {
//     // Story 2: Free user → Show all 3
//     plansToShow = allPlans;
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       {/* Billing Toggle */}
//       {plansToShow.some(p => p.planKey !== 'free') && (
//         <div className="flex justify-center mb-8">
//           <div className="inline-flex items-center bg-gray-100 dark:bg-gray-800 rounded-full p-1">
//             <button
//               onClick={() => setBilling('monthly')}
//               className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
//                 billing === 'monthly'
//                   ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
//                   : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
//               }`}
//             >
//               Monthly
//             </button>
//             <button
//               onClick={() => setBilling('yearly')}
//               className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
//                 billing === 'yearly'
//                   ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
//                   : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
//               }`}
//             >
//               Yearly
//               <span className="ml-1 text-xs text-green-600 font-bold">Save 30%</span>
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Pricing Grid */}
//       <div
//         className={`grid grid-cols-1 gap-6 ${
//           plansToShow.length === 3 ? 'md:grid-cols-3' : `md:grid-cols-2 ${plansToShow.length === 1 ? 'max-w-md mx-auto' : ''}`
//         }`}
//       >
//         {plansToShow.map((plan) => (
//           <Card
//             key={plan.name}
//             className={`relative transition-all duration-200 ${
//               plan.current ? 'ring-2 ring-primary shadow-lg' : 'shadow dark:border-gray-700'
//             }`}
//           >
//             {plan.current && (
//               <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 bg-primary">
//                 Current Plan
//               </Badge>
//             )}

//             <CardHeader className="text-center pb-4">
//               <CardTitle className="text-xl font-semibold">{plan.name}</CardTitle>
//               <div className="mt-3">
//                 <span className="text-3xl font-bold">{plan.price}</span>
//                 {plan.subtitle && (
//                   <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">{plan.subtitle}</span>
//                 )}
//               </div>
//             </CardHeader>

//             <CardContent>
//               <ul className="space-y-3 mb-6">
//                 {plan.features.map((feature) => (
//                   <li key={feature} className="flex items-center gap-2 text-sm">
//                     <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
//                     <span>{feature}</span>
//                   </li>
//                 ))}
//               </ul>

//               {plan.cta ? (
//                 plan.cta
//               ) : (
//                 <Button
//                   className="w-full"
//                   variant={(currentPlan === 'free' && plan.planKey === 'pro') || (currentPlan === 'pro' && plan.planKey === 'business') ? 'default' : 'outline'}
//                   onClick={() => handleUpgrade(plan.planKey)}
//                   disabled={isRedirecting || plan.current}
//                 >
//                   {isRedirecting ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Loading...
//                     </>
//                   ) : plan.current ? (
//                     'Current Plan'
//                   ) : (
//                     'Upgrade Now'
//                   )}
//                 </Button>
//               )}
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// }


'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// 1. Variant IDs from your Lemon Squeezy Dashboard
const VARIANT_IDS = {
  pro: {
    monthly: process.env.NEXT_PUBLIC_LEMON_PRO_MONTHLY_VARIANT_ID || '12345',
    yearly: process.env.NEXT_PUBLIC_LEMON_PRO_YEARLY_VARIANT_ID || '12346',
  },
  business: {
    monthly: process.env.NEXT_PUBLIC_LEMON_BUSINESS_MONTHLY_VARIANT_ID || '12347',
    yearly: process.env.NEXT_PUBLIC_LEMON_BUSINESS_YEARLY_VARIANT_ID || '12348',
  },
};

export default function PricingTable() {
  const { user, plan: currentPlan, loading } = useAuth();
  const { toast } = useToast();
  const [billing, setBilling] = useState('monthly');
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleUpgrade = async (planKey) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    setIsRedirecting(true);
    const variantId = VARIANT_IDS[planKey][billing];

    try {
      // 2. Call the new Lemon Squeezy route
      const res = await fetch('/api/lemon/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          variantId, 
          userId: user.uid,
          userEmail: user.email // Pass email to pre-fill checkout
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Checkout creation failed');
      }

      const { url } = await res.json();
      if (!url) throw new Error('No checkout URL returned');
      
      // 3. Redirect to Lemon Squeezy
      window.location.href = url;

    } catch (err) {
      console.error('Checkout error:', err);
      toast({
        title: "Error",
        description: err.message || 'Failed to start checkout.',
        variant: "destructive",
      });
      setIsRedirecting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-full h-10 w-48 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg h-96 animate-pulse" />
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg h-96 animate-pulse" />
        </div>
      </div>
    );
  }

  const allPlans = [
    {
      name: 'Personal (Free)',
      price: '$0',
      features: ['Track up to 5 subs', 'Email reminders'],
      cta: null,
      current: currentPlan === 'free',
      planKey: 'free',
    },
    {
      name: 'Personal Pro',
      price: billing === 'monthly' ? '$3' : '$25',
      subtitle: billing === 'monthly' ? '/mo' : '/yr',
      features: ['Unlimited subs', 'SMS/WhatsApp', 'CSV Export'],
      planKey: 'pro',
      current: currentPlan === 'pro',
    },
    {
      name: 'Business',
      price: billing === 'monthly' ? '$10' : '$99',
      subtitle: billing === 'monthly' ? '/mo' : '/yr',
      features: ['Team invites', 'Spend analytics', 'Categories'],
      planKey: 'business',
      current: currentPlan === 'business',
    },
  ];

  let plansToShow = [];
  if (!user) plansToShow = allPlans.filter(p => p.planKey !== 'free');
  else if (currentPlan === 'pro') plansToShow = allPlans.filter(p => p.planKey === 'pro' || p.planKey === 'business');
  else if (currentPlan === 'business') plansToShow = allPlans.filter(p => p.planKey === 'business');
  else plansToShow = allPlans;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {plansToShow.some(p => p.planKey !== 'free') && (
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center bg-gray-100 dark:bg-gray-800 rounded-full p-1">
            <button
              onClick={() => setBilling('monthly')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                billing === 'monthly' ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : 'text-gray-500'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('yearly')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                billing === 'yearly' ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : 'text-gray-500'
              }`}
            >
              Yearly <span className="ml-1 text-xs text-green-600 font-bold">Save 30%</span>
            </button>
          </div>
        </div>
      )}

      <div className={`grid grid-cols-1 gap-6 ${plansToShow.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
        {plansToShow.map((plan) => (
          <Card key={plan.name} className={`relative transition-all ${plan.current ? 'ring-2 ring-primary shadow-lg' : ''}`}>
            {plan.current && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">Current Plan</Badge>}
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-semibold">{plan.name}</CardTitle>
              <div className="mt-3">
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.subtitle && <span className="text-sm text-muted-foreground ml-1">{plan.subtitle}</span>}
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              {plan.cta ? plan.cta : (
                <Button
                  className="w-full"
                  variant={plan.current ? 'outline' : 'default'}
                  onClick={() => handleUpgrade(plan.planKey)}
                  disabled={isRedirecting || plan.current}
                >
                  {isRedirecting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...</> : plan.current ? 'Current Plan' : 'Upgrade Now'}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}