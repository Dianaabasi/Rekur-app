import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 text-center bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <h1 className="text-4xl font-bold mb-6">Simplifying Your Financial Life</h1>
            <p className="text-xl text-muted-foreground">
              Rekur helps you take control of your recurring expenses, so you never pay for an unwanted subscription again.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-3xl space-y-8">
            <div className="prose dark:prose-invert max-w-none">
              <h2 className="text-2xl font-bold mb-4">The Problem</h2>
              <p className="text-lg text-muted-foreground mb-8">
                We`ve all been there. You sign up for a 7-day free trial, forget to cancel, and suddenly you`re charged. 
                Or maybe you have five different streaming services but only watch two. In today`s subscription economy, 
                it`s easy to lose track of where your money is going.
              </p>

              <h2 className="text-2xl font-bold mb-4">Our Solution</h2>
              <p className="text-lg text-muted-foreground">
                Rekur was built to be the central hub for all your subscriptions. We don`t just list them; 
                we actively remind you before renewals happen via Email, SMS, and WhatsApp. Whether you are a 
                freelancer managing software tools or a household managing entertainment, Rekur gives you the clarity you need.
              </p>
            </div>

            {/* Features List */}
            <div className="grid md:grid-cols-2 gap-4 mt-8">
              {['Track Unlimited Subscriptions', 'Multi-channel Reminders', 'Cost Analytics', 'Team Collaboration'].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}