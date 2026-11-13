import SEO from '../../components/seo/SEO';
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, EyeOff, Key, Database, Globe, CheckCircle2, Lock } from 'lucide-react';
import Card from '../../components/ui/Card';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
});

export default function PrivacyProtocol() {
  const principles = [
    {
      title: "Data Minimization",
      description: "We only collect the absolute minimum data required to execute the cryptographic protocol.",
      icon: <EyeOff size={24} className="text-brand-primary" />
    },
    {
      title: "End-to-End Encryption",
      description: "All sensitive information is encrypted on your device before it ever touches our servers.",
      icon: <Lock size={24} className="text-brand-gold" />
    },
    {
      title: "Self-Sovereign Identity",
      description: "You own your identity and your data. We have no master access to your vault.",
      icon: <Key size={24} className="text-trust-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-page text-primary pt-24 pb-20">
      <SEO 
        title="Zero-Knowledge Privacy Protocol & Policy | Transfer Legacy"
        description="Read how Transfer Legacy implements client-side encryption, zero-knowledge proofs, and zero personal data tracking."
        canonicalUrl="https://transferlegacy.com/legal/privacy"
      />

      <div className="max-w-5xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center space-y-6 mb-24">
          <motion.div {...fadeUp(0)} className="flex items-center justify-center gap-2 mb-4">
            <ShieldCheck size={16} className="text-brand-primary" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
              Data Privacy Protocol v2.1
            </p>
          </motion.div>
          <motion.h1 {...fadeUp(0.1)} className="text-5xl md:text-5xl font-display font-bold tracking-tight">
            Privacy <span className="italic text-brand-primary">Protocol</span>
          </motion.h1>
          <motion.p {...fadeUp(0.2)} className="text-muted text-lg max-w-2xl mx-auto font-medium">
            Our commitment to your digital sovereignty is hard-coded into the Transfer Legacy protocol.
          </motion.p>
        </div>

        {/* Core Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
           {principles.map((p, i) => (
             <motion.div key={i} {...fadeUp(0.3 + i * 0.1)}>
                <Card className="p-8 bg-surface/40 hover:border-brand-primary/30 transition-all h-full text-center">
                   <div className="w-12 h-12 rounded-xl bg-page border border-base flex items-center justify-center mx-auto mb-6">
                      {p.icon}
                   </div>
                   <h3 className="text-xl font-display font-bold mb-4">{p.title}</h3>
                   <p className="text-sm text-primary0 leading-relaxed font-medium">
                      {p.description}
                   </p>
                </Card>
             </motion.div>
           ))}
        </div>

        {/* Detailed Sections */}
        <div className="space-y-20 mb-32">
           <motion.section {...fadeUp(0.6)} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-6">
                 <h2 className="text-3xl font-display font-bold">How We Protect <span className="text-brand-primary italic">Your Identity</span></h2>
                 <p className="text-muted font-medium leading-relaxed">Unlike traditional fintech platforms, we do not store your PII (Personally Identifiable Information) in a centralized database. Instead, we use Decentralized Identifiers (DIDs) that are anchored to secure blockchain layers.</p>
                 <ul className="space-y-4">
                    {["No centralized identity store", "Biometric hashes are local only", "Zero-Knowledge proofs for verification"].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm font-bold text-primary0">
                         <CheckCircle2 size={18} className="text-brand-primary" /> {item}
                      </li>
                    ))}
                 </ul>
              </div>
              <Card className="p-8 bg-surface/20 border-base/40 flex items-center justify-center">
                 <Database size={160} className="text-obsidian-800" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <ShieldCheck size={64} className="text-brand-primary animate-pulse" />
                 </div>
              </Card>
           </motion.section>

           <motion.section {...fadeUp(0.7)} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <Card className="order-2 lg:order-1 p-8 bg-surface/20 border-base/40 flex items-center justify-center">
                 <Globe size={160} className="text-obsidian-800" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <CheckCircle2 size={64} className="text-trust-500" />
                 </div>
              </Card>
              <div className="order-1 lg:order-2 space-y-6">
                 <h2 className="text-3xl font-display font-bold">Global <span className="text-brand-gold italic">Data Sovereignty</span></h2>
                 <p className="text-muted font-medium leading-relaxed">We comply with global privacy regulations (GDPR, CCPA, PDP) by ensuring that your data residency is under your control. Our node network is physically distributed to prevent jurisdictional overreach.</p>
                 <ul className="space-y-4">
                    {["Automatic right to be forgotten", "Encryption key rotation protocols", "Transparent protocol audits"].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm font-bold text-primary0">
                         <CheckCircle2 size={18} className="text-brand-gold" /> {item}
                      </li>
                    ))}
                 </ul>
              </div>
           </motion.section>
        </div>

        {/* Footer CTA */}
        <motion.div {...fadeUp(0.8)} className="text-center p-12 bg-surface/30 border border-base rounded-[48px]">
           <h3 className="text-2xl font-display font-bold mb-6">Your privacy is our protocol.</h3>
           <p className="text-muted mb-10 max-w-xl mx-auto font-medium">For more detailed cryptographic proofs, please refer to our Security Whitepaper or contact our privacy office.</p>
           <div className="flex justify-center gap-4">
              <button className="px-8 py-3 rounded-xl bg-surface border border-base text-[10px] font-bold uppercase tracking-widest hover:border-brand-primary/30 transition-all">Download Privacy Policy</button>
              <button className="px-8 py-3 rounded-xl bg-surface border border-base text-[10px] font-bold uppercase tracking-widest hover:border-brand-primary/30 transition-all">Security Whitepaper</button>
           </div>
        </motion.div>
      </div>
    </div>
  );
}
