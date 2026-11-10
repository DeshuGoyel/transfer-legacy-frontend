import SEO from '../../components/seo/SEO';
import React from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, TrendingUp, BarChart3, Database, Globe, Briefcase, Zap } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
});

export default function AssetTracking() {
  const assetTypes = [
    { name: "Crypto Assets", count: "4.2M+", icon: <Zap className="text-orange-400" /> },
    { name: "Digital Estates", count: "12K+", icon: <Globe className="text-brand-primary" /> },
    { name: "Institutional Funds", count: "$1.8B+", icon: <Briefcase className="text-trust-500" /> },
    { name: "NFT Portfolios", count: "85K+", icon: <LayoutGrid className="text-pink-400" /> }
  ];

  return (
    <div className="min-h-screen bg-page text-primary pt-24 pb-20">
      <SEO 
        title="Real-Time Digital Asset Tracking & Valuation | Transfer Legacy"
        description="Unified asset tracking across decentralized wallets, institutional funds, estates, and seed phrases with real-time valuation."
        canonicalUrl="https://transferlegacy.com/features/asset-tracking"
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center space-y-6 mb-20">
          <motion.div {...fadeUp(0)} className="flex items-center justify-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-trust-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-trust-500">
              Institutional Asset Monitoring
            </p>
          </motion.div>
          <motion.h1 {...fadeUp(0.1)} className="text-5xl md:text-5xl font-display font-bold tracking-tight">
            Asset <span className="italic text-trust-500">Tracking</span>
          </motion.h1>
          <motion.p {...fadeUp(0.2)} className="text-muted text-lg max-w-2xl mx-auto font-medium">
            Real-time synchronization and valuation for your global digital and traditional portfolio.
          </motion.p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {assetTypes.map((type, i) => (
            <motion.div key={i} {...fadeUp(0.3 + i * 0.1)}>
              <Card className="p-6 bg-surface/30 border-base/40 text-center">
                <div className="w-12 h-12 rounded-xl bg-page border border-base flex items-center justify-center mx-auto mb-4">
                  {React.cloneElement(type.icon as React.ReactElement, { size: 20 })}
                </div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary0 mb-1">{type.name}</h4>
                <p className="text-2xl font-display font-bold text-primary">{type.count}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Visualization Mockup */}
        <motion.div {...fadeUp(0.6)} className="bg-surface/30 border border-base rounded-[48px] p-8 md:p-12 mb-24 overflow-hidden relative">
           <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
              <div className="lg:w-1/3 space-y-8">
                 <h2 className="text-3xl font-display font-bold leading-tight">
                    Unified <span className="text-brand-primary italic">Portfolio</span> Interface
                 </h2>
                 <p className="text-muted text-sm leading-relaxed font-medium">
                    Bridge the gap between Web3 assets and traditional institutional funds. Our tracking engine aggregates real-time valuations from global exchanges and banking APIs.
                 </p>
                 <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-page border border-base">
                       <BarChart3 size={20} className="text-brand-primary" />
                       <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Live Valuation</p>
                          <p className="text-xs text-muted font-medium">Synced 2s ago</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-page border border-base">
                       <Database size={20} className="text-brand-gold" />
                       <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Vault Integrity</p>
                          <p className="text-xs text-muted font-medium">100% Secure</p>
                       </div>
                    </div>
                 </div>
                 <Button variant="primary" className="h-12 px-10 text-[10px] font-bold uppercase tracking-widest">
                    Connect Institutional API
                 </Button>
              </div>
              <div className="flex-1 w-full bg-page/80 rounded-[32px] border border-base shadow-2xl overflow-hidden p-8">
                 <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                          <TrendingUp size={16} />
                       </div>
                       <span className="font-display font-bold">Portfolio Synthesis</span>
                    </div>
                    <div className="flex gap-2">
                       <div className="px-3 py-1 rounded-full bg-surface border border-base text-[9px] font-bold uppercase tracking-widest">7 Days</div>
                       <div className="px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/30 text-[9px] font-bold uppercase tracking-widest text-brand-primary">30 Days</div>
                    </div>
                 </div>
                 <div className="h-64 flex items-end justify-between gap-2">
                    {[40, 65, 45, 90, 70, 85, 100, 80, 95, 110, 105, 120].map((h, i) => (
                      <div key={i} className="flex-1 bg-gradient-to-t from-brand-primary/10 to-brand-primary/40 rounded-t-lg transition-all hover:to-brand-primary" style={{ height: `${h}%` }} />
                    ))}
                 </div>
                 <div className="mt-8 grid grid-cols-3 gap-4 border-t border-base pt-8">
                    <div>
                       <p className="text-[9px] font-bold uppercase tracking-widest text-muted mb-1">Growth</p>
                       <p className="text-xl font-display font-bold text-trust-500">+24.5%</p>
                    </div>
                    <div>
                       <p className="text-[9px] font-bold uppercase tracking-widest text-muted mb-1">Volatility</p>
                       <p className="text-xl font-display font-bold">Low</p>
                    </div>
                    <div>
                       <p className="text-[9px] font-bold uppercase tracking-widest text-muted mb-1">Security Score</p>
                       <p className="text-xl font-display font-bold text-brand-gold">98/100</p>
                    </div>
                 </div>
              </div>
           </div>
        </motion.div>

        {/* CTA */}
        <motion.div {...fadeUp(0.8)} className="text-center">
           <h3 className="text-2xl font-display font-bold mb-6">Ready to archive your institutional wealth?</h3>
           <div className="flex justify-center gap-4">
              <Button variant="primary" className="h-12 px-10 text-[10px] font-bold uppercase tracking-widest">Open Personal Vault</Button>
              <Button variant="secondary" className="h-12 px-10 text-[10px] font-bold uppercase tracking-widest border-base">Request Enterprise Demo</Button>
           </div>
        </motion.div>
      </div>
    </div>
  );
}
