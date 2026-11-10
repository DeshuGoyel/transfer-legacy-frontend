import SEO from '../../components/seo/SEO';
import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Shield, Scale, FileCheck, CheckCircle2, MapPin, Landmark } from 'lucide-react';
import Card from '../../components/ui/Card';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
});

export default function GlobalCompliance() {
  const jurisdictions = [
    { name: "United States", status: "Active", law: "Uniform Electronic Transactions Act (UETA)" },
    { name: "European Union", status: "Active", law: "eIDAS Regulation & GDPR" },
    { name: "United Kingdom", status: "Active", law: "Electronic Communications Act 2000" },
    { name: "UAE / Middle East", status: "Active", law: "DIFC Data Protection Law" },
    { name: "India", status: "Active", law: "Information Technology Act, 2000" }
  ];

  return (
    <div className="min-h-screen bg-page text-primary pt-24 pb-20">
      <SEO 
        title="Global Legal & Regulatory Compliance | Transfer Legacy"
        description="Succession compliance across international jurisdictions including US RUFADAA, EU GDPR, Indian Succession Act, and UAE VARA."
        canonicalUrl="https://transferlegacy.com/legal/compliance"
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center space-y-6 mb-24">
          <motion.div {...fadeUp(0)} className="flex items-center justify-center gap-2 mb-4">
            <Globe size={16} className="text-brand-primary" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
              Multi-Jurisdictional Regulatory Framework
            </p>
          </motion.div>
          <motion.h1 {...fadeUp(0.1)} className="text-5xl md:text-5xl font-display font-bold tracking-tight">
            Global <span className="italic text-brand-primary">Compliance</span>
          </motion.h1>
          <motion.p {...fadeUp(0.2)} className="text-muted text-xl max-w-3xl mx-auto font-medium">
            Transfer Legacy is engineered to meet and exceed the most stringent global standards for digital asset succession and data privacy.
          </motion.p>
        </div>

        {/* Global Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
           {[
             { label: "Jurisdictions Supported", value: "190+", icon: <Globe size={20} /> },
             { label: "Compliance Frameworks", value: "14", icon: <Scale size={20} /> },
             { label: "Data Sovereignty Nodes", value: "450", icon: <Shield size={20} /> },
             { label: "Audit Frequency", value: "Quarterly", icon: <FileCheck size={20} /> }
           ].map((stat, i) => (
             <motion.div key={i} {...fadeUp(0.3 + i * 0.1)}>
                <Card className="p-8 text-center bg-surface/30 hover:border-brand-primary/30 transition-all">
                   <div className="w-12 h-12 rounded-xl bg-page border border-base flex items-center justify-center mx-auto mb-6 text-brand-primary">
                      {stat.icon}
                   </div>
                   <h3 className="text-3xl font-display font-bold mb-2">{stat.value}</h3>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-obsidian-700">{stat.label}</p>
                </Card>
             </motion.div>
           ))}
        </div>

        {/* Jurisdiction List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
           <motion.div {...fadeUp(0.6)} className="space-y-8">
              <h2 className="text-4xl font-display font-bold">Local Legal <span className="text-brand-primary italic">Alignment</span></h2>
              <p className="text-muted font-medium leading-relaxed">We maintain active legal reviews across major global financial hubs to ensure your protocol implementation is recognized by local judicial systems.</p>
              
              <div className="space-y-4">
                 {jurisdictions.map((j, i) => (
                   <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-surface border border-base hover:border-brand-primary/20 transition-all group">
                      <div className="flex items-center gap-4">
                         <div className="w-8 h-8 rounded-full bg-page border border-base flex items-center justify-center group-hover:bg-brand-primary/10 transition-all">
                            <MapPin size={14} className="text-brand-primary" />
                         </div>
                         <div>
                            <p className="text-sm font-bold">{j.name}</p>
                            <p className="text-[10px] text-muted font-bold uppercase">{j.law}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-trust-500/10 border border-trust-500/20 text-[9px] font-bold text-trust-500 uppercase tracking-widest">
                         <CheckCircle2 size={10} /> {j.status}
                      </div>
                   </div>
                 ))}
              </div>
           </motion.div>
           <motion.div {...fadeUp(0.7)}>
              <Card className="p-12 md:p-16 bg-brand-primary/5 border-brand-primary/20 rounded-[64px] relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-full bg-aurora opacity-10 pointer-events-none" />
                 <Landmark size={120} className="text-brand-primary/10 mb-8" />
                 <h3 className="text-3xl font-display font-bold mb-6">Institutional Compliance PDF</h3>
                 <p className="text-primary0 font-medium leading-relaxed mb-10">
                    Download our full regulatory breakdown for legal counsel and institutional risk departments. This document covers our ZK-architecture's alignment with FATF, AMLD5, and CCPA standards.
                 </p>
                 <button className="w-full py-4 rounded-2xl bg-brand-primary text-white text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-brand-primary/20 hover:scale-[1.02] transition-transform">
                    Download Regulatory Pack (2.4MB)
                 </button>
              </Card>
           </motion.div>
        </div>

        {/* GDPR / Privacy Focus */}
        <motion.div {...fadeUp(0.8)} className="bg-surface/30 border border-base rounded-[48px] p-12 md:p-20 relative overflow-hidden">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                 <h3 className="text-3xl font-display font-bold">Privacy by <span className="italic text-brand-gold">Design</span></h3>
                 <p className="text-muted font-medium leading-relaxed">Our protocol is fundamentally built on the principle of data minimization. We do not process what we do not need, and we do not store what we cannot see.</p>
                 <ul className="space-y-4">
                    {["Zero-knowledge vault payload encryption", "Instant cryptographic Right-to-Erasure (GDPR Art. 17)", "Biometric credentials stay on-device (WebAuthn)", "Append-only Merkle audit trail"].map((point, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm font-bold text-primary0">
                         <CheckCircle2 size={18} className="text-brand-gold" /> {point}
                      </li>
                    ))}
                 </ul>
              </div>
              <div className="flex justify-center">
                 <div className="relative w-64 h-64">
                    <div className="absolute inset-0 bg-brand-gold/10 blur-[60px] animate-pulse" />
                    <Shield size={256} className="text-brand-gold/10 relative z-10" />
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                       <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-gold">GDPR COMPLIANT</span>
                    </div>
                 </div>
              </div>
           </div>
        </motion.div>
      </div>
    </div>
  );
}
