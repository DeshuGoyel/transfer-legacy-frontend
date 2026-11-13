import React from 'react';
import { motion } from 'framer-motion';
import SEO from '../../components/seo/SEO';
import { ArrowRight, Shield, Globe2, CheckCircle2, Lock, Zap } from 'lucide-react';
import Button from '../../components/ui/Button';

const PrivateKeyInheritance = () => {
  
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://transferlegacy.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Resources",
        "item": "https://transferlegacy.com/resources"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Private Key Inheritance",
        "item": "https://transferlegacy.com/private-key-inheritance"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-page text-primary pt-24 pb-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-aurora opacity-30 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 blur-[120px] pointer-events-none" />

      <SEO 
        title="Private Key Inheritance: Secure Digital Asset Succession Protocols"
        description="Learn the technical and legal protocols for private key inheritance. Secure your Ethereum, Solana, and ERC-20 assets for the next generation."
        canonical="https://transferlegacy.com/private-key-inheritance"
        schema={breadcrumbSchema}
      />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 px-4 py-2 rounded-full mb-8 shadow-[0_0_20px_rgba(79,92,255,0.1)]"
          >
            <Lock className="w-4 h-4" />
            <span className="font-bold tracking-[0.2em] uppercase text-[10px]">Technical Protocol Guide</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-8 leading-[0.95] tracking-tight text-primary">
            Private Key <span className="italic text-brand-primary">Inheritance</span>
          </h1>
          
          <p className="text-xl text-secondary mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            In the decentralized world, a private key is the ultimate proof of ownership. If you don't plan for its succession, your assets die with you.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" size="lg" className="px-10 h-14 text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-brand-primary/20">
              Initialize Key Vault <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="space-y-16">
          <section className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[32px] p-8 md:p-12">
            <h2 className="flex items-center text-3xl font-display font-bold mb-8 text-primary tracking-tight">
              <Zap className="w-8 h-8 mr-4 text-brand-primary" />
              The Ownership Dilemma
            </h2>
            <div className="prose prose-invert max-w-none text-secondary">
              <p className="text-lg leading-relaxed mb-6">
                Unlike bank accounts, <span className="text-primary font-bold">Private Keys</span> do not recognize "Legal Heirs." Blockchains only recognize whoever holds the key. This creates a dangerous "Trust Gap" between your legal will and the technical reality of your wallet.
              </p>
              <p className="text-lg leading-relaxed">
                Transfer Legacy bridges this gap by creating a <span className="text-brand-primary font-bold">Sovereign Custody Protocol</span>. We ensure that your private keys are securely delivered to your verified heirs only when specified conditions are met.
              </p>
            </div>
          </section>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[32px] p-8">
              <Shield className="w-10 h-10 text-brand-gold mb-6" />
              <h3 className="text-xl font-display font-bold mb-4 text-primary">Cryptographic Security</h3>
              <p className="text-secondary text-sm leading-relaxed mb-6">
                Our protocol uses <span className="text-primary font-bold">AES-256-GCM encryption</span>. Your private keys are never stored in plain text. They are encrypted using a key derived from your biometrics and guardian quorum.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                <CheckCircle2 size={14} /> Zero-Knowledge Verified
              </div>
            </div>

            <div className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[32px] p-8 border-brand-primary/20 bg-brand-primary/5">
              <Globe2 className="w-10 h-10 text-brand-primary mb-6" />
              <h3 className="text-xl font-display font-bold mb-4 text-primary">Multi-Chain Support</h3>
              <p className="text-secondary text-sm leading-relaxed mb-6">
                Whether you hold <span className="text-primary font-bold">ETH, SOL, or BTC</span>, our protocol handles all private key formats securely. We provide specific recovery instructions for each asset class.
              </p>
              <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-widest text-brand-primary p-0">
                View Supported Assets
              </Button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-brand-primary to-blue-900 text-obsidian-950 rounded-[40px] p-10 md:p-16 text-center shadow-2xl shadow-brand-primary/20">
            <h3 className="text-3xl md:text-5xl font-display font-bold mb-6 tracking-tight leading-none">
              Pass Your <span className="italic">Private Keys</span> Securely
            </h3>
            <p className="text-xl opacity-90 mb-12 max-w-2xl mx-auto font-medium">
              The world's first technical protocol for decentralized private key succession.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button onClick={() => window.scrollTo(0,0)} className="bg-obsidian-950 text-white hover:bg-obsidian-900 px-12 h-16 rounded-2xl text-[12px] font-bold uppercase tracking-widest">
                Initialize Protocol
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivateKeyInheritance;
