import SEO from '../../components/seo/SEO';
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, Key, Heart } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
});

export default function GuardianNetwork() {
  return (
    <div className="min-h-screen bg-page text-primary pt-24 pb-20">
      <SEO 
        title="Decentralized Guardian Network | Transfer Legacy"
        description="Eliminate single points of failure. Distribute cryptographic shards among trusted guardians with customizable quorum recovery."
        canonicalUrl="https://transferlegacy.com/features/guardian-network"
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center space-y-6 mb-24">
          <motion.div {...fadeUp(0)} className="flex items-center justify-center gap-2 mb-4">
            <Users size={16} className="text-brand-primary" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
              The Human Layer of Security
            </p>
          </motion.div>
          <motion.h1 {...fadeUp(0.1)} className="text-5xl md:text-5xl font-display font-bold tracking-tight">
            Guardian <span className="italic text-brand-primary">Network</span>
          </motion.h1>
          <motion.p {...fadeUp(0.2)} className="text-muted text-xl max-w-3xl mx-auto font-medium">
            Distribute trust across your inner circle. Your legacy is protected by the people you trust most.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
           <motion.div {...fadeUp(0.3)} className="space-y-8">
              <h2 className="text-4xl font-display font-bold">Decentralized <span className="text-brand-primary italic">Trust</span></h2>
              <p className="text-muted font-medium leading-relaxed">The Guardian Network replaces the single point of failure (you) with a resilient collective of trusted individuals.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {[
                   { label: "Quorum Verification", icon: <Shield size={18}/> },
                   { label: "Decentralized ID", icon: <Key size={18}/> },
                   { label: "Proof of Life", icon: <Heart size={18}/> },
                   { label: "Seamless Onboarding", icon: <Users size={18}/> }
                 ].map((item, i) => (
                   <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-surface border border-base font-bold text-sm">
                      <div className="text-brand-primary">{item.icon}</div>
                      {item.label}
                   </div>
                 ))}
              </div>
           </motion.div>
           <motion.div {...fadeUp(0.4)}>
              <Card className="p-0 overflow-hidden rounded-[48px] bg-surface/40 border-base/40">
                 <div className="p-12 space-y-8">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-full bg-brand-primary/20 flex items-center justify-center border border-brand-primary/30">
                          <Users size={24} className="text-brand-primary" />
                       </div>
                       <h3 className="text-2xl font-display font-bold">Institutional Onboarding</h3>
                    </div>
                    <p className="text-primary0 font-medium">Invite your legal counsel, family members, or institutional trustees to protect your vault shards.</p>
                    <div className="space-y-3">
                       <div className="flex items-center justify-between p-4 rounded-xl bg-page border border-base">
                          <span className="text-sm font-bold">Active Guardians</span>
                          <span className="text-sm font-mono text-brand-primary">4 / 5</span>
                       </div>
                       <div className="flex items-center justify-between p-4 rounded-xl bg-page border border-base">
                          <span className="text-sm font-bold">Verification Quorum</span>
                          <span className="text-sm font-mono text-brand-primary">66%</span>
                       </div>
                    </div>
                    <Button variant="primary" className="w-full h-14 text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-brand-primary/20">
                       Expand My Network
                    </Button>
                 </div>
              </Card>
           </motion.div>
        </div>
      </div>
    </div>
  );
}
