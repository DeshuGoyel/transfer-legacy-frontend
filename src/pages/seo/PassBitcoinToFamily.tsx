import React from 'react';
import { motion } from 'framer-motion';
import SEO from '../../components/seo/SEO';
import { ArrowRight, Shield, Scale, CheckCircle2, Coins, LandmarkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

const PassBitcoinToFamily = () => {
  return (
    <div className="min-h-screen bg-page text-primary pt-24 pb-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-aurora opacity-30 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 blur-[120px] pointer-events-none" />

      <SEO 
        title="How to Pass Bitcoin to Family: The Sovereign Succession Guide"
        description="Ensure your Bitcoin is securely passed to your heirs. Learn about cold storage inheritance, multisig setups, and Transfer Legacy's automated vaults."
        canonical="https://transferlegacy.com/how-to-pass-bitcoin-to-family"
      />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 px-4 py-2 rounded-full mb-8 shadow-[0_0_20px_rgba(79,92,255,0.1)]"
          >
            <Coins className="w-4 h-4" />
            <span className="font-bold tracking-[0.2em] uppercase text-[10px]">Bitcoin Succession Guide</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-8 leading-[0.95] tracking-tight text-primary">
            Passing Bitcoin to <br /><span className="italic text-brand-primary">The Next Generation</span>
          </h1>
          
          <p className="text-xl text-secondary mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            Bitcoin is the hardest money ever created, but its hardness makes it notoriously difficult to inherit. Without a plan, your family's financial future stays on the blockchain forever.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" size="lg" className="px-10 h-14 text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-brand-primary/20">
              Protect Your Bitcoin <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="space-y-16">
          <section className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[32px] p-8 md:p-12">
            <h2 className="flex items-center text-3xl font-display font-bold mb-8 text-primary tracking-tight">
              <LandmarkIcon className="w-8 h-8 mr-4 text-brand-primary" />
              The Cold Storage Problem
            </h2>
            <div className="prose prose-invert max-w-none text-secondary">
              <p className="text-lg leading-relaxed mb-6">
                Most Bitcoin maximalists use <span className="text-primary font-bold">Cold Storage</span> (Ledger, Trezor, BitBox). While this is the gold standard for security, it is a nightmare for inheritance. If your family doesn't know where the device is - or the PIN to unlock it - they have zero options.
              </p>
              <p className="text-lg leading-relaxed">
                Traditional executors are not trained in <span className="italic text-brand-primary font-bold">UTXO Management</span> or <span className="italic text-brand-primary font-bold">Hardware Wallet Recovery</span>. You need a technical protocol that guides them through the process safely.
              </p>
            </div>
          </section>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[32px] p-8">
              <Shield className="w-10 h-10 text-brand-gold mb-6" />
              <h3 className="text-xl font-display font-bold mb-4 text-primary">Self-Custodial Release</h3>
              <p className="text-secondary text-sm leading-relaxed mb-6">
                Transfer Legacy doesn't take your Bitcoin. We provide the <span className="text-primary font-bold">Recovery Information</span> and <span className="text-primary font-bold">Encrypted Tutorials</span> your family needs to unlock your cold storage themselves.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                <CheckCircle2 size={14} /> No Counterparty Risk
              </div>
            </div>

            <div className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[32px] p-8 border-brand-primary/20 bg-brand-primary/5">
              <Scale className="w-10 h-10 text-brand-primary mb-6" />
              <h3 className="text-xl font-display font-bold mb-4 text-primary">Inheritance Tax Logic</h3>
              <p className="text-secondary text-sm leading-relaxed mb-6">
                Bitcoin inheritance can trigger complex tax events. Our platform provides localized tax insights (USA, UK, India) to help your heirs navigate the legal landscape without losing half their inheritance to the IRS or HMRC.
              </p>
              <Link to="/features/inheritance-calculator" className="text-[10px] font-bold uppercase tracking-widest text-brand-primary hover:underline">
                Analyze Tax Risk
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-br from-brand-primary to-blue-900 text-obsidian-950 rounded-[40px] p-10 md:p-16 text-center shadow-2xl shadow-brand-primary/20">
            <h3 className="text-3xl md:text-5xl font-display font-bold mb-6 tracking-tight leading-none">
              Ensure Your Bitcoin <br /><span className="italic">Lives On</span>
            </h3>
            <p className="text-xl opacity-90 mb-12 max-w-2xl mx-auto font-medium">
              Initialize your Bitcoin Succession Protocol and protect your family's hard money.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button onClick={() => window.scrollTo(0,0)} className="bg-obsidian-950 text-white hover:bg-obsidian-900 px-12 h-16 rounded-2xl text-[12px] font-bold uppercase tracking-widest">
                Start Bitcoin Vault
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassBitcoinToFamily;
