import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <div className="prose dark:prose-invert">
          <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-2">1. Acceptance of Terms</h2>
          <p>By accessing and using Rekur, you accept and agree to be bound by the terms and provision of this agreement.</p>

          <h2 className="text-xl font-semibold mt-6 mb-2">2. Subscription Services</h2>
          <p>Rekur provides subscription tracking services. We are not responsible for the actual cancellation of your third-party services; we only provide reminders and tracking tools.</p>

          <h2 className="text-xl font-semibold mt-6 mb-2">3. User Accounts</h2>
          <p>You are responsible for maintaining the security of your account and password. Rekur cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-2">4. Termination</h2>
          <p>We reserve the right to terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}