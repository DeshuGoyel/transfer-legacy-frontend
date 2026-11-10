import React from 'react';
import { motion } from 'framer-motion';
import SEO from '../../../components/seo/SEO';
import { ArrowRight, Globe2, BookOpen, Landmark, Scale, Gavel, CheckCircle2 } from 'lucide-react';
import Button from '../../../components/ui/Button';

const CryptoInheritanceUK = () => {
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
        "name": "How is crypto inheritance taxed in the UK?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "In the UK, cryptocurrency is subject to Inheritance Tax (IHT) if the total estate value exceeds the £325,000 threshold. The tax rate is generally 40% on the value above the threshold."
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-page text-primary pt-24 pb-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-aurora opacity-30 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 blur-[120px] pointer-events-none" />

      <SEO 
        title="UK Crypto Inheritance Law: HMRC & IHT Guide (2026)"
        description="Navigate UK inheritance laws for digital assets. Learn about HMRC's treatment of crypto, Inheritance Tax (IHT) rates, and how to pass Bitcoin securely in the UK."
        canonical="https://transferlegacy.com/crypto-inheritance-uk"
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
            <span className="font-bold tracking-[0.2em] uppercase text-[10px]">UK Jurisdiction Guide</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-8 leading-[0.95] tracking-tight text-primary">
            HMRC Compliance <span className="italic text-brand-primary">& UK Estate Law</span>
          </h1>
          
          <p className="text-xl text-secondary mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            Securing digital assets within the UK legal framework. Expert guidance on IHT, nil-rate bands, and HMRC reporting for crypto heirs.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" size="lg" className="px-10 h-14 text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-brand-primary/20">
              Initialize UK Vault <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="space-y-16">
          <section className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[32px] p-8 md:p-12">
            <h2 className="flex items-center text-3xl font-display font-bold mb-8 text-primary tracking-tight">
              <Scale className="w-8 h-8 mr-4 text-brand-primary" />
              Inheritance Tax (IHT)
            </h2>
            <div className="prose prose-invert max-w-none text-secondary">
              <p className="text-lg leading-relaxed mb-6">
                HMRC treats cryptocurrency as personal property for <span className="text-primary font-bold">Inheritance Tax (IHT)</span> purposes. If your total estate exceeds <span className="text-primary font-bold">£325,000</span>, your digital assets could be taxed at 40%.
              </p>
              <p className="text-lg leading-relaxed">
                Properly documenting your holdings within a <span className="text-brand-primary font-bold">Sovereign Vault</span> ensures your executors can accurately report values to HMRC, avoiding heavy penalties and long delays in the probate process.
              </p>
            </div>
          </section>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[32px] p-8">
              <Landmark className="w-10 h-10 text-brand-gold mb-6" />
              <h3 className="text-xl font-display font-bold mb-4 text-primary">Capital Gains Tax</h3>
              <p className="text-secondary text-sm leading-relaxed mb-6">
                When heirs sell inherited crypto, they must account for <span className="text-primary font-bold">Capital Gains Tax (CGT)</span>. The value at the date of death becomes the new "cost base" for the heir, making verification timing critical.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-[11px] font-bold text-muted uppercase tracking-wider">
                  <CheckCircle2 size={14} className="text-emerald-400" /> Date of Death Valuation
                </li>
                <li className="flex items-center gap-2 text-[11px] font-bold text-muted uppercase tracking-wider">
                  <CheckCircle2 size={14} className="text-brand-gold" /> CGT Reporting Ready
                </li>
              </ul>
            </div>

            <div className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[32px] p-8 border-brand-primary/20 bg-brand-primary/5">
              <Gavel className="w-10 h-10 text-brand-primary mb-6" />
              <h3 className="text-xl font-display font-bold mb-4 text-primary">English Law Parity</h3>
              <p className="text-secondary text-sm leading-relaxed mb-6">
                Following the <span className="text-primary font-bold">UK Jurisdiction Taskforce's</span> Legal Statement, crypto is legally recognized as property in England and Wales. Transfer Legacy is built to integrate with English probate requirements.
              </p>
              <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-widest text-brand-primary p-0">
                UK Probate Checklist
              </Button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-brand-primary to-blue-900 text-obsidian-950 rounded-[40px] p-10 md:p-16 text-center shadow-2xl shadow-brand-primary/20">
            <BookOpen className="w-16 h-16 mx-auto mb-8 opacity-80" />
            <h3 className="text-3xl md:text-5xl font-display font-bold mb-6 tracking-tight leading-none">
              Initialize Your <span className="italic">UK Sovereign Vault</span>
            </h3>
            <p className="text-xl opacity-90 mb-12 max-w-2xl mx-auto font-medium">
              Join thousands of UK investors ensuring their digital wealth is passed down securely and legally.
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

export default CryptoInheritanceUK;
