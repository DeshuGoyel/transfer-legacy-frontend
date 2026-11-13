import { CheckCircle2, Shield, Lock, EyeOff, ShieldCheck, Activity, Globe, Scale, ChevronRight, Zap } from 'lucide-react';
import Card from '../components/ui/Card';
import { Canvas } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import { motion } from 'framer-motion';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
});

export default function TrustCenter() {
  return (
    <div className="min-h-screen bg-page text-primary selection:bg-brand-primary/30 pt-6">
      <main className="px-4 sm:px-6 lg:px-8 pb-24 md:pb-12 max-w-7xl mx-auto space-y-12">
        
        {/* ── Page Header ── */}
        <motion.header {...fadeUp(0)} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-brand-primary shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
                Institutional Security Protocol
              </p>
            </div>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-primary tracking-tight leading-none">
              Trust & <span className="italic text-brand-primary">Compliance</span>
            </h1>
            <p className="text-muted text-sm mt-3 font-medium">
              Zero-knowledge by design. Institutional-grade verification at every layer.
            </p>
          </div>
        </motion.header>

        {/* ── Security Kpis ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Network Uptime', value: '99.99%', icon: Activity, detail: '90-day rolling' },
            { label: 'Security Incidents', value: 'Zero', icon: ShieldCheck, detail: 'Lifetime tracking' },
            { label: 'Encryption Standard', value: '256-bit', icon: Lock, detail: 'AES-GCM Authenticated' },
            { label: 'Privacy Protocol', value: 'Full ZK', icon: EyeOff, detail: 'Zero-Knowledge Arch' },
          ].map((stat, i) => (
            <motion.div key={i} {...fadeUp(0.1 + i * 0.05)}>
              <Card className="flex flex-col items-center justify-center p-8 text-center bg-surface/50 border-base/60 relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <h3 className="text-3xl font-display font-bold text-primary mb-1">{stat.value}</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-secondary">{stat.label}</p>
                <div className="flex items-center text-[10px] text-muted mt-4 font-mono font-bold uppercase tracking-tighter">
                  {stat.detail}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            
            {/* ── Compliance Standards ── */}
            <motion.section {...fadeUp(0.3)} className="bg-surface/30 border border-base/60 rounded-3xl p-8 lg:p-10">
              <h3 className="text-xl font-display font-bold text-primary mb-8 flex items-center gap-3">
                <Globe className="text-brand-primary" size={20} />
                Global Standards Compliance
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: 'SOC 2 Type II', desc: 'Readiness & Aligned Trust Criteria' },
                  { name: 'GDPR / UK GDPR', desc: 'Full Data Protection Compliance' },
                  { name: 'ISO/IEC 27001', desc: 'Information Security Management Controls' },
                  { name: 'Post-Quantum NIST', desc: 'Kyber768 & OPAQUE RFC 9801 Protocol' },
                  { name: 'CCPA / CPRA', desc: 'California Consumer Privacy Act Aligned' },
                  { name: 'DPDP Act 2023', desc: 'India Digital Privacy Standard' }
                ].map((cert, i) => (
                  <div key={i} className="flex items-start space-x-4 p-5 rounded-2xl border border-base bg-page/50 hover:bg-page hover:border-brand-primary/30 transition-all duration-300 group shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center shrink-0 group-hover:bg-brand-primary/20 transition-colors">
                      <CheckCircle2 size={18} className="text-brand-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-primary tracking-tight">{cert.name}</h4>
                      <p className="text-[10px] text-muted font-bold uppercase tracking-widest mt-1.5">{cert.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* ── Verification History ── */}
            <motion.section {...fadeUp(0.4)} className="bg-surface/30 border border-base/60 rounded-3xl p-8 lg:p-10">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-display font-bold text-primary flex items-center gap-3">
                  <Scale className="text-brand-primary" size={20} />
                  Independent Audits
                </h3>
                <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest cursor-pointer hover:underline">View Public Logs</span>
              </div>
              <div className="space-y-4">
                {[
                  { date: 'MAY 2026', type: 'Automated Pen-Test & Dynamic Analysis', status: 'Passed', author: 'OWASP ZAP & Semgrep Core' },
                  { date: 'APR 2026', type: 'Post-Quantum & OPAQUE Handshake Review', status: 'Verified', author: 'Cryptographic Architecture Audit' },
                  { date: 'Q3/Q4 2026', type: 'External SOC 2 Type II & Pen-Test', status: 'Scheduled', author: 'Accredited AICPA Auditor' },
                ].map((audit, i) => (
                  <div key={i} className="flex items-center justify-between p-6 rounded-2xl border border-base bg-page/30 hover:bg-page transition-all cursor-default group">
                    <div>
                      <h4 className="font-bold text-sm text-primary tracking-tight group-hover:text-brand-primary transition-colors">{audit.type}</h4>
                      <p className="text-[10px] text-muted font-bold uppercase tracking-[0.15em] mt-2">{audit.date} · {audit.author}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary">
                        {audit.status}
                      </span>
                      <ChevronRight size={14} className="text-muted" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>

          <div className="space-y-8">
            {/* ── Secure Core Visualization ── */}
            <motion.div {...fadeUp(0.5)} className="h-80 rounded-[32px] bg-surface/50 border border-base/60 overflow-hidden relative group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.1),transparent)]" />
              <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#F97316" />
                <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                  <mesh rotation={[Math.PI/4, Math.PI/4, 0]}>
                    <torusKnotGeometry args={[1, 0.3, 128, 16]} />
                    <MeshDistortMaterial 
                      color="#F97316" 
                      speed={2} 
                      distort={0.4} 
                      radius={1}
                      wireframe
                    />
                  </mesh>
                </Float>
              </Canvas>
              <div className="absolute top-6 left-6 right-6 flex justify-between pointer-events-none">
                <Shield size={24} className="text-brand-primary" />
                <Lock size={24} className="text-brand-primary" />
              </div>
              <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-brand-primary">Secure Core Active</p>
              </div>
            </motion.div>

            {/* ── Architecture Protocol ── */}
            <motion.div {...fadeUp(0.6)}>
              <Card className="bg-surface border-base p-8">
                <h3 className="text-lg font-display font-bold text-primary mb-6 tracking-tight">Security Architecture</h3>
                <ul className="space-y-6">
                  {[
                    { icon: EyeOff, title: 'Client-Side Sealing', desc: 'We use AES-256-GCM authenticated encryption on your device. We never see your plaintext.' },
                    { icon: Shield, title: 'Fragmented Custody', desc: "Vault keys are split using Shamir's Secret Sharing across geographically distributed secure nodes." },
                    { icon: Lock, title: 'Decommissioning Protocol', desc: 'Redundant proof-of-life checks ensure data remains locked until verified protocol triggers.' }
                  ].map((item, i) => (
                    <li key={i} className="flex items-start space-x-4">
                      <div className="w-8 h-8 rounded-lg bg-page border border-base flex items-center justify-center shrink-0">
                        <item.icon size={14} className="text-brand-primary" />
                      </div>
                      <div>
                        <h5 className="font-bold text-xs text-primary tracking-tight">{item.title}</h5>
                        <p className="text-[10px] text-secondary font-medium leading-relaxed mt-1.5">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>

            {/* ── Whitepaper CTA ── */}
            <motion.div {...fadeUp(0.7)} className="p-8 rounded-[32px] bg-gradient-to-br from-brand-primary/10 to-transparent border border-brand-primary/20 text-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
               <p className="text-xs font-bold text-brand-primary uppercase tracking-widest mb-4 relative z-10">Deep Tech Verification</p>
               <p className="text-sm text-secondary font-medium mb-8 px-4 leading-relaxed relative z-10">Review our comprehensive security architecture whitepaper.</p>
               <button className="w-full py-4 bg-brand-primary text-page font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all relative z-10 shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2">
                 Read Security Spec
                 <Zap size={14} />
               </button>
            </motion.div>
          </div>
        </div>

      </main>
    </div>
  );
}
