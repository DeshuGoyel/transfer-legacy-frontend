import SEO from '../../components/seo/SEO';
import React from 'react';
import { motion } from 'framer-motion';
import { Scale, FileText, ShieldAlert, Globe, Clock, CheckCircle2 } from 'lucide-react';
import Card from '../../components/ui/Card';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
});

export default function TermsOfService() {
  const sections = [
    {
      title: "1. Institutional Agreement",
      content: "By accessing the Transfer Legacy protocol, you agree to comply with our zero-knowledge security standards and institutional usage mandates."
    },
    {
      title: "2. Cryptographic Sovereignty",
      content: "You acknowledge that Transfer Legacy does not hold, manage, or have access to your decryption keys. You are solely responsible for the security of your master key."
    },
    {
      title: "3. Service Availability",
      content: "We commit to a 99.99% uptime for our decentralized node network. However, protocol access depends on the mathematical integrity of the underlying blockchain networks."
    },
    {
      title: "4. User Responsibility",
      content: "Users must ensure that their designated guardians and heirs are aware of their roles and the technical requirements for protocol initiation."
    },
    {
      title: "5. Jurisdictional Compliance",
      content: "Our services are designed to be globally accessible, but users must comply with local regulations regarding digital asset succession in their specific jurisdiction."
    }
  ];

  return (
    <div className="min-h-screen bg-page text-primary pt-24 pb-20">
      <SEO 
        title="Terms of Service | Transfer Legacy Protocol"
        description="Review the terms governing the use of Transfer Legacy sovereign digital inheritance vault and smart succession services."
        canonicalUrl="https://transferlegacy.com/legal/terms"
      />

      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center space-y-6 mb-24">
          <motion.div {...fadeUp(0)} className="flex items-center justify-center gap-2 mb-4">
            <Scale size={16} className="text-brand-gold" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold">
              Legal Governance Framework
            </p>
          </motion.div>
          <motion.h1 {...fadeUp(0.1)} className="text-5xl md:text-5xl font-display font-bold tracking-tight">
            Terms of <span className="italic text-brand-primary">Service</span>
          </motion.h1>
          <motion.div {...fadeUp(0.2)} className="flex items-center justify-center gap-8 mt-8 text-[10px] font-bold uppercase tracking-widest text-obsidian-700">
             <span className="flex items-center gap-2"><Clock size={14} /> Last Updated: May 2026</span>
             <span className="flex items-center gap-2"><Globe size={14} /> Global Protocol v1.4</span>
          </motion.div>
        </div>

        {/* Content Section */}
        <div className="space-y-12 mb-24">
           {sections.map((section, i) => (
             <motion.section key={i} {...fadeUp(0.3 + i * 0.1)} className="space-y-4">
                <h3 className="text-xl font-display font-bold text-primary flex items-center gap-4">
                   <div className="w-8 h-8 rounded-lg bg-surface border border-base flex items-center justify-center text-[12px] font-bold text-brand-primary">
                      {i + 1}
                   </div>
                   {section.title}
                </h3>
                <p className="text-primary0 leading-relaxed font-medium pl-12">
                   {section.content}
                </p>
             </motion.section>
           ))}
        </div>

        {/* Legal Notice Card */}
        <motion.div {...fadeUp(0.8)}>
           <Card className="p-8 md:p-12 bg-surface/30 border-brand-gold/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 blur-[80px] pointer-events-none" />
              <div className="flex flex-col md:flex-row gap-8 items-start">
                 <div className="w-16 h-16 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center shrink-0">
                    <ShieldAlert size={28} className="text-brand-gold" />
                 </div>
                 <div className="space-y-4">
                    <h4 className="text-xl font-display font-bold">Important Legal Disclosure</h4>
                    <p className="text-sm text-primary0 leading-relaxed font-medium">
                       Transfer Legacy is a software provider and does not provide legal, financial, or tax advice. The use of this protocol does not create an attorney-client relationship. Always consult with a qualified professional in your jurisdiction before finalizing your estate plan.
                    </p>
                    <div className="flex flex-wrap gap-4 pt-2">
                       {["No Liability", "User-Controlled Keys", "Decentralized Governance"].map((item, i) => (
                         <div key={i} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-obsidian-700">
                           <CheckCircle2 size={14} className="text-brand-gold" /> {item}
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </Card>
        </motion.div>

        {/* Print / Download */}
        <div className="mt-20 flex justify-center gap-6">
           <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted hover:text-brand-primary transition-colors">
              <FileText size={16} /> Download Full Terms
           </button>
           <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted hover:text-brand-primary transition-colors">
              <Globe size={16} /> Local Jurisdictions
           </button>
        </div>
      </div>
    </div>
  );
}
