import React from 'react';
import { motion } from 'framer-motion';
import SEO from '../../components/seo/SEO';
import { ArrowRight, Shield, BookOpen, CheckCircle2, Wallet, RefreshCw } from 'lucide-react';
import Button from '../../components/ui/Button';

const TransferCryptoWallet = () => {
  
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
        "name": "Transfer Crypto Wallets",
        "item": "https://transferlegacy.com/transfer-crypto-wallet-to-family"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-page text-primary pt-24 pb-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-aurora opacity-30 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 blur-[120px] pointer-events-none" />

      <SEO 
        title="How to Transfer Crypto Wallets After Death: Step-by-Step Guide"
        description="A comprehensive guide on transferring Bitcoin, Ethereum, and DeFi wallets to your heirs. Learn the secure protocol for digital asset handovers."
        canonical="https://transferlegacy.com/transfer-crypto-wallet-to-family"
        schema={breadcrumbSchema}
      />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 px-4 py-2 rounded-full mb-8 shadow-[0_0_20px_rgba(79,92,255,0.1)]"
          >
            <Wallet className="w-4 h-4" />
            <span className="font-bold tracking-[0.2em] uppercase text-[10px]">Technical Handoff Guide</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-8 leading-[0.95] tracking-tight text-primary">
            Transferring Your <span className="italic text-brand-primary">Crypto Wallets</span>
          </h1>
          
          <p className="text-xl text-secondary mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            A digital wallet handoff isn't a one-time event; it's a security-critical operation. Learn how to transfer control without compromising the assets.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" size="lg" className="px-10 h-14 text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-brand-primary/20">
              Set Up Handoff Protocol <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="space-y-16">
          <section className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[32px] p-8 md:p-12">
            <h2 className="flex items-center text-3xl font-display font-bold mb-8 text-primary tracking-tight">
              <RefreshCw className="w-8 h-8 mr-4 text-brand-primary" />
              The "No-Touch" Transfer
            </h2>
            <div className="prose prose-invert max-w-none text-secondary">
              <p className="text-lg leading-relaxed mb-6">
                Most people think "Transferring" means giving someone your password. In the institutional world, this is a <span className="text-primary font-bold">Catastrophic Security Leak</span>. You should never "share" a wallet; you should "hand over" the keys in a controlled, encrypted environment.
              </p>
              <p className="text-lg leading-relaxed">
                Transfer Legacy allows you to define a <span className="italic text-brand-primary font-bold">Technical Trigger</span>. When our protocol verifies you are no longer active, it securely releases the necessary tutorials and credentials to your heirs.
              </p>
            </div>
          </section>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[32px] p-8">
              <Shield className="w-10 h-10 text-brand-gold mb-6" />
              <h3 className="text-xl font-display font-bold mb-4 text-primary">DeFi Asset Mapping</h3>
              <p className="text-secondary text-sm leading-relaxed mb-6">
                Inheritance becomes 10x harder if you have funds in <span className="text-primary font-bold">Staking Pools, Liquidity Pools, or NFT Marketplaces</span>. We provide a mapping tool to ensure your family knows exactly which protocols to interact with.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                <CheckCircle2 size={14} /> Full DeFi Visibility
              </div>
            </div>

            <div className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[32px] p-8 border-brand-primary/20 bg-brand-primary/5">
              <BookOpen className="w-10 h-10 text-brand-primary mb-6" />
              <h3 className="text-xl font-display font-bold mb-4 text-primary">Step-by-Step Tutorials</h3>
              <p className="text-secondary text-sm leading-relaxed mb-6">
                We generate <span className="text-primary font-bold">Custom Recovery Manuals</span> for your heirs. These manuals walk them through exactly how to restore your specific wallet (Ledger, MetaMask, etc.) using the keys we release.
              </p>
              <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-widest text-brand-primary p-0">
                View Sample Recovery Manual
              </Button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-brand-primary to-blue-900 text-obsidian-950 rounded-[40px] p-10 md:p-16 text-center shadow-2xl shadow-brand-primary/20">
            <h3 className="text-3xl md:text-5xl font-display font-bold mb-6 tracking-tight leading-none">
              Secure Your Wallet <br /><span className="italic">Handoff Today</span>
            </h3>
            <p className="text-xl opacity-90 mb-12 max-w-2xl mx-auto font-medium">
              Don't leave your family guessing. Automate the transfer of your digital wealth.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button onClick={() => window.scrollTo(0,0)} className="bg-obsidian-950 text-white hover:bg-obsidian-900 px-12 h-16 rounded-2xl text-[12px] font-bold uppercase tracking-widest">
                Start Handoff Setup
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferCryptoWallet;
