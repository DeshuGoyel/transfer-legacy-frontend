import React from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
});

export default function InheritanceLogic() {
  return (
    <div className="min-h-screen bg-page text-primary pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center space-y-6 mb-24">
          <motion.div {...fadeUp(0)} className="flex items-center justify-center gap-2 mb-4">
            <GitBranch size={16} className="text-brand-primary" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
              Programmable Succession Engine
            </p>
          </motion.div>
          <motion.h1 {...fadeUp(0.1)} className="text-5xl md:text-5xl font-display font-bold tracking-tight">
            Inheritance <span className="italic text-brand-primary">Logic</span>
          </motion.h1>
          <motion.p {...fadeUp(0.2)} className="text-muted text-xl max-w-3xl mx-auto font-medium">
            Define complex, conditional rules for your digital estate using our proprietary "If-Then-Legacy" execution framework.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
           <motion.div {...fadeUp(0.3)} className="space-y-8">
              <h2 className="text-4xl font-display font-bold">Smart Contract <span className="text-brand-primary italic">Governance</span></h2>
              <p className="text-muted font-medium leading-relaxed">Our logic engine allows you to program exactly how and when your assets are released. No more ambiguity - just mathematical certainty.</p>
              <div className="space-y-4">
                 {[
                   "Time-locked distribution phases",
                   "Multi-guardian consensus triggers",
                   "Dynamic beneficiary weighting",
                   "Heartbeat protocol verification"
                 ].map((item, i) => (
                   <div key={i} className="flex items-center gap-3 text-lg font-display font-bold text-primary0">
                      <CheckCircle2 size={20} className="text-brand-primary" /> {item}
                   </div>
                 ))}
              </div>
           </motion.div>
           <motion.div {...fadeUp(0.4)}>
              <Card className="p-10 bg-surface/30 border-base/40 rounded-[48px] relative overflow-hidden">
                 <div className="space-y-6 relative z-10">
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">Protocol Simulation</span>
                       <Clock size={20} className="text-obsidian-700" />
                    </div>
                    <div className="p-6 rounded-2xl bg-page border border-base font-mono text-[13px] text-brand-primary">
                       <p>{`if (protocol_heartbeat == false) {`}</p>
                       <p className="pl-4">{`wait_for_verification_period(90_days);`}</p>
                       <p className="pl-4">{`if (guardian_quorum >= 0.66) {`}</p>
                       <p className="pl-8">{`execute_succession_plan(BENEFICIARY_ID_01);`}</p>
                       <p className="pl-4">{`}`}</p>
                       <p>{`}`}</p>
                    </div>
                    <Button variant="primary" className="w-full h-12 text-[10px] font-bold uppercase tracking-widest">
                       Test My Logic <ArrowRight size={16} className="ml-2" />
                    </Button>
                 </div>
              </Card>
           </motion.div>
        </div>
      </div>
    </div>
  );
}
