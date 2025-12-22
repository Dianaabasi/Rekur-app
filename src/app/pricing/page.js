import PricingTable from '@/components/PricingTable';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-4">
          Choose Your Plan
        </h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Upgrade to unlock unlimited subscriptions, SMS/WhatsApp reminders, and more.
        </p>
        <PricingTable />
      </div>
    </div>
  );
}