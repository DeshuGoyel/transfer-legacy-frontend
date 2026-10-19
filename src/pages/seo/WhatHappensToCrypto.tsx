import { motion } from 'framer-motion';
import SEO from '../../components/seo/SEO';
import { ArrowRight, Shield, BookOpen, AlertTriangle, Skull, Zap } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';

const WhatHappensToCrypto = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useStore();
  return (
    <div className="min-h-screen bg-page text-primary pt-24 pb-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-aurora opacity-30 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 blur-[120px] pointer-events-none" />

      <SEO 
        title="What Happens to Your Crypto When You Die? (The Brutal Truth)"
        description="The reality of cryptocurrency inheritance. Learn why Bitcoin is lost forever without a protocol and how to prevent your family from being locked out."
        canonicalUrl="https://transferlegacy.com/what-happens-to-crypto-when-you-die"
      />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 px-4 py-2 rounded-full mb-8 shadow-[0_0_20px_rgba(79,92,255,0.1)]"
          >
            <Skull className="w-4 h-4" />
            <span className="font-bold tracking-[0.2em] uppercase text-[10px]">Technical Reality Check</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-8 leading-[0.95] tracking-tight text-primary">
            What Happens to Crypto <br /><span className="italic text-brand-primary">After Death?</span>
          </h1>
          
          <p className="text-xl text-secondary mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            The blockchain is indifferent to your passing. Without your keys, your wealth becomes "unspendable" forever. It doesn't go to the state; it goes to the void.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" size="lg" className="px-10 h-14 text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-brand-primary/20">
              Prevent Asset Loss <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="space-y-16">
          <section className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[32px] p-8 md:p-12">
            <h2 className="flex items-center text-3xl font-display font-bold mb-8 text-primary tracking-tight">
              <Zap className="w-8 h-8 mr-4 text-brand-primary" />
              The "Burn" Scenario
            </h2>
            <div className="prose prose-invert max-w-none text-secondary">
              <p className="text-lg leading-relaxed mb-6">
                In technical terms, crypto without keys is <span className="text-primary font-bold">Burned</span>. It remains visible on the blockchain, but no one - not even the best hackers or government agencies - can move it. This is the brutal reality of decentralization.
              </p>
              <p className="text-lg leading-relaxed">
                If you have $100,000 in Bitcoin and you die without a protocol, you have effectively made a <span className="italic text-brand-primary font-bold">Donation to the Network</span>, increasing the value of everyone else's Bitcoin while leaving your family with nothing.
              </p>
            </div>
          </section>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[32px] p-8">
              <Shield className="w-10 h-10 text-brand-gold mb-6" />
              <h3 className="text-xl font-display font-bold mb-4 text-primary">Exchange Custody</h3>
              <p className="text-secondary text-sm leading-relaxed mb-6">
                Exchanges (Coinbase, Binance) can release funds to heirs, but the process is a <span className="text-primary font-bold">Bureaucratic Nightmare</span>. It can take 6-18 months of legal paperwork, often costing thousands in legal fees.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                <AlertTriangle size={14} /> High Friction
              </div>
            </div>

            <div className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[32px] p-8 border-brand-primary/20 bg-brand-primary/5">
              <BookOpen className="w-10 h-10 text-brand-primary mb-6" />
              <h3 className="text-xl font-display font-bold mb-4 text-primary">Protocol Succession</h3>
              <p className="text-secondary text-sm leading-relaxed mb-6">
                Transfer Legacy's <span className="text-primary font-bold">Dead Man's Switch</span> reduces the succession time from 18 months to 30 days. We provide the technical handover that bypasses bureaucratic delays while remaining legally compliant.
              </p>
              <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-widest text-brand-primary p-0">
                View Protocol Timeline
              </Button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-brand-primary to-blue-900 text-obsidian-950 rounded-[40px] p-10 md:p-16 text-center shadow-2xl shadow-brand-primary/20">
            <h3 className="text-3xl md:text-5xl font-display font-bold mb-6 tracking-tight leading-none">
              Don't Let Your Crypto <br /><span className="italic">Die With You</span>
            </h3>
            <p className="text-xl opacity-90 mb-12 max-w-2xl mx-auto font-medium">
              Initialize your Sovereign Vault and secure your family's digital future.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button 
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/onboarding')} 
                className="bg-obsidian-950 text-white hover:bg-obsidian-900 px-12 h-16 rounded-2xl text-[12px] font-bold uppercase tracking-widest"
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Start My Vault'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatHappensToCrypto;
