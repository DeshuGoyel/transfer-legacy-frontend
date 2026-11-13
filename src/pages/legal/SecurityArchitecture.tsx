import SEO from '../../components/seo/SEO';
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Cpu, Network, Zap, CheckCircle2, Server, Terminal } from 'lucide-react';
import Card from '../../components/ui/Card';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
});

export default function SecurityArchitecture() {
  const pillars = [
    {
      title: "Zero-Knowledge Architecture",
      description: "Data is encrypted at the edge. We never see your keys, your assets, or your heirs.",
      icon: <Lock size={24} className="text-brand-primary" />
    },
    {
      title: "Decentralized Key Fragmentation",
      description: "Using Shamir's Secret Sharing to split your master key into multiple secure shards.",
      icon: <Cpu size={24} className="text-brand-gold" />
    },
    {
      title: "Multi-Signature Quorum",
      description: "Succession requires a mathematical consensus from your trusted guardian network.",
      icon: <Network size={24} className="text-trust-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-page text-primary pt-24 pb-20">
      <SEO 
        title="Security Architecture Specification | Transfer Legacy"
        description="Detailed cryptographic specifications: AES-256 GCM, Libsodium Sumo, Shamir Secret Sharing, and Argon2id key derivation."
        canonicalUrl="https://transferlegacy.com/legal/security-architecture"
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center space-y-6 mb-24">
          <motion.div {...fadeUp(0)} className="flex items-center justify-center gap-2 mb-4">
            <Shield size={16} className="text-brand-primary" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
              Institutional Security Standards
            </p>
          </motion.div>
          <motion.h1 {...fadeUp(0.1)} className="text-5xl md:text-5xl font-display font-bold tracking-tight">
            Security <span className="italic text-brand-primary">Architecture</span>
          </motion.h1>
          <motion.p {...fadeUp(0.2)} className="text-muted text-xl max-w-3xl mx-auto font-medium">
            A comprehensive overview of the cryptographic safeguards and decentralized infrastructure protecting your digital legacy.
          </motion.p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-32">
           {pillars.map((pillar, i) => (
             <motion.div key={i} {...fadeUp(0.3 + i * 0.1)}>
                <Card className="p-10 bg-surface/40 hover:border-brand-primary/30 transition-all h-full">
                   <div className="w-14 h-14 rounded-2xl bg-page border border-base flex items-center justify-center mb-8">
                      {pillar.icon}
                   </div>
                   <h3 className="text-2xl font-display font-bold mb-4">{pillar.title}</h3>
                   <p className="text-primary0 leading-relaxed font-medium">
                      {pillar.description}
                   </p>
                </Card>
             </motion.div>
           ))}
        </div>

        {/* Technical Deep Dive Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
           <motion.div {...fadeUp(0.6)} className="space-y-12">
              <div className="space-y-4">
                 <h2 className="text-4xl font-display font-bold">The <span className="text-brand-primary italic">Transfer Legacy</span> Protocol Stack</h2>
                 <p className="text-muted font-medium leading-relaxed">Our protocol operates on a four-layer security model designed to withstand both conventional cyber threats and future quantum computing advancements.</p>
              </div>
              
              <div className="space-y-8">
                 {[
                   { label: "Transport Layer", desc: "TLS 1.3 with Perfect Forward Secrecy.", icon: <Zap size={20} /> },
                   { label: "Encryption Layer", desc: "AES-256-GCM with hardware-backed key storage.", icon: <Server size={20} /> },
                   { label: "Verification Layer", desc: "Decentralized ID (DID) with biometric anchoring.", icon: <CheckCircle2 size={20} /> }
                 ].map((item, i) => (
                   <div key={i} className="flex gap-6 items-start">
                      <div className="w-10 h-10 rounded-xl bg-surface border border-base flex items-center justify-center shrink-0 text-brand-primary">
                         {item.icon}
                      </div>
                      <div>
                         <h4 className="text-lg font-display font-bold">{item.label}</h4>
                         <p className="text-sm text-primary0 font-medium">{item.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </motion.div>
           <motion.div {...fadeUp(0.7)} className="relative">
              <Card className="p-8 bg-black/40 border-brand-primary/20 rounded-[40px] font-mono text-[13px] text-brand-primary leading-relaxed shadow-2xl">
                 <div className="flex items-center gap-2 mb-6 border-b border-brand-primary/20 pb-4">
                    <Terminal size={18} />
                    <span className="uppercase tracking-widest font-bold">Protocol Initialization Trace</span>
                 </div>
                 <div className="space-y-2">
                    <p className="text-obsidian-700">{`> initializing_vault_protocol_v2.4.0`}</p>
                    <p>{`> generating_key_shards [32/32] COMPLETE`}</p>
                    <p>{`> anchoring_did_to_chain [ETHEREUM_L2] ... OK`}</p>
                    <p>{`> encrypting_metadata_with_master_key [AES-256-GCM]`}</p>
                    <p className="text-brand-gold">{`> waiting_for_guardian_verification_quorum [2/3]`}</p>
                    <p className="animate-pulse">{`> status: SECURED_BY_ZK_ARCHITECTURE`}</p>
                 </div>
              </Card>
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-brand-primary/10 blur-[100px] pointer-events-none" />
           </motion.div>
        </div>

        {/* Global Compliance Badges */}
        <motion.div {...fadeUp(0.8)} className="bg-surface/30 border border-base rounded-[48px] p-12 text-center">
           <h3 className="text-2xl font-display font-bold mb-10">Institutional Certifications</h3>
           <div className="flex flex-wrap justify-center gap-12 opacity-60">
              {/* Simplified logos/labels for compliance */}
              {["SOC2 TYPE II READY", "GDPR COMPLIANT", "ISO 27001 ALIGNED", "NIST SP 800-63B", "FINRA ALIGNED"].map((badge, i) => (
                <div key={i} className="text-[10px] font-bold uppercase tracking-[0.3em] text-obsidian-700">
                   {badge}
                </div>
              ))}
           </div>
        </motion.div>
      </div>
    </div>
  );
}
