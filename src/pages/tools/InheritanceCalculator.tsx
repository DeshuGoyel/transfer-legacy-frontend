import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Globe2, TrendingUp, ArrowRight, Shield, Info, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import SEO from '../../components/seo/SEO';
import { useStore } from '../../store/useStore';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
});

export default function InheritanceCalculator() {
  const navigate = useNavigate();
  const { isAuthenticated } = useStore();
  const [jurisdiction, setJurisdiction] = useState('USA');
  const [assetValue, setAssetValue] = useState(100000);
  const [growthRate, setGrowthRate] = useState(10);
  const [years, setYears] = useState(20);

  const taxLogic: Record<string, { rate: number; threshold: number; note: string; color: string }> = {
    'India': { 
      rate: 0, 
      threshold: Infinity, 
      note: "No inheritance tax. Potential 20-30% LTCG on crypto gains.",
      color: "text-emerald-400"
    },
    'USA': { 
      rate: 0.4, 
      threshold: 13610000, 
      note: "40% above $13.61M threshold. Step-up in basis may apply.",
      color: "text-brand-primary"
    },
    'UK': { 
      rate: 0.4, 
      threshold: 325000, 
      note: "40% above £325k nil-rate band. Potential 7-year rule.",
      color: "text-brand-gold"
    },
    'UAE': { 
      rate: 0, 
      threshold: Infinity, 
      note: "0% tax environment. DIFC Wills required for non-Muslims.",
      color: "text-purple-400"
    }
  };

  const calculateProjection = () => {
    const futureValue = assetValue * Math.pow(1 + growthRate / 100, years);
    const logic = taxLogic[jurisdiction] || { rate: 0, threshold: Infinity };
    
    let taxAmount = 0;
    if (futureValue > logic.threshold) {
      taxAmount = (futureValue - logic.threshold) * logic.rate;
    }
    
    return {
      futureValue,
      taxAmount,
      netValue: futureValue - taxAmount
    };
  };

  const results = calculateProjection();

  return (
    <div className="min-h-screen bg-page text-primary pt-24 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-aurora opacity-30 pointer-events-none" />
      
      <SEO 
        title="Inheritance Tax & Growth Calculator | Transfer Legacy"
        description="Estimate your digital estate's future value and inheritance tax liability across USA, UK, India, and UAE jurisdictions."
        canonicalUrl="https://transferlegacy.com/features/inheritance-calculator"
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div {...fadeUp(0)} className="flex items-center justify-center gap-2 mb-4">
            <Calculator size={16} className="text-brand-primary" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
              Institutional Projection Engine
            </p>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6">
            Wealth <span className="italic text-brand-primary">Projection</span>
          </h1>
          <p className="text-secondary text-xl font-medium max-w-2xl mx-auto">
            Calculate the impact of time, growth, and jurisdiction-specific taxes on your digital legacy.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls */}
          <div className="lg:col-span-5 space-y-8">
            <Card className="p-10 bg-surface/30 backdrop-blur-md border-base/60 rounded-[40px]">
              <div className="space-y-10">
                {/* Jurisdiction */}
                <div>
                  <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted mb-4">
                    <Globe2 size={12} /> Target Jurisdiction
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.keys(taxLogic).map((j) => (
                      <button
                        key={j}
                        onClick={() => setJurisdiction(j)}
                        className={`p-4 rounded-2xl border text-sm font-bold transition-all ${
                          jurisdiction === j 
                          ? 'bg-brand-primary border-brand-primary text-obsidian-950 shadow-lg shadow-brand-primary/20' 
                          : 'bg-page/60 border-base/40 text-secondary hover:border-brand-primary/40'
                        }`}
                      >
                        {j}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Asset Value */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted">Initial Asset Value</label>
                    <span className="text-xl font-mono font-bold text-primary">${assetValue.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" min="1000" max="10000000" step="10000"
                    value={assetValue} onChange={(e) => setAssetValue(Number(e.target.value))}
                    className="w-full accent-brand-primary h-1 bg-base/40 rounded-full appearance-none cursor-pointer"
                  />
                </div>

                {/* Growth Rate */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted">Annual Growth (%)</label>
                    <span className="text-xl font-mono font-bold text-primary">{growthRate}%</span>
                  </div>
                  <input 
                    type="range" min="1" max="100" step="1"
                    value={growthRate} onChange={(e) => setGrowthRate(Number(e.target.value))}
                    className="w-full accent-brand-primary h-1 bg-base/40 rounded-full appearance-none cursor-pointer"
                  />
                </div>

                {/* Horizon */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted">Projection Horizon (Years)</label>
                    <span className="text-xl font-mono font-bold text-primary">{years}y</span>
                  </div>
                  <input 
                    type="range" min="1" max="50" step="1"
                    value={years} onChange={(e) => setYears(Number(e.target.value))}
                    className="w-full accent-brand-primary h-1 bg-base/40 rounded-full appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </Card>

            <div className="flex items-center gap-4 p-6 bg-brand-gold/10 rounded-3xl border border-brand-gold/20">
               <Info size={24} className="text-brand-gold shrink-0" />
               <p className="text-[11px] font-medium text-brand-gold leading-relaxed">
                  Calculations are based on 2024 tax thresholds. Crypto is treated as property. Consult a professional for final estate planning.
               </p>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-7 space-y-8">
            <Card className="p-12 bg-surface/50 border border-base/60 backdrop-blur-2xl rounded-[48px] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <TrendingUp size={160} className="text-brand-primary" />
              </div>

              <div className="relative z-10 space-y-12">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted mb-4">Projected Legacy Value</p>
                  <div className="text-6xl md:text-8xl font-display font-bold text-primary tracking-tighter leading-none">
                    ${Math.round(results.futureValue).toLocaleString()}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted mb-2">Estimated {jurisdiction} Tax</p>
                    <div className={`text-3xl font-display font-bold ${results.taxAmount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      ${Math.round(results.taxAmount).toLocaleString()}
                    </div>
                    <p className={`text-[10px] mt-2 font-bold ${taxLogic[jurisdiction].color}`}>
                       {taxLogic[jurisdiction].note}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted mb-2">Net Family Transfer</p>
                    <div className="text-3xl font-display font-bold text-brand-primary">
                      ${Math.round(results.netValue).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="pt-12 border-t border-base/40">
                   <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-emerald-400/10 flex items-center justify-center text-emerald-400">
                            <Shield size={20} />
                         </div>
                         <div>
                            <p className="text-sm font-bold">Protocol Protection</p>
                            <p className="text-[10px] text-muted uppercase font-bold tracking-widest">Active Succession Required</p>
                         </div>
                      </div>
                      <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">
                         View Protection Plan <ChevronRight size={14} className="ml-1" />
                      </Button>
                   </div>
                   
                   <Button 
                     onClick={() => navigate(isAuthenticated ? '/dashboard' : '/onboarding')}
                     className="w-full h-16 rounded-2xl bg-brand-primary text-obsidian-950 font-bold uppercase tracking-widest text-[11px] shadow-2xl shadow-brand-primary/20"
                   >
                     {isAuthenticated ? 'Go to Dashboard' : 'Initialize My Vault'} <ArrowRight className="ml-2" size={16} />
                   </Button>
                </div>
              </div>
            </Card>

            {/* Micro Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="p-8 rounded-[32px] bg-surface/30 border border-base/60">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted mb-4">Manual Probate Path</h4>
                  <div className="text-2xl font-display font-bold text-red-400/80 mb-2">12-18 Months</div>
                  <p className="text-[11px] text-secondary font-medium leading-relaxed italic">The typical delay for crypto asset recovery without a protocol switch.</p>
               </div>
               <div className="p-8 rounded-[32px] bg-brand-primary/5 border border-brand-primary/20">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-brand-primary mb-4">Transfer Legacy Path</h4>
                  <div className="text-2xl font-display font-bold text-brand-primary mb-2">30 Days</div>
                  <p className="text-[11px] text-secondary font-medium leading-relaxed italic">Verified triggers ensure zero-friction transfer of private keys to heirs.</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
