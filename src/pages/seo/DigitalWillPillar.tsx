import React from 'react';
import { motion } from 'framer-motion';
import SEO from '../../components/seo/SEO';
import { ArrowRight, Shield, BookOpen, AlertTriangle, FileCheck, Landmark, CheckCircle2, Scroll, PenTool } from 'lucide-react';
import Button from '../../components/ui/Button';

const DigitalWillPillar = () => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Can I put my passwords in a regular will?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "It is highly discouraged to include passwords or seed phrases in a traditional paper will. Wills often become public records during probate, exposing your sensitive data to identity thieves and hackers. A Digital Will protocol like Transfer Legacy is required for secure storage."
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-page text-primary pt-24 pb-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-aurora opacity-30 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 blur-[120px] pointer-events-none" />

      <SEO 
        title="The Digital Will Blueprint: Legacy Planning for the 21st Century"
        description="Learn how to build a legally binding and technically secure Digital Will. Protect your crypto, social media, and digital identities with Transfer Legacy."
        canonical="https://transferlegacy.com/digital-will"
        schema={faqSchema}
      />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 px-4 py-2 rounded-full mb-8 shadow-[0_0_20px_rgba(79,92,255,0.1)]"
          >
            <Scroll className="w-4 h-4" />
            <span className="font-bold tracking-[0.2em] uppercase text-[10px]">Institutional Pillar Guide</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-8 leading-[0.95] tracking-tight text-primary">
            The Digital Will <span className="italic text-brand-primary">Blueprint</span>
          </h1>
          
          <p className="text-xl text-secondary mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            Standard wills are built for houses and cars. Digital Wills are built for the cloud. Bridge the gap between physical law and digital reality.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" size="lg" className="px-10 h-14 text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-brand-primary/20">
              Draft Your Digital Will <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="space-y-16">
          <section className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[32px] p-8 md:p-12">
            <h2 className="flex items-center text-3xl font-display font-bold mb-8 text-primary tracking-tight">
              <PenTool className="w-8 h-8 mr-4 text-brand-primary" />
              What is a Digital Will?
            </h2>
            <div className="prose prose-invert max-w-none text-secondary">
              <p className="text-lg leading-relaxed mb-6">
                A <span className="text-primary font-bold">Digital Will</span> is not just a document - it's a technical protocol. While a traditional will gives your heirs the <span className="italic">legal right</span> to your property, a Digital Will provides them with the <span className="italic">technical means</span> to access it.
              </p>
              <p className="text-lg leading-relaxed">
                In the US, UK, and India, digital assets are recognized as property, but the "Stored Communications Act" and exchange "Terms of Service" often block executors from accessing accounts even with a death certificate.
              </p>
            </div>
          </section>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[32px] p-8">
              <FileCheck className="w-10 h-10 text-brand-gold mb-6" />
              <h3 className="text-xl font-display font-bold mb-4 text-primary">Execution Standards</h3>
              <p className="text-secondary text-sm leading-relaxed mb-6">
                A valid Digital Will must address both <span className="text-primary font-bold">Content</span> (the value of assets) and <span className="text-primary font-bold">Access</span> (the credentials to move them).
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-[11px] font-bold text-muted uppercase tracking-wider">
                  <CheckCircle2 size={14} className="text-emerald-400" /> RUFADAA Compliant
                </li>
                <li className="flex items-center gap-2 text-[11px] font-bold text-muted uppercase tracking-wider">
                  <CheckCircle2 size={14} className="text-brand-gold" /> Zero-Knowledge Security
                </li>
              </ul>
            </div>

            <div className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[32px] p-8 border-brand-primary/20 bg-brand-primary/5">
              <Landmark className="w-10 h-10 text-brand-primary mb-6" />
              <h3 className="text-xl font-display font-bold mb-4 text-primary">Estate Integration</h3>
              <p className="text-secondary text-sm leading-relaxed mb-6">
                Integrate your Transfer Legacy protocol directly into your physical estate documents. We provide the "Legal Language" to include in your traditional will.
              </p>
              <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-widest text-brand-primary p-0">
                Get Legal Wording Template
              </Button>
            </div>
          </div>

          <section className="bg-obsidian-950/50 border border-brand-gold/20 rounded-[32px] p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <AlertTriangle size={120} className="text-brand-gold" />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl font-display font-bold mb-6 text-primary tracking-tight">The "Terms of Service" Trap</h2>
              <p className="text-lg text-secondary leading-relaxed mb-8">
                Most exchanges strictly forbid sharing login credentials. If your family logs in using your password after you're gone, they may be <span className="italic text-primary font-bold">violating federal laws</span>. Transfer Legacy provides the "online tool" authorization required by modern digital asset acts.
              </p>
              <div className="flex items-center gap-4 p-4 bg-brand-gold/10 rounded-2xl border border-brand-gold/20">
                <Shield className="text-brand-gold shrink-0" size={24} />
                <p className="text-sm font-medium text-brand-gold leading-tight">
                  Transfer Legacy ensures your heirs access your accounts legally and securely, without triggering fraudulent activity alerts.
                </p>
              </div>
            </div>
          </section>

          <div className="bg-gradient-to-br from-brand-primary to-blue-900 text-obsidian-950 rounded-[40px] p-10 md:p-16 text-center shadow-2xl shadow-brand-primary/20">
            <BookOpen className="w-16 h-16 mx-auto mb-8 opacity-80" />
            <h3 className="text-3xl md:text-5xl font-display font-bold mb-6 tracking-tight leading-none">
              Initialize Your <br /><span className="italic">Digital Will Protocol</span>
            </h3>
            <p className="text-xl opacity-90 mb-12 max-w-2xl mx-auto font-medium">
              Secure your crypto, identities, and memories with the global standard in digital succession.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button onClick={() => window.scrollTo(0,0)} className="bg-obsidian-950 text-white hover:bg-obsidian-900 px-12 h-16 rounded-2xl text-[12px] font-bold uppercase tracking-widest">
                Start Your Digital Will
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalWillPillar;
