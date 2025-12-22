import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <div className="prose dark:prose-invert">
          <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
          <p>We collect information you provide directly to us, such as your name, email address, and subscription details when you create an account.</p>

          <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
          <p>We use the information we collect to provide, maintain, and improve our services, including sending you subscription reminders via Email, SMS, or WhatsApp as configured by you.</p>

          <h2 className="text-xl font-semibold mt-6 mb-2">3. Data Security</h2>
          <p>We implement reasonable security measures to protect your personal information. Your payments are processed securely via Stripe.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-2">4. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at support@rekur.app.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}