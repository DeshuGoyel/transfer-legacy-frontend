import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
  TrendingUp, Shield, Users, PieChart as PieIcon, 
  ArrowUpRight, Info, AlertTriangle, Zap, Target
} from 'lucide-react';
import { useStore } from '../store/useStore';
import Card from '../components/ui/Card';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
});

export default function LegacyAnalytics() {
  const { assets, heirs, guardians, user } = useStore();

  // ── Data Preparation ──────────────────────────────────────────

  // Asset Distribution - with fallback data
  const assetDataRaw = assets.reduce((acc, a) => {
    const type = a.type || 'Other';
    acc[type] = (acc[type] || 0) + (a.value || 1000);
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.keys(assetDataRaw).length > 0
    ? Object.entries(assetDataRaw).map(([name, value]) => ({ name, value }))
    : [
        { name: 'Crypto',      value: 420000 },
        { name: 'Equities',    value: 310000 },
        { name: 'Real Estate', value: 250000 },
        { name: 'Business',    value: 180000 },
        { name: 'Other',       value: 90000  },
      ];

  // Heir Allocation - with fallback data
  const heirData = heirs.length > 0
    ? heirs.map(h => ({
        name: h.name,
        allocated: Math.floor(Math.random() * 40) + 10,
        verified: h.status === 'Verified' ? 100 : 0,
      }))
    : [
        { name: 'Priya Sharma',   allocated: 45, verified: 100 },
        { name: 'Arjun Kapoor',   allocated: 30, verified: 100 },
        { name: 'Kavya Reddy',    allocated: 15, verified: 0   },
        { name: 'Foundation DAO', allocated: 10, verified: 100 },
      ];

  // Succession Confidence Radar - safe divide-by-zero guards
  const assetScore  = Math.min((assets.length    / 8)   * 100, 100) || 82;
  const heirScore   = heirs.length > 0
    ? (heirs.filter(h => h.status === 'Verified').length / heirs.length) * 100
    : 75;
  const guardScore  = guardians.length > 0
    ? (guardians.filter(g => g.status === 'Confirmed').length / guardians.length) * 100
    : 90;

  const radarData = [
    { subject: 'Asset Coverage',    A: Math.round(assetScore), fullMark: 100 },
    { subject: 'Heir Verification', A: Math.round(heirScore),  fullMark: 100 },
    { subject: 'Guardian Status',   A: Math.round(guardScore), fullMark: 100 },
    { subject: 'Digital Security',  A: 85, fullMark: 100 },
    { subject: 'Compliance',        A: 70, fullMark: 100 },
  ];

  const COLORS = ['#F97316', '#F59E0B', '#10B981', '#6366F1', '#A855F7'];

  return (
    <div className="min-h-screen bg-page pt-8 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* ── Header ── */}
        <motion.header {...fadeUp(0)} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-brand-primary shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
                Legacy Intelligence Engine
              </p>
            </div>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-primary tracking-tight leading-none">
              Institutional <span className="italic text-brand-primary">Analytics</span>
            </h1>
            <p className="text-muted text-sm mt-3 font-medium">
              Real-time synthesis of your digital estate and succession readiness.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 rounded-xl bg-surface/50 border border-base flex flex-col items-end">
              <span className="text-[9px] font-bold text-muted uppercase tracking-widest">Confidence Score</span>
              <span className="text-2xl font-display font-bold text-brand-primary">{user.score}%</span>
            </div>
          </div>
        </motion.header>

        {/* ── Top Metrics Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div {...fadeUp(0.1)}>
            <Card className="p-6 bg-surface/30 border-base/60 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                <Target size={80} />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                  <Shield size={20} />
                </div>
                <h3 className="font-bold text-sm text-primary">Succession Readiness</h3>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-display font-bold text-primary">High</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5">
                  <TrendingUp size={12} /> +12%
                </span>
              </div>
              <p className="text-[10px] text-muted font-bold uppercase tracking-widest mt-2">Vs last quarter</p>
            </Card>
          </motion.div>

          <motion.div {...fadeUp(0.2)}>
            <Card className="p-6 bg-surface/30 border-base/60 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                <PieIcon size={80} />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                  <Zap size={20} />
                </div>
                <h3 className="font-bold text-sm text-primary">Asset Fragmentation</h3>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-display font-bold text-primary">Low</span>
                <span className="text-xs font-bold text-emerald-400">Stable</span>
              </div>
              <p className="text-[10px] text-muted font-bold uppercase tracking-widest mt-2">Unified across 4 networks</p>
            </Card>
          </motion.div>

          <motion.div {...fadeUp(0.3)}>
            <Card className="p-6 bg-surface/30 border-base/60 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                <Users size={80} />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <Users size={20} />
                </div>
                <h3 className="font-bold text-sm text-primary">Heir Coverage</h3>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-display font-bold text-primary">85%</span>
                <span className="text-xs font-bold text-brand-primary">Action Required</span>
              </div>
              <p className="text-[10px] text-muted font-bold uppercase tracking-widest mt-2">1 heir unverified</p>
            </Card>
          </motion.div>
        </div>

        {/* ── Main Charts Area ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Succession Readiness Radar */}
          <motion.div {...fadeUp(0.4)}>
            <Card className="p-8 bg-surface/40 border-base/60 min-h-[400px] flex flex-col">
              <h3 className="text-lg font-display font-bold text-primary mb-2">Confidence Dimensions</h3>
              <p className="text-muted text-xs mb-8">Multi-vector analysis of legacy integrity.</p>
              <div style={{ width: '100%', height: 320 }}>
                <ResponsiveContainer width="100%" height={320} minWidth={0}>
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="var(--color-border)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-text-secondary)', fontSize: 10, fontWeight: 'bold' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name="Confidence"
                      dataKey="A"
                      stroke="#F97316"
                      fill="#F97316"
                      fillOpacity={0.15}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          {/* Heir Allocation Heatmap */}
          <motion.div {...fadeUp(0.5)}>
            <Card className="p-8 bg-surface/40 border-base/60 min-h-[400px] flex flex-col">
              <h3 className="text-lg font-display font-bold text-primary mb-2">Allocation Distribution</h3>
              <p className="text-muted text-xs mb-8">Current asset weight per designated recipient.</p>
              <div style={{ width: '100%', height: 320 }}>
                <ResponsiveContainer width="100%" height={320} minWidth={0}>
                  <BarChart data={heirData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-divider)" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-primary)', fontSize: 12, fontWeight: 'bold' }} width={120} />
                    <Tooltip
                      cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                      contentStyle={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', color: 'var(--color-text-primary)' }}
                      itemStyle={{ color: 'var(--color-text-primary)' }}
                    />
                    <Bar dataKey="allocated" fill="#F97316" radius={[0, 4, 4, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          {/* Asset Category Breakdown */}
          <motion.div {...fadeUp(0.6)}>
            <Card className="p-8 bg-surface/40 border-base/60 min-h-[400px] flex flex-col">
              <h3 className="text-lg font-display font-bold text-primary mb-2">Portfolio Synthesis</h3>
              <p className="text-muted text-xs mb-8">Asset concentration by institutional category.</p>
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div style={{ width: '100%', height: 280 }}>
                  <ResponsiveContainer width="100%" height={280} minWidth={0}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={8}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', color: 'var(--color-text-primary)' }}
                      itemStyle={{ color: 'var(--color-text-primary)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full md:w-48 space-y-3">
                  {pieData.map((d, i) => (
                    <div key={i} className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="text-secondary">{d.name}</span>
                      </div>
                      <span className="text-primary">${(d.value / 1000).toFixed(1)}k</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* AI Insights & Alerts */}
          <motion.div {...fadeUp(0.7)} className="space-y-6">
            <Card className="p-8 bg-surface/40 border-base/60">
              <h3 className="text-lg font-display font-bold text-primary mb-6 flex items-center gap-2">
                <Zap size={18} className="text-brand-primary" />
                Institutional Insights
              </h3>
              <div className="space-y-4">
                {[
                  { icon: AlertTriangle, color: 'text-brand-gold', bg: 'bg-brand-gold/10', title: 'Action Required: Heir Verification', desc: 'Sarah John has not verified her secure communication channel. This blocks automated legacy execution.' },
                  { icon: Shield, color: 'text-emerald-500', bg: 'bg-emerald-500/10', title: 'Security Optimization: ZK Protocol', desc: 'Your digital vault is now 100% compliant with the new Zero-Knowledge v2 standard.' },
                  { icon: Info, color: 'text-brand-primary', bg: 'bg-brand-primary/10', title: 'Portfolio Alert: Concentration', desc: '40% of your assets are in Crypto. Consider adding traditional retirement account linkage for balance.' }
                ].map((insight, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl bg-page/30 border border-base">
                    <div className={`w-10 h-10 rounded-xl ${insight.bg} flex items-center justify-center ${insight.color} shrink-0`}>
                      <insight.icon size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-primary mb-1">{insight.title}</h4>
                      <p className="text-[10px] text-secondary font-medium leading-relaxed">{insight.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="p-6 rounded-[32px] bg-brand-primary text-white flex items-center justify-between group cursor-pointer hover:scale-[1.02] transition-all shadow-lg shadow-brand-primary/20">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-tight">Generate Full Audit Report</h4>
                <p className="text-[10px] font-bold opacity-70">Export PDF for institutional partners</p>
              </div>
              <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
