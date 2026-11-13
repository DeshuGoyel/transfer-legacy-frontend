import React from 'react';
import { motion } from 'framer-motion';
import SEO from '../../../components/seo/SEO';
import { ArrowRight, Shield, Globe2, BookOpen, AlertTriangle, Landmark, Scale, Gavel, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const CryptoInheritanceUSA = () => {
  const cryptoInheritanceHreflangs = [
    { lang: 'en-IN', href: 'https://transferlegacy.com/crypto-inheritance-india' },
    { lang: 'en-US', href: 'https://transferlegacy.com/crypto-inheritance-usa' },
    { lang: 'en-GB', href: 'https://transferlegacy.com/crypto-inheritance-uk' },
    { lang: 'en-AE', href: 'https://transferlegacy.com/crypto-inheritance-uae' },
    { lang: 'x-default', href: 'https://transferlegacy.com/crypto-inheritance' },
  ];
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is crypto inheritance legal in the USA?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, digital assets are recognized as property in the US. They can be passed via a traditional will or trust, and many states have adopted RUFADAA to govern digital asset access."
        }
      },
      {
        "@type": "Question",
        "name": "What is RUFADAA?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The Revised Uniform Fiduciary Access to Digital Assets Act (RUFADAA) provides a legal framework for executors to access digital accounts while maintaining user privacy."
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-page text-primary pt-24 pb-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-aurora opacity-30 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 blur-[120px] pointer-events-none" />

      <SEO 
        title="US Crypto Inheritance Law: RUFADAA & Federal Guide (2026)"
        description="Master US crypto inheritance laws. Learn about RUFADAA, federal estate tax implications, and how to securely pass Bitcoin to heirs using Transfer Legacy."
        canonical="https://transferlegacy.com/crypto-inheritance-usa"
        schema={faqSchema}
        hreflangs={cryptoInheritanceHreflangs}
      />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 px-4 py-2 rounded-full mb-8 shadow-[0_0_20px_rgba(79,92,255,0.1)]"
          >
            <Globe2 className="w-4 h-4" />
            <span className="font-bold tracking-[0.2em] uppercase text-[10px]">USA Jurisdiction Guide</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-8 leading-[0.95] tracking-tight text-primary">
            Digital Estate <span className="italic text-brand-primary">Planning in the US</span>
          </h1>
          
          <p className="text-xl text-secondary mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            Navigating RUFADAA and IRS regulations. Secure your digital legacy under federal and state frameworks with Transfer Legacy.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" size="lg" className="px-10 h-14 text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-brand-primary/20">
              Initialize US Vault <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Link to="/legal/compliance" className="text-[11px] font-bold uppercase tracking-widest text-muted hover:text-primary transition-colors">
              View Compliance Audit
            </Link>
          </div>
        </div>

        <div className="space-y-16">
          <section className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[32px] p-8 md:p-12">
            <h2 className="flex items-center text-3xl font-display font-bold mb-8 text-primary tracking-tight">
              <Scale className="w-8 h-8 mr-4 text-brand-primary" />
              RUFADAA Compliance
            </h2>
            <div className="prose prose-invert max-w-none text-secondary">
              <p className="text-lg leading-relaxed mb-6">
                Most US states have adopted the <span className="text-primary font-bold">Revised Uniform Fiduciary Access to Digital Assets Act (RUFADAA)</span>. This law gives users the power to decide who can access their digital accounts after death.
              </p>
              <p className="text-lg leading-relaxed">
                Crucially, RUFADAA prioritizes a user's instructions given via an "online tool" (like <span className="text-brand-primary font-bold">Transfer Legacy</span>) over instructions in a traditional will. This makes our protocol the primary legal record for your digital asset distribution.
              </p>
            </div>
          </section>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[32px] p-8">
              <Landmark className="w-10 h-10 text-brand-gold mb-6" />
              <h3 className="text-xl font-display font-bold mb-4 text-primary">IRS Considerations</h3>
              <p className="text-secondary text-sm leading-relaxed mb-6">
                The IRS treats crypto as property. While federal estate tax exemption is high ($13.61M in 2026), "Cost Basis Step-up" at death is a critical benefit for US heirs that requires verifiable records.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-[11px] font-bold text-muted uppercase tracking-wider">
                  <CheckCircle2 size={14} className="text-emerald-400" /> Basis Step-Up Eligible
                </li>
                <li className="flex items-center gap-2 text-[11px] font-bold text-muted uppercase tracking-wider">
                  <CheckCircle2 size={14} className="text-brand-gold" /> Form 8949 Compliance
                </li>
              </ul>
            </div>

            <div className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[32px] p-8 border-brand-primary/20 bg-brand-primary/5">
              <Gavel className="w-10 h-10 text-brand-primary mb-6" />
              <h3 className="text-xl font-display font-bold mb-4 text-primary">State Law Parity</h3>
              <p className="text-secondary text-sm leading-relaxed mb-6">
                Whether you are in <span className="text-primary font-bold">California, New York, or Florida</span>, our protocol adapts to local digital asset mandates. We ensure your executors have "Full Disclosure" power when needed.
              </p>
              <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-widest text-brand-primary p-0">
                Download State Checklists
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
                Traditional US estate planning often fails because exchange <span className="italic text-primary font-bold">Terms of Service (ToS)</span> strictly forbid sharing passwords. RUFADAA overrides this, but only if you've used a compliant tool like Transfer Legacy to authorize access.
              </p>
              <div className="flex items-center gap-4 p-4 bg-brand-gold/10 rounded-2xl border border-brand-gold/20">
                <Shield className="text-brand-gold shrink-0" size={24} />
                <p className="text-sm font-medium text-brand-gold leading-tight">
                  Transfer Legacy provides the "express consent" required under federal law to allow fiduciary access to encrypted vaults.
                </p>
              </div>
            </div>
          </section>

          <div className="bg-gradient-to-br from-brand-primary to-blue-900 text-obsidian-950 rounded-[40px] p-10 md:p-16 text-center shadow-2xl shadow-brand-primary/20">
            <BookOpen className="w-16 h-16 mx-auto mb-8 opacity-80" />
            <h3 className="text-3xl md:text-5xl font-display font-bold mb-6 tracking-tight leading-none">
              Initialize Your <span className="italic">US Sovereign Vault</span>
            </h3>
            <p className="text-xl opacity-90 mb-12 max-w-2xl mx-auto font-medium">
              The only RUFADAA-compliant protocol for cross-border and US-domestic digital succession.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button onClick={() => window.scrollTo(0,0)} className="bg-obsidian-950 text-white hover:bg-obsidian-900 px-12 h-16 rounded-2xl text-[12px] font-bold uppercase tracking-widest">
                Start Proactive Planning
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoInheritanceUSA;
