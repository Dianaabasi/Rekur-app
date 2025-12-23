import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mail, MessageSquare, Github, Twitter } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
            <p className="text-xl text-muted-foreground">
              Have questions about Rekur or need support? We`re here to help.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Support Card */}
            <Card className="p-8 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Email Support</h2>
              <p className="text-muted-foreground mb-6">
                For general inquiries, bugs, or feature requests.
              </p>
              <Button asChild className="w-full">
                <a href="mailto:dianaabasiekpenyong@gmail.com">support@rekur-app.com</a>
              </Button>
            </Card>

            {/* Developer Card */}
            <Card className="p-8 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Developer Contact</h2>
              <p className="text-muted-foreground mb-6">
                Connect with the developer directly for partnerships or technical queries.
              </p>
              
              <div className="flex gap-4 w-full justify-center">
                <Button variant="outline" size="icon" asChild>
                  {/* Replace with your Twitter/X Link */}
                  <Link href="https://x.com/diana_ekpes" target="_blank">
                    <Twitter className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="icon" asChild>
                  {/* Replace with your GitHub Link */}
                  <Link href="https://github.com/Dianaabasi" target="_blank">
                    <Github className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <a href="mailto:dianaabasiekpenyong@gmail.com">
                    <Mail className="h-5 w-5" />
                  </a>
                </Button>
              </div>
            </Card>
          </div>

          {/* FAQ or Additional Info Section */}
          <div className="mt-16 text-center">
            <h3 className="text-lg font-semibold mb-2">Response Time</h3>
            <p className="text-muted-foreground">
              We typically respond to all inquiries within 24-48 hours.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}