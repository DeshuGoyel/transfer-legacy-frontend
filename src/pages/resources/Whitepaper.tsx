import SEO from '../../components/seo/SEO';
import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Shield, Cpu, Lock, Globe, ArrowRight, CheckCircle2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
});

export default function Whitepaper() {
  const chapters = [
    {
      id: "01",
      title: "The Zero-Knowledge Mandate",
      description: "Why absolute privacy is the only viable foundation for digital asset succession."
    },
    {
      id: "02",
      title: "Shamir's Secret Sharing Implementation",
      description: "Our mathematical approach to decentralized key fragmentation and quorum-based recovery."
    },
    {
      id: "03",
      title: "Handshake Protocol Architecture",
      description: "The technical specifics of our multi-signature verification and time-lock mechanisms."
    },
    {
      id: "04",
      title: "Institutional Integration Layer",
      description: "Bridging the gap between legacy banking infrastructure and Web3 custody protocols."
    }
  ];

  return (
    <div className="min-h-screen bg-page text-primary pt-24 pb-20">
      <SEO 
        title="Technical Whitepaper | Decentralized Succession Architecture"
        description="Read the complete Transfer Legacy architecture whitepaper on decentralized proof-of-life, MPC, and multi-custody inheritance."
        canonicalUrl="https://transferlegacy.com/resources/whitepaper"
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <div className="space-y-8">
            <motion.div {...fadeUp(0)} className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
                Technical Specification v2.4.0
              </p>
            </motion.div>
            <motion.h1 {...fadeUp(0.1)} className="text-5xl md:text-5xl font-display font-bold tracking-tight leading-none">
              Security <span className="italic text-brand-primary">Whitepaper</span>
            </motion.h1>
            <motion.p {...fadeUp(0.2)} className="text-muted text-xl font-medium leading-relaxed">
              An in-depth analysis of the Transfer Legacy protocol architecture, cryptographic foundations, and security methodology.
            </motion.p>
            <motion.div {...fadeUp(0.3)} className="flex flex-wrap gap-4 pt-4">
              <Button variant="primary" className="h-14 px-10 text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-brand-primary/20">
                 <Download size={18} className="mr-2" /> Download PDF (1.2MB)
              </Button>
              <Button variant="secondary" className="h-14 px-10 text-[11px] font-bold uppercase tracking-widest border-base">
                 Read Abstract
              </Button>
            </motion.div>
          </div>
          <motion.div {...fadeUp(0.4)} className="relative aspect-square">
             <div className="absolute inset-0 bg-brand-primary/5 blur-[120px] rounded-full animate-pulse" />
             <Card className="absolute inset-0 bg-surface/30 border-base/40 flex items-center justify-center backdrop-blur-3xl rounded-[64px]">
                <FileText size={240} className="text-brand-primary/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-48 h-48 bg-page border border-base rounded-full flex items-center justify-center shadow-2xl">
                      <Lock size={64} className="text-brand-primary" />
                   </div>
                </div>
             </Card>
          </motion.div>
        </div>

        {/* Abstract Section */}
        <motion.div {...fadeUp(0.5)} className="mb-32 max-w-4xl mx-auto bg-surface/20 border border-base/60 p-12 md:p-20 rounded-[48px] text-center">
           <h2 className="text-3xl font-display font-bold mb-8">Executive Summary</h2>
           <p className="text-muted text-lg leading-loose font-medium italic">
             "Transfer Legacy introduces a novel cryptographic framework for the succession of digital assets. By leveraging a zero-knowledge architecture combined with a proprietary implementation of Shamir's Secret Sharing, the protocol ensures high-fidelity asset transfer without compromising individual sovereignty or institutional compliance."
           </p>
        </motion.div>

        {/* Chapters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
           {chapters.map((chapter, i) => (
             <motion.div key={i} {...fadeUp(0.6 + i * 0.1)}>
                <Card className="p-10 bg-surface/40 hover:border-brand-primary/30 transition-all group h-full">
                   <div className="flex items-center justify-between mb-8">
                      <span className="text-4xl font-display font-bold text-brand-primary/20 group-hover:text-brand-primary/40 transition-colors">
                        {chapter.id}
                      </span>
                      <Cpu size={24} className="text-obsidian-700 group-hover:text-brand-primary transition-colors" />
                   </div>
                   <h3 className="text-2xl font-display font-bold mb-4">{chapter.title}</h3>
                   <p className="text-primary0 leading-relaxed font-medium mb-8">
                      {chapter.description}
                   </p>
                   <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-primary group-hover:gap-4 transition-all">
                      View Technical Specs <ArrowRight size={14} />
                   </button>
                </Card>
             </motion.div>
           ))}
        </div>

        {/* Institutional Verification */}
        <motion.div {...fadeUp(0.8)} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-12 bg-surface/30 border border-base rounded-[48px] relative overflow-hidden">
           <div className="absolute top-0 right-0 w-full h-full bg-aurora opacity-10 pointer-events-none" />
           <div className="space-y-6">
              <h3 className="text-3xl font-display font-bold">Protocol Audits & Verification</h3>
              <p className="text-muted font-medium">Our methodology is continuously audited by leading global cybersecurity firms to ensure the integrity of the institutional framework.</p>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-page border border-base">
                    <Shield size={16} className="text-trust-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary0">CertiK Audited</span>
                 </div>
                 <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-page border border-base">
                    <Globe size={16} className="text-brand-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary0">ISO 27001</span>
                 </div>
              </div>
           </div>
           <div className="grid grid-cols-2 gap-6">
              {[
                "Quantum-Resistant",
                "Self-Custodial",
                "GDPR Compliant",
                "Non-Custodial"
              ].map((spec, i) => (
                <div key={i} className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-primary">
                  <CheckCircle2 size={16} className="text-trust-500" /> {spec}
                </div>
              ))}
           </div>
        </motion.div>

        {/* Final CTA */}
        <div className="mt-32 text-center">
           <p className="text-muted font-bold uppercase tracking-[0.4em] mb-8 text-[11px]">Ready to implement the protocol?</p>
           <Button variant="primary" className="h-16 px-16 text-[11px] font-bold uppercase tracking-widest shadow-2xl shadow-brand-primary/30">
              Get Started with Institutional Vault
           </Button>
        </div>
      </div>
    </div>
  );
}
