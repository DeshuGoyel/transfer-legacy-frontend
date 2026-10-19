import React from 'react';
import { motion } from 'framer-motion';
import SEO from '../../../components/seo/SEO';
import { ArrowRight, Shield, Globe2, BookOpen, AlertTriangle, FileCheck, Landmark, Scale, CheckCircle2 } from 'lucide-react';
import Button from '../../../components/ui/Button';

const DigitalWillIndia = () => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is a Digital Will in India?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A Digital Will in India is a legal document that specifically outlines how your digital assets - such as social media accounts, emails, and cryptocurrency - should be handled after death, according to the Indian Succession Act."
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-page text-primary pt-24 pb-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-aurora opacity-30 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 blur-[120px] pointer-events-none" />

      <SEO 
        title="Digital Will India: Legal Guide for Crypto & Accounts (2024)"
        description="Learn how to create a legally binding Digital Will in India. Protect your crypto, social media, and online banking under the Indian Succession Act."
        canonical="https://transferlegacy.com/digital-will-india"
        schema={faqSchema}
      />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 px-4 py-2 rounded-full mb-8 shadow-[0_0_20px_rgba(79,92,255,0.1)]"
          >
            <Globe2 className="w-4 h-4" />
            <span className="font-bold tracking-[0.2em] uppercase text-[10px]">India Digital Estate</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-8 leading-[0.95] tracking-tight text-primary">
            Digital Wills <span className="italic text-brand-primary">in India</span>
          </h1>
          
          <p className="text-xl text-secondary mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            The definitive guide to securing your digital property under Indian law. From social media access to cold-storage crypto recovery.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" size="lg" className="px-10 h-14 text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-brand-primary/20">
              Draft Your Vault <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="space-y-16">
          <section className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[32px] p-8 md:p-12">
            <h2 className="flex items-center text-3xl font-display font-bold mb-8 text-primary tracking-tight">
              <Scale className="w-8 h-8 mr-4 text-brand-primary" />
              The IT Act & Succession
            </h2>
            <div className="prose prose-invert max-w-none text-secondary">
              <p className="text-lg leading-relaxed mb-6">
                While the <span className="text-primary font-bold">Information Technology Act (2000)</span> governs digital signatures, it explicitly excludes Wills. Therefore, a "Digital Will" must still follow the physical execution requirements of the <span className="text-primary font-bold">Indian Succession Act</span>.
              </p>
              <p className="text-lg leading-relaxed">
                Transfer Legacy acts as the <span className="italic">Execution Layer</span>. While your physical will provides the legal right, our protocol provides the technical keys, ensuring your digital estate doesn't remain locked forever in the cloud.
              </p>
            </div>
          </section>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[32px] p-8">
              <FileCheck className="w-10 h-10 text-brand-gold mb-6" />
              <h3 className="text-xl font-display font-bold mb-4 text-primary">Key Requirements</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-[11px] font-bold text-muted uppercase tracking-wider">
                  <CheckCircle2 size={14} className="text-emerald-400" /> Attestation by Witnesses
                </li>
                <li className="flex items-center gap-2 text-[11px] font-bold text-muted uppercase tracking-wider">
                  <CheckCircle2 size={14} className="text-brand-gold" /> Physical Signature
                </li>
                <li className="flex items-center gap-2 text-[11px] font-bold text-muted uppercase tracking-wider">
                  <CheckCircle2 size={14} className="text-brand-primary" /> Technical Asset Schedule
                </li>
              </ul>
            </div>

            <div className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[32px] p-8 border-brand-primary/20 bg-brand-primary/5">
              <Landmark className="w-10 h-10 text-brand-primary mb-6" />
              <h3 className="text-xl font-display font-bold mb-4 text-primary">VDA Reporting</h3>
              <p className="text-secondary text-sm leading-relaxed mb-6">
                The <span className="text-primary font-bold">Finance Act 2022</span> introduced strict reporting for VDAs. Your digital will should include clear records of cost basis to protect your heirs from incorrect tax assessments by the I-T Department.
              </p>
              <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-widest text-brand-primary p-0">
                Download Reporting Template
              </Button>
            </div>
          </div>

          <section className="bg-obsidian-950/50 border border-brand-gold/20 rounded-[32px] p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <AlertTriangle size={120} className="text-brand-gold" />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl font-display font-bold mb-6 text-primary tracking-tight">Avoid "Silent" Losses</h2>
              <p className="text-lg text-secondary leading-relaxed mb-8">
                In India, over <span className="text-primary font-bold">₹82,000 Crores</span> lies in unclaimed bank accounts. Digital assets are even more vulnerable. Without a verifiable succession protocol, your crypto remains "silent" and unrecoverable for your family.
              </p>
              <div className="flex items-center gap-4 p-4 bg-brand-gold/10 rounded-2xl border border-brand-gold/20">
                <Shield className="text-brand-gold shrink-0" size={24} />
                <p className="text-sm font-medium text-brand-gold leading-tight">
                  Transfer Legacy ensures your heirs are notified instantly, preventing your hard-earned wealth from becoming "lost" digital dust.
                </p>
              </div>
            </div>
          </section>

          <div className="bg-gradient-to-br from-brand-primary to-blue-900 text-obsidian-950 rounded-[40px] p-10 md:p-16 text-center shadow-2xl shadow-brand-primary/20">
            <BookOpen className="w-16 h-16 mx-auto mb-8 opacity-80" />
            <h3 className="text-3xl md:text-5xl font-display font-bold mb-6 tracking-tight leading-none">
              Initialize Your <span className="italic">Digital Will Protocol</span>
            </h3>
            <p className="text-xl opacity-90 mb-12 max-w-2xl mx-auto font-medium">
              Combine the legal weight of an Indian Will with the technical power of Sovereign Vaults.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button onClick={() => window.scrollTo(0,0)} className="bg-obsidian-950 text-white hover:bg-obsidian-900 px-12 h-16 rounded-2xl text-[12px] font-bold uppercase tracking-widest">
                Start Your Vault
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalWillIndia;
