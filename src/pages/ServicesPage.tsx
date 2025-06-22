import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, PackageCheck, Wrench, ClipboardCheck, Headset } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ServicesPage: React.FC = () => {
  const processSteps = [
    {
      icon: <PackageCheck className="w-8 h-8 text-[#1d7d69]" />,
      title: 'Medical Equipment Supply',
      description: 'We offer a broad selection of advanced medical equipment for hospitals, clinics, and diagnostic centers to meet modern healthcare demands.'
    },
    {
      icon: <Wrench className="w-8 h-8 text-[#1d7d69]" />,
      title: 'Installation & Maintenance',
      description: 'Our trained technicians ensure proper installation and provide ongoing maintenance to keep your equipment functioning at peak performance.'
    },
    {
      icon: <ClipboardCheck className="w-8 h-8 text-[#1d7d69]" />,
      title: 'Consultation & Procurement',
      description: 'We help healthcare providers make informed decisions with expert consultation and hassle-free procurement of medical technologies.'
    },
    {
      icon: <Headset className="w-8 h-8 text-[#1d7d69]" />,
      title: 'After-Sales Support',
      description: 'TWe provide reliable after-sales service, including training, troubleshooting, and quick replacement to ensure uninterrupted operations.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#1d7d69]">Our Services</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              We offer a range of high-quality medical equipment solutions tailored to healthcare providers' needs.
              Discover how we can support your facility's success.
              <br /><br />
              Need Equipment Service Support?
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-[#1d7d69] hover:bg-[#166353] text-white">Get Service Support</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Request Service Support</DialogTitle>
                  <DialogDescription>Fill in the form and we’ll get back to you shortly.</DialogDescription>
                </DialogHeader>
                <form className="space-y-4">
                  {['Name', 'Email', 'Phone'].map((label, idx) => (
                    <div className="grid gap-2" key={idx}>
                      <label htmlFor={label.toLowerCase()} className="text-sm font-medium">{label}</label>
                      <Input id={label.toLowerCase()} placeholder={`Your ${label}`} type={label === 'Email' ? 'email' : label === 'Phone' ? 'tel' : 'text'} />
                    </div>
                  ))}
                  <div className="grid gap-2">
                    <label htmlFor="message" className="text-sm font-medium">Issue Description</label>
                    <Textarea id="message" placeholder="Describe the issue or requirement..." rows={4} />
                  </div>
                </form>
                <DialogFooter>
                  <Button type="submit" className="bg-[#1d7d69] hover:bg-[#166353] text-white">Submit</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </section>

        {/* Services Tabs (unchanged) */}
        {/* ... your Tabs section remains the same ... */}

        {/* Process Section */}
<section className="py-20 bg-gray-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold text-[#1d7d69] mb-4">Our Process</h2>
              <p className="text-gray-600 max-w-xl mx-auto leading-relaxed">
                A step-by-step process to bring quality service and support to healthcare facilities.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, index) => (
                <Card key={index} className="bg-white rounded-2xl shadow hover:shadow-lg transition duration-300">
                  <CardHeader className="flex flex-col items-center space-y-3">
                    <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#e6f4f1]">
                      {step.icon}
                    </div>
                    <CardTitle className="text-center text-lg font-semibold text-[#1d7d69]">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm text-gray-600 text-center leading-relaxed">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-[#1d7d69] text-white text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Hospital Project?</h2>
            <p className="max-w-2xl mx-auto mb-6">
              Contact us today for a free consultation and estimate. Let's bring your healthcare vision to life.
            </p>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=sreemeditec@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="secondary" className="text-[#1d7d69] bg-white hover:bg-gray-100">
                Contact Us
              </Button>
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;
