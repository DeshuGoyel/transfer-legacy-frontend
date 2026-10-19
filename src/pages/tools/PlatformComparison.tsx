import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Shield, Zap, Globe, ArrowRight } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
});

export default function PlatformComparison() {
  const features = [
    { name: "Zero-Knowledge Architecture", tl: true, bank: false, legacy: false },
    { name: "Shamir's Secret Sharing", tl: true, bank: false, legacy: true },
    { name: "Global Asset Support (Crypto/Flat/Physical)", tl: true, bank: true, legacy: false },
    { name: "Decentralized Guardian Quorum", tl: true, bank: false, legacy: false },
    { name: "Automated Proof-of-Life Triggers", tl: true, bank: false, legacy: true },
    { name: "Institutional Compliance PDF Generation", tl: true, bank: true, legacy: false }
  ];

  return (
    <div className="min-h-screen bg-page text-primary pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center space-y-6 mb-24">
          <motion.div {...fadeUp(0)} className="flex items-center justify-center gap-2 mb-4">
            <Zap size={16} className="text-brand-gold" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold">
              Competitive Intelligence
            </p>
          </motion.div>
          <motion.h1 {...fadeUp(0.1)} className="text-5xl md:text-5xl font-display font-bold tracking-tight">
            Platform <span className="italic text-brand-primary">Comparison</span>
          </motion.h1>
          <motion.p {...fadeUp(0.2)} className="text-muted text-xl max-w-3xl mx-auto font-medium">
            See why institutional investors and high-net-worth individuals choose Transfer Legacy over traditional and legacy digital inheritance solutions.
          </motion.p>
        </div>

        <motion.div {...fadeUp(0.3)} className="overflow-x-auto pb-8">
           <div className="min-w-[800px]">
              <Card className="p-0 overflow-hidden bg-surface/30 border-base/40 rounded-[40px]">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-page/50 border-b border-base">
                          <th className="p-8 text-sm font-bold uppercase tracking-widest text-muted">Protocol Feature</th>
                          <th className="p-8 text-center bg-brand-primary/10 border-x border-brand-primary/20">
                             <div className="text-lg font-display font-bold text-brand-primary">Transfer Legacy</div>
                             <div className="text-[9px] font-bold uppercase tracking-widest text-brand-primary/60">Institutional Grade</div>
                          </th>
                          <th className="p-8 text-center text-muted">
                             <div className="text-sm font-bold uppercase tracking-widest">Traditional Banks</div>
                          </th>
                          <th className="p-8 text-center text-muted">
                             <div className="text-sm font-bold uppercase tracking-widest">Legacy Digital Vaults</div>
                          </th>
                       </tr>
                    </thead>
                    <tbody>
                       {features.map((feature, i) => (
                         <tr key={i} className="border-b border-base/40 hover:bg-surface/50 transition-colors">
                            <td className="p-8 text-secondary font-medium">{feature.name}</td>
                            <td className="p-8 text-center bg-brand-primary/5 border-x border-brand-primary/20">
                               {feature.tl ? <Check className="mx-auto text-trust-500" /> : <X className="mx-auto text-muted" />}
                            </td>
                            <td className="p-8 text-center">
                               {feature.bank ? <Check className="mx-auto text-secondary" /> : <X className="mx-auto text-muted" />}
                            </td>
                            <td className="p-8 text-center">
                               {feature.legacy ? <Check className="mx-auto text-secondary" /> : <X className="mx-auto text-muted" />}
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </Card>
           </div>
        </motion.div>

        <div className="mt-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
           <motion.div {...fadeUp(0.5)} className="space-y-8">
              <h2 className="text-4xl font-display font-bold">The Transfer Legacy <span className="text-brand-primary italic">Advantage</span></h2>
              <p className="text-muted font-medium leading-relaxed">We didn't just build a better vault - we built a new cryptographic standard for generational wealth. Our protocol is the only solution that combines institutional compliance with absolute self-sovereignty.</p>
              <Button variant="primary" className="h-14 px-12 text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-brand-primary/20">
                 Switch to Protocol <ArrowRight size={16} className="ml-2" />
              </Button>
           </motion.div>
           <div className="grid grid-cols-2 gap-8">
              {[
                { label: "Security Score", value: "99.9%", icon: <Shield size={20}/> },
                { label: "Global Uptime", value: "99.99%", icon: <Globe size={20}/> }
              ].map((stat, i) => (
                <Card key={i} className="p-8 text-center bg-surface/30 border-base/40">
                   <div className="w-10 h-10 rounded-xl bg-page border border-base flex items-center justify-center mx-auto mb-4 text-brand-primary">
                      {stat.icon}
                   </div>
                   <p className="text-3xl font-display font-bold text-primary mb-1">{stat.value}</p>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-muted">{stat.label}</p>
                </Card>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
