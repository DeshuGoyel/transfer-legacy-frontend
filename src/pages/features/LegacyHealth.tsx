import SEO from '../../components/seo/SEO';
import React from 'react';
import { motion } from 'framer-motion';
import { Activity, CheckCircle2, ArrowRight } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
});

export default function LegacyHealth() {
  return (
    <div className="min-h-screen bg-page text-primary pt-24 pb-20">
      <SEO 
        title="Legacy Health & Protocol Heartbeat Monitoring | Transfer Legacy"
        description="Monitor the active health score of your digital estate. Automated proof-of-life heartbeats, ping intervals, and emergency overrides."
        canonicalUrl="https://transferlegacy.com/features/legacy-health"
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center space-y-6 mb-24">
          <motion.div {...fadeUp(0)} className="flex items-center justify-center gap-2 mb-4">
            <Activity size={16} className="text-brand-primary" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
              Real-time Readiness Analytics
            </p>
          </motion.div>
          <motion.h1 {...fadeUp(0.1)} className="text-5xl md:text-5xl font-display font-bold tracking-tight">
            Legacy <span className="italic text-brand-primary">Health</span>
          </motion.h1>
          <motion.p {...fadeUp(0.2)} className="text-muted text-xl max-w-3xl mx-auto font-medium">
            A single metric that defines your digital estate's readiness for succession. Monitor, optimize, and secure.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
           <motion.div {...fadeUp(0.3)} className="relative">
              <div className="absolute inset-0 bg-brand-primary/10 blur-[120px] rounded-full animate-pulse" />
              <Card className="p-16 text-center bg-surface/30 border-base/40 rounded-[64px] backdrop-blur-3xl relative z-10">
                 <div className="inline-flex items-center justify-center w-48 h-48 rounded-full border-8 border-brand-primary/20 relative mb-8">
                    <span className="text-5xl font-display font-bold text-brand-primary">94</span>
                    <span className="absolute -top-2 -right-2 w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center border-4 border-page">
                       <CheckCircle2 size={20} className="text-white" />
                    </span>
                 </div>
                 <h3 className="text-2xl font-display font-bold mb-4">Institutional Readiness</h3>
                 <p className="text-muted font-medium mb-10">Your vault exceeds the institutional readiness threshold of 85%.</p>
                 <div className="flex justify-center gap-4">
                    <div className="text-center px-6 border-r border-base">
                       <p className="text-2xl font-bold text-brand-primary">8/8</p>
                       <p className="text-[10px] font-bold uppercase tracking-widest text-obsidian-700">Assets Secured</p>
                    </div>
                    <div className="text-center px-6">
                       <p className="text-2xl font-bold text-brand-gold">5/5</p>
                       <p className="text-[10px] font-bold uppercase tracking-widest text-obsidian-700">Guardians Active</p>
                    </div>
                 </div>
              </Card>
           </motion.div>
           <motion.div {...fadeUp(0.4)} className="space-y-8">
              <h2 className="text-4xl font-display font-bold">Predictive <span className="text-brand-primary italic">Intelligence</span></h2>
              <p className="text-muted font-medium leading-relaxed">The Legacy Health score utilizes AI-driven analytics to identify potential failure points in your succession plan before they become critical.</p>
              <div className="space-y-6">
                 {[
                   { label: "Instruction Coverage", score: "100%", status: "Optimal" },
                   { label: "Guardian Responsiveness", score: "92%", status: "High" },
                   { label: "Key Shard Redundancy", score: "88%", status: "Moderate" }
                 ].map((item, i) => (
                   <div key={i} className="space-y-2">
                      <div className="flex justify-between text-sm font-bold uppercase tracking-widest">
                         <span className="text-primary0">{item.label}</span>
                         <span className="text-brand-primary">{item.score}</span>
                      </div>
                      <div className="h-2 bg-surface rounded-full overflow-hidden border border-base">
                         <motion.div 
                           initial={{ width: 0 }}
                           whileInView={{ width: item.score }}
                           transition={{ duration: 1, delay: 0.5 }}
                           className="h-full bg-brand-primary" 
                         />
                      </div>
                   </div>
                 ))}
              </div>
              <Button variant="primary" className="h-14 px-12 text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-brand-primary/20 mt-4">
                 Full Audit Report <ArrowRight size={16} className="ml-2" />
              </Button>
           </motion.div>
        </div>
      </div>
    </div>
  );
}
