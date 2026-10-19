import React from 'react';
import { motion } from 'framer-motion';
import { Shield, EyeOff, Zap, CheckCircle2 } from 'lucide-react';
import Card from '../../components/ui/Card';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
});

export default function ZeroKnowledge() {
  return (
    <div className="min-h-screen bg-page text-primary pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center space-y-6 mb-24">
          <motion.div {...fadeUp(0)} className="flex items-center justify-center gap-2 mb-4">
            <EyeOff size={16} className="text-brand-primary" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
              The Gold Standard of Privacy
            </p>
          </motion.div>
          <motion.h1 {...fadeUp(0.1)} className="text-5xl md:text-5xl font-display font-bold tracking-tight">
            Zero <span className="italic text-brand-primary">Knowledge</span>
          </motion.h1>
          <motion.p {...fadeUp(0.2)} className="text-muted text-xl max-w-3xl mx-auto font-medium">
            We prove you own your legacy without ever knowing what your legacy is. True privacy, hard-coded into the protocol.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
           <motion.div {...fadeUp(0.3)}>
              <Card className="p-12 bg-surface/30 border-base/40 rounded-[64px] relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-full bg-aurora opacity-10 pointer-events-none" />
                 <Shield size={120} className="text-brand-primary/10 mb-8" />
                 <h3 className="text-3xl font-display font-bold mb-6">Mathematical Privacy</h3>
                 <p className="text-primary0 font-medium leading-relaxed mb-8">
                    Our ZK-Proofs allow for the verification of vault transitions without revealing decryption keys or asset metadata to the Transfer Legacy network.
                 </p>
                 <div className="space-y-4">
                    {["On-device key generation", "Encrypted metadata blobs", "Stateless verification nodes"].map((point, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-primary">
                         <CheckCircle2 size={16} className="text-brand-primary" /> {point}
                      </div>
                    ))}
                 </div>
              </Card>
           </motion.div>
           <motion.div {...fadeUp(0.4)} className="space-y-8">
              <h2 className="text-4xl font-display font-bold">Privacy as a <span className="text-brand-primary italic">Right</span></h2>
              <p className="text-muted font-medium leading-relaxed">In an era of surveillance, we provide a sanctuary for your digital life. Your data remains yours - unseen, untouched, and uncompromised.</p>
              <div className="p-8 rounded-3xl bg-surface/20 border border-base">
                 <div className="flex items-center gap-4 mb-4">
                    <Zap size={20} className="text-brand-gold" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">Real-time Encryption</span>
                 </div>
                 <p className="text-sm font-medium text-primary0 italic">"The protocol is designed so that even if our entire infrastructure were compromised, your vault would remain a silent, unreadable void to any attacker."</p>
              </div>
           </motion.div>
        </div>
      </div>
    </div>
  );
}
