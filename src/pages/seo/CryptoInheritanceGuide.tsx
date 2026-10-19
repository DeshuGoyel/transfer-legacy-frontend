import React from 'react';
import { motion } from 'framer-motion';
import SEO from '../../components/seo/SEO';
import { ArrowRight, Shield, BookOpen, AlertTriangle, Scale, Lock, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

const CryptoInheritanceGuide = () => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What happens to my crypto when I die?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Without a proactive succession plan, your cryptocurrency remains locked in your wallet forever. Traditional banks and executors cannot access decentralized wallets without the private keys or a verifiable succession protocol."
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-page text-primary pt-24 pb-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-aurora opacity-30 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 blur-[120px] pointer-events-none" />

      <SEO 
        title="The Ultimate Crypto Inheritance Guide (2024): Secure Your Digital Wealth"
        description="Master the art of crypto inheritance. Learn how to securely pass Bitcoin, Ethereum, and digital assets to your family using institutional-grade protocols."
        canonical="https://transferlegacy.com/crypto-inheritance"
        schema={faqSchema}
      />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 px-4 py-2 rounded-full mb-8 shadow-[0_0_20px_rgba(79,92,255,0.1)]"
          >
            <BookOpen className="w-4 h-4" />
            <span className="font-bold tracking-[0.2em] uppercase text-[10px]">Sovereign Pillar Guide</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-8 leading-[0.95] tracking-tight text-primary">
            The Ultimate <span className="italic text-brand-primary">Crypto Inheritance</span> Guide
          </h1>
          
          <p className="text-xl text-secondary mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            Paper documents are powerless against encrypted blockchains. Learn why $140 Billion in Bitcoin is already lost forever - and how to protect your family from the same fate.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" size="lg" className="px-10 h-14 text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-brand-primary/20">
              Initialize Your Vault <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="space-y-16">
          <section className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[32px] p-8 md:p-12">
            <h2 className="flex items-center text-3xl font-display font-bold mb-8 text-primary tracking-tight">
              <Zap className="w-8 h-8 mr-4 text-brand-primary" />
              The "Hidden" Risk
            </h2>
            <div className="prose prose-invert max-w-none text-secondary">
              <p className="text-lg leading-relaxed mb-6">
                Most investors focus on market volatility, but the <span className="text-primary font-bold">Succession Risk</span> is far more dangerous. If you hold crypto in a non-custodial wallet (Ledger, Trezor, MetaMask), you are the <span className="italic">only</span> person in the world who can access those funds.
              </p>
              <p className="text-lg leading-relaxed">
                If something happens to you tomorrow, your family doesn't just lose you - they lose the entire financial heritage you've built. Traditional wills are public records; including seed phrases in a paper will is a catastrophic security failure.
              </p>
            </div>
          </section>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[32px] p-8">
              <Lock className="w-10 h-10 text-brand-gold mb-6" />
              <h3 className="text-xl font-display font-bold mb-4 text-primary">Zero-Knowledge Security</h3>
              <p className="text-secondary text-sm leading-relaxed mb-6">
                Transfer Legacy uses <span className="text-primary font-bold">End-to-End Encryption</span>. We never see your keys. Your assets are only released via our Dead Man's Switch protocol, triggered by an automated proof-of-life cycle.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                <Shield size={14} /> AES-256 Protected
              </div>
            </div>

            <div className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[32px] p-8 border-brand-primary/20 bg-brand-primary/5">
              <Scale className="w-10 h-10 text-brand-primary mb-6" />
              <h3 className="text-xl font-display font-bold mb-4 text-primary">Legal Parity</h3>
              <p className="text-secondary text-sm leading-relaxed mb-6">
                Our protocol is built to integrate with global legal frameworks like <span className="text-primary font-bold">RUFADAA (USA)</span> and the <span className="text-primary font-bold">Hindu Succession Act (India)</span>, ensuring your technical setup is legally bulletproof.
              </p>
              <Link to="/legal/compliance" className="text-[10px] font-bold uppercase tracking-widest text-brand-primary hover:underline">
                View Compliance Audit
              </Link>
            </div>
          </div>

          <section className="bg-obsidian-950/50 border border-brand-gold/20 rounded-[32px] p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <AlertTriangle size={120} className="text-brand-gold" />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl font-display font-bold mb-6 text-primary tracking-tight">The Three-Pillar Strategy</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold shrink-0">1</div>
                  <div>
                    <h4 className="text-primary font-bold mb-1">Mapping Your Digital Estate</h4>
                    <p className="text-sm text-secondary">Document every exchange, wallet, and cold-storage device in your Sovereign Vault.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold shrink-0">2</div>
                  <div>
                    <h4 className="text-primary font-bold mb-1">Establishing Guardians</h4>
                    <p className="text-sm text-secondary">Appoint trusted individuals to verify your status without ever seeing your private data.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold shrink-0">3</div>
                  <div>
                    <h4 className="text-primary font-bold mb-1">Automated Recovery</h4>
                    <p className="text-sm text-secondary">Define exact triggers for asset release, ensuring zero-friction succession for your heirs.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="bg-gradient-to-br from-brand-primary to-blue-900 text-obsidian-950 rounded-[40px] p-10 md:p-16 text-center shadow-2xl shadow-brand-primary/20">
            <h3 className="text-3xl md:text-5xl font-display font-bold mb-6 tracking-tight leading-none">
              Don't Leave Your Wealth <br /><span className="italic">to the Void</span>
            </h3>
            <p className="text-xl opacity-90 mb-12 max-w-2xl mx-auto font-medium">
              Initialize your Sovereign Vault today and ensure your digital legacy is passed down, not lost.
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

export default CryptoInheritanceGuide;
