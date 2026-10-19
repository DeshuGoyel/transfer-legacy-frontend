import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, AlertTriangle, Zap, Shield, Target, Lock } from 'lucide-react';
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

export default function CryptoCalculator() {
  const navigate = useNavigate();
  const { isAuthenticated } = useStore();
  const [assetValue, setAssetValue] = useState(100000);
  const [age, setAge] = useState(35);

  const baseLossRisk = 0.20; 
  const ageRiskMultiplier = Math.max(1, (age - 30) / 20);
  const calculatedRiskPercentage = Math.min(100, (baseLossRisk * ageRiskMultiplier) * 100);
  const potentialLossValue = assetValue * (calculatedRiskPercentage / 100);

  return (
    <div className="min-h-screen bg-page text-primary pt-24 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-aurora opacity-30 pointer-events-none" />
      
      <SEO 
        title="Crypto Inheritance Risk Calculator | Transfer Legacy"
        description="Estimate the probability of permanent asset loss. 20% of all Bitcoin is already lost - don't let your portfolio be next."
        canonicalUrl="https://transferlegacy.com/tools/crypto-risk-calculator"
      />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div {...fadeUp(0)} className="flex items-center justify-center gap-2 mb-4">
            <Lock size={16} className="text-red-400" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-400">
              Security Risk Assessment
            </p>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6">
            Loss <span className="italic text-brand-primary">Exposure</span>
          </h1>
          <p className="text-secondary text-xl font-medium max-w-2xl mx-auto">
            Quantify the structural risk of permanent asset abandonment across your digital portfolio.
          </p>
        </div>

        <div className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[40px] p-8 md:p-12 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-10">
               <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted">Portfolio Value (USD)</label>
                    <span className="text-2xl font-mono font-bold text-brand-primary">${assetValue.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" min="10000" max="10000000" step="10000"
                    value={assetValue} onChange={(e) => setAssetValue(Number(e.target.value))}
                    className="w-full accent-brand-primary h-1 bg-base/40 rounded-full appearance-none cursor-pointer"
                  />
               </div>

               <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted">Owner Age</label>
                    <span className="text-2xl font-mono font-bold text-primary">{age}y</span>
                  </div>
                  <input 
                    type="range" min="18" max="100" step="1"
                    value={age} onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full accent-brand-primary h-1 bg-base/40 rounded-full appearance-none cursor-pointer"
                  />
               </div>

               <div className="flex items-start gap-4 p-4 rounded-2xl bg-obsidian-950/50 border border-base/40">
                  <AlertTriangle size={20} className="text-brand-gold shrink-0 mt-1" />
                  <p className="text-[11px] font-medium text-secondary leading-relaxed">
                    Based on Chainalysis 2024 data, roughly <span className="text-white font-bold">3.7M BTC</span> is already permanently lost due to abandoned private keys.
                  </p>
               </div>
            </div>

            <Card className="p-10 bg-obsidian-950/80 border-red-400/30 rounded-[32px] text-center shadow-inner">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-400/10 rounded-full border border-red-400/20 mb-8">
                  <Zap size={14} className="text-red-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-red-400">Exposure Alert</span>
               </div>

               <div className="mb-12">
                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted mb-4">Value At Permanent Risk</p>
                  <div className="text-6xl font-display font-bold text-primary leading-none tracking-tighter">
                    ${Math.round(potentialLossValue).toLocaleString()}
                  </div>
                  <p className="text-[11px] font-bold text-red-400 mt-4 uppercase tracking-[0.2em]">
                    {calculatedRiskPercentage.toFixed(1)}% Recovery Friction
                  </p>
               </div>

               <Button 
                 onClick={() => navigate(isAuthenticated ? '/dashboard' : '/onboarding')}
                 className="w-full h-14 rounded-2xl bg-brand-primary text-obsidian-950 font-bold uppercase tracking-widest text-[11px] shadow-2xl shadow-brand-primary/20"
               >
                 {isAuthenticated ? 'Go to Dashboard' : 'De-Risk My Assets'} <ArrowRight className="ml-2" size={16} />
               </Button>
            </Card>
          </div>
        </div>

        {/* Comparison Ticker */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { label: "Lost Bitcoin", val: "20.4%", icon: <AlertTriangle size={14} /> },
             { label: "Forgotten 2FA", val: "12M+", icon: <Shield size={14} /> },
             { label: "Abandoned Wallets", val: "45%", icon: <Target size={14} /> }
           ].map((stat, i) => (
             <motion.div key={i} {...fadeUp(0.3 + i * 0.1)} className="p-6 bg-surface/30 border border-base/40 rounded-3xl flex items-center gap-4">
                <div className="text-brand-primary">{stat.icon}</div>
                <div>
                   <p className="text-xl font-display font-bold text-primary">{stat.val}</p>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-muted">{stat.label}</p>
                </div>
             </motion.div>
           ))}
        </div>
      </div>
    </div>
  );
}
