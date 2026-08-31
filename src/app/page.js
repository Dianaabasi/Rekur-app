import LandingHeader from '@/components/landing/LandingHeader';
import LandingHero from '@/components/landing/LandingHero';
import ProblemStats from '@/components/landing/ProblemStats';
import SavingsCalculator from '@/components/landing/SavingsCalculator';
import NotificationShowcase from '@/components/landing/NotificationShowcase';
import FeatureBento from '@/components/landing/FeatureBento';
import PricingSection from '@/components/landing/PricingSection';
import FAQSection from '@/components/landing/FAQSection';
import { FAQ_DATA } from '@/data/faq';
import LandingFooter from '@/components/landing/LandingFooter';


export default function LandingPage() {
  // Schema.org JSON-LD Structured Data for SEO Rich Snippets
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Rekur',
    operatingSystem: 'All (Web, iOS, Android)',
    applicationCategory: 'FinanceApplication',
    description:
      'Smart subscription manager with automatic reminders via WhatsApp, SMS, and Email to prevent surprise recurring charges.',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: '0',
      highPrice: '10',
      offerCount: '3',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '128',
    },
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Rekur',
    url: 'https://www.rekur-app.com',
    logo: 'https://www.rekur-app.com/rekur.png',
    sameAs: ['https://twitter.com/rekurapp'],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_DATA.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      {/* Search Engine Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <LandingHeader />
        <main className="flex-1">
          <LandingHero />
          <ProblemStats />
          <FeatureBento />
          <NotificationShowcase />
          <SavingsCalculator />
          <PricingSection />
          <FAQSection />
        </main>
        <LandingFooter />
      </div>
    </>
  );
}