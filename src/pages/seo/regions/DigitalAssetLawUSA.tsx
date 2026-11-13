import React from 'react';
import { motion } from 'framer-motion';
import SEO from '../../../components/seo/SEO';
import { ArrowRight, Shield, Globe2, BookOpen, AlertTriangle, FileCheck, Landmark, Scale } from 'lucide-react';
import Button from '../../../components/ui/Button';

const DigitalAssetLawUSA = () => {
  const digitalWillHreflangs = [
    { lang: 'en-IN', href: 'https://transferlegacy.com/digital-will-india' },
    { lang: 'en-US', href: 'https://transferlegacy.com/digital-asset-inheritance-usa' },
    { lang: 'x-default', href: 'https://transferlegacy.com/digital-will' },
  ];
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is RUFADAA?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "RUFADAA stands for the Revised Uniform Fiduciary Access to Digital Assets Act. It is a US law adopted by nearly all states that dictates how executors and trustees can legally access a deceased person's digital accounts."
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-page text-primary pt-24 pb-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-aurora opacity-30 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 blur-[120px] pointer-events-none" />

      <SEO 
        title="US Digital Asset Laws: RUFADAA & Privacy Guide (2026)"
        description="Comprehensive guide to US digital asset laws. Learn how RUFADAA and the Stored Communications Act impact your digital estate and crypto inheritance."
        canonical="https://transferlegacy.com/digital-asset-inheritance-usa"
        schema={faqSchema}
        hreflangs={digitalWillHreflangs}
      />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 px-4 py-2 rounded-full mb-8 shadow-[0_0_20px_rgba(79,92,255,0.1)]"
          >
            <Globe2 className="w-4 h-4" />
            <span className="font-bold tracking-[0.2em] uppercase text-[10px]">US Legal Framework</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-8 leading-[0.95] tracking-tight text-primary">
            Digital Asset <span className="italic text-brand-primary">Laws in the USA</span>
          </h1>
          
          <p className="text-xl text-secondary mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            A masterclass in navigating RUFADAA, federal privacy laws, and the intersection of traditional estate planning with blockchain technology.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" size="lg" className="px-10 h-14 text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-brand-primary/20">
              Create Your Plan <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="space-y-16">
          <section className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[32px] p-8 md:p-12">
            <h2 className="flex items-center text-3xl font-display font-bold mb-8 text-primary tracking-tight">
              <Scale className="w-8 h-8 mr-4 text-brand-primary" />
              The RUFADAA Standard
            </h2>
            <div className="prose prose-invert max-w-none text-secondary">
              <p className="text-lg leading-relaxed mb-6">
                The <span className="text-primary font-bold">Revised Uniform Fiduciary Access to Digital Assets Act (RUFADAA)</span> provides the legal backbone for digital succession in the US. It solves the conflict between estate law and federal privacy mandates like the <span className="italic">Stored Communications Act</span>.
              </p>
              <p className="text-lg leading-relaxed">
                Crucially, RUFADAA establishes a hierarchy where instructions provided via an <span className="text-brand-primary font-bold">Online Tool</span> (like Transfer Legacy) take precedence over instructions in a will, providing the most robust legal standing for your digital legacy.
              </p>
            </div>
          </section>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[32px] p-8">
              <Landmark className="w-10 h-10 text-brand-gold mb-6" />
              <h3 className="text-xl font-display font-bold mb-4 text-primary">Access Hierarchy</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-primary/20 flex items-center justify-center text-[10px] font-bold text-brand-primary shrink-0">1</div>
                  <p className="text-sm text-secondary"><span className="text-primary font-bold">Online Tools</span> (Highest Priority)</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-base flex items-center justify-center text-[10px] font-bold text-muted shrink-0">2</div>
                  <p className="text-sm text-secondary">Will, Trust, or Power of Attorney</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-base flex items-center justify-center text-[10px] font-bold text-muted shrink-0">3</div>
                  <p className="text-sm text-secondary">Terms of Service Agreement</p>
                </li>
              </ul>
            </div>

            <div className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[32px] p-8 border-brand-primary/20 bg-brand-primary/5">
              <Shield className="w-10 h-10 text-brand-primary mb-6" />
              <h3 className="text-xl font-display font-bold mb-4 text-primary">Privacy vs Access</h3>
              <p className="text-secondary text-sm leading-relaxed mb-6">
                RUFADAA distinguishes between a "catalogue" of communications and the actual "content." To grant content access (e.g., email bodies or private keys), <span className="text-primary font-bold">explicit consent</span> is required.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-bold text-brand-primary uppercase tracking-widest">
                <FileCheck size={14} /> Explicit Consent Guaranteed
              </div>
            </div>
          </div>

          <section className="bg-obsidian-950/50 border border-brand-gold/20 rounded-[32px] p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <AlertTriangle size={120} className="text-brand-gold" />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl font-display font-bold mb-6 text-primary tracking-tight">The Decentralization Gap</h2>
              <p className="text-lg text-secondary leading-relaxed mb-8">
                While RUFADAA gives your executor the <span className="italic font-bold">legal right</span> to your crypto, the law cannot unlock a decentralized wallet. Without a protocol like Transfer Legacy, your digital wealth is legally owned but technically lost.
              </p>
              <Button variant="ghost" className="text-[11px] font-bold uppercase tracking-widest text-brand-gold p-0 hover:text-white">
                Learn about Technical Continuity
              </Button>
            </div>
          </section>

          <div className="bg-gradient-to-br from-brand-primary to-blue-900 text-obsidian-950 rounded-[40px] p-10 md:p-16 text-center shadow-2xl shadow-brand-primary/20">
            <BookOpen className="w-16 h-16 mx-auto mb-8 opacity-80" />
            <h3 className="text-3xl md:text-5xl font-display font-bold mb-6 tracking-tight leading-none">
              Deploy Your <span className="italic">Legal & Technical Vault</span>
            </h3>
            <p className="text-xl opacity-90 mb-12 max-w-2xl mx-auto font-medium">
              Bridge the gap between US law and blockchain reality. SEC-compliant encryption for your digital estate.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button onClick={() => window.scrollTo(0,0)} className="bg-obsidian-950 text-white hover:bg-obsidian-900 px-12 h-16 rounded-2xl text-[12px] font-bold uppercase tracking-widest">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalAssetLawUSA;
