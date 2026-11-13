import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Clock, ArrowRight, Target, BarChart3, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import SEO from '../../components/seo/SEO';
import { useStore } from '../../store/useStore';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
});

export default function ROICalculator() {
  const navigate = useNavigate();
  const { isAuthenticated } = useStore();
  const [assetValue, setAssetValue] = useState(250000);
  
  const potentialLoss = assetValue * 0.35; // 35% estimated loss (legal, recovery, lost access)
  const tlSavings = potentialLoss * 0.94; // 94% efficiency with TL
  const traditionalTime = 24; // months
  const protocolTime = 1; // month

  return (
    <div className="min-h-screen bg-page text-primary pt-24 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-aurora opacity-30 pointer-events-none" />
      
      <SEO 
        title="Capital Preservation ROI Calculator | Transfer Legacy"
        description="Calculate the return on investment for securing your digital legacy. Compare protocol efficiency against traditional probate."
        canonicalUrl="https://transferlegacy.com/tools/roi-calculator"
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div {...fadeUp(0)} className="flex items-center justify-center gap-2 mb-4">
            <BarChart3 size={16} className="text-brand-gold" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold">
              Capital Preservation Analysis
            </p>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6">
            Legacy <span className="italic text-brand-primary">ROI</span>
          </h1>
          <p className="text-secondary text-xl font-medium max-w-2xl mx-auto">
            Quantify the value of institutional-grade asset protection and zero-friction recovery.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20">
          {/* Controls */}
          <div className="lg:col-span-5 space-y-8">
            <Card className="p-10 bg-surface/30 backdrop-blur-md border-base/60 rounded-[40px]">
              <div className="space-y-12">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted">Digital Portfolio Value</label>
                    <span className="text-2xl font-mono font-bold text-brand-primary">${assetValue.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" min="10000" max="10000000" step="10000"
                    value={assetValue} onChange={(e) => setAssetValue(Number(e.target.value))}
                    className="w-full accent-brand-primary h-1 bg-base/40 rounded-full appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] font-bold text-muted uppercase tracking-widest">
                    <span>$10k</span>
                    <span>$10M</span>
                  </div>
                </div>

                <div className="space-y-4 pt-8 border-t border-base/40">
                   <div className="flex items-start gap-4 p-4 rounded-2xl bg-page/60 border border-base/40">
                      <Clock size={18} className="text-muted shrink-0 mt-1" />
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-muted mb-1">Recovery Delta</p>
                        <p className="text-sm font-bold text-secondary">
                          <span className="text-red-400">{traditionalTime}mo</span> vs <span className="text-brand-primary">{protocolTime}mo</span>
                        </p>
                      </div>
                   </div>
                   <div className="flex items-start gap-4 p-4 rounded-2xl bg-page/60 border border-base/40">
                      <ShieldCheck size={18} className="text-muted shrink-0 mt-1" />
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-muted mb-1">Access Guarantee</p>
                        <p className="text-sm font-bold text-secondary">99.9% Probabilistic Success</p>
                      </div>
                   </div>
                </div>
              </div>
            </Card>

            <div className="p-8 bg-brand-gold/5 border border-brand-gold/20 rounded-[32px] flex gap-4">
              <AlertCircle size={24} className="text-brand-gold shrink-0" />
              <p className="text-[11px] font-medium text-brand-gold leading-relaxed italic">
                Over $200B in Bitcoin is currently inaccessible due to forgotten keys. Our protocol eliminates the "Forgotten Seed" risk entirely.
              </p>
            </div>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-7 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-10 bg-red-400/5 border-red-400/20 text-center rounded-[40px]">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-400 mb-2">Unprotected Loss Exposure</p>
                <p className="text-4xl font-display font-bold text-primary tracking-tight">${Math.round(potentialLoss).toLocaleString()}</p>
                <p className="text-[9px] text-muted mt-3 uppercase font-bold tracking-widest leading-relaxed">
                  Calculated from probate fees,<br />legal overhead & market drift.
                </p>
              </Card>
              <Card className="p-10 bg-brand-primary/5 border-brand-primary/20 text-center rounded-[40px]">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary mb-2">Preserved Capital</p>
                <p className="text-4xl font-display font-bold text-brand-primary tracking-tight">${Math.round(tlSavings).toLocaleString()}</p>
                <p className="text-[9px] text-muted mt-3 uppercase font-bold tracking-widest leading-relaxed">
                  94% Efficiency gain via<br />automated vault triggers.
                </p>
              </Card>
            </div>

            <Card className="p-12 bg-surface/50 backdrop-blur-3xl border border-base/60 rounded-[48px] relative overflow-hidden">
               <div className="absolute top-0 right-0 w-full h-full bg-aurora opacity-10 pointer-events-none" />
               <div className="relative z-10 space-y-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Target size={20} className="text-brand-gold" />
                    <h3 className="text-2xl font-display font-bold">Efficiency <span className="text-brand-primary italic">Summary</span></h3>
                  </div>
                  
                  <div className="space-y-6">
                    {[
                      { label: "Asset Protection", value: "99.9%", color: "text-brand-primary" },
                      { label: "Legal Friction reduction", value: "85%", color: "text-brand-gold" },
                      { label: "Time-to-Transfer improvement", value: "24x", color: "text-emerald-400" }
                    ].map((stat, i) => (
                      <div key={i} className="flex justify-between items-center py-4 border-b border-base/40 last:border-0">
                        <span className="text-sm font-bold text-secondary">{stat.label}</span>
                        <span className={`text-xl font-mono font-bold ${stat.color}`}>{stat.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-8">
                    <Button 
                      onClick={() => navigate(isAuthenticated ? '/dashboard' : '/onboarding')}
                      className="w-full h-16 rounded-2xl bg-brand-primary text-obsidian-950 font-bold uppercase tracking-widest text-[11px] shadow-2xl shadow-brand-primary/20"
                    >
                      {isAuthenticated ? 'Go to Dashboard' : 'Maximize My Legacy ROI'} <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </div>
               </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
