import SEO from '../../components/seo/SEO';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Search, HelpCircle, Shield, Key, Users, MessageSquare } from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
});

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      category: "Security",
      question: "Is my data really encrypted on the client side?",
      answer: "Absolutely. We use industry-standard AES-256 encryption. Your master key never leaves your device. When you save an asset, it is encrypted locally before being transmitted to our secure institutional nodes."
    },
    {
      category: "Guardians",
      question: "How many guardians should I choose?",
      answer: "We recommend a minimum of 3 guardians. This allows for a 2-of-3 quorum, providing a balance between security and accessibility. For institutional accounts, a 3-of-5 structure is optimal."
    },
    {
      category: "Recovery",
      question: "What happens if I lose access to my own devices?",
      answer: "If you lose your primary devices, your designated guardians can initiate a decentralized recovery protocol. Once the required quorum of guardians verifies the request, your vault fragments are reconstructed to grant you access."
    },
    {
      category: "Trust",
      question: "Can Transfer Legacy staff access my vault?",
      answer: "No. Our zero-knowledge architecture means we do not hold your decryption keys. Even with a subpoena or physical access to our servers, your data remains an unreadable encrypted blob without your specific keys."
    },
    {
      category: "Legal",
      question: "Is this a replacement for a legal will?",
      answer: "Transfer Legacy is a technical succession layer. While it ensures your digital assets are physically transferred, we recommend consulting with legal counsel to ensure your overall estate plan is legally binding in your jurisdiction."
    }
  ];

  return (
    <div className="min-h-screen bg-page text-primary pt-24 pb-20">
      <SEO 
        title="Frequently Asked Questions (FAQ) | Transfer Legacy Protocol"
        description="Find clear answers to questions about how Transfer Legacy protects your private keys, seed phrases, and family inheritance."
        canonicalUrl="https://transferlegacy.com/resources/faq"
      />

      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center space-y-6 mb-20">
          <motion.div {...fadeUp(0)} className="flex items-center justify-center gap-2 mb-4">
            <HelpCircle size={16} className="text-brand-primary" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
              Protocol Support & FAQ
            </p>
          </motion.div>
          <motion.h1 {...fadeUp(0.1)} className="text-5xl md:text-5xl font-display font-bold tracking-tight">
            System <span className="italic text-brand-primary">FAQ</span>
          </motion.h1>
          <motion.div {...fadeUp(0.2)} className="relative max-w-xl mx-auto mt-8">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary" size={20} />
            <input 
              type="text" 
              placeholder="Search protocol help topics..."
              className="w-full bg-surface border border-base rounded-3xl pl-14 pr-6 py-5 text-sm text-primary focus:border-brand-primary/50 transition-all placeholder:text-muted shadow-2xl"
            />
          </motion.div>
        </div>

        {/* Categories */}
        <motion.div {...fadeUp(0.3)} className="flex flex-wrap justify-center gap-4 mb-16">
          {[
            { name: "Security", icon: <Shield size={14}/> },
            { name: "Guardians", icon: <Users size={14}/> },
            { name: "Recovery", icon: <Key size={14}/> },
            { name: "General", icon: <MessageSquare size={14}/> }
          ].map((cat, i) => (
            <button key={i} className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-surface border border-base text-[10px] font-bold uppercase tracking-widest hover:border-brand-primary/30 transition-all">
              {cat.icon} {cat.name}
            </button>
          ))}
        </motion.div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div key={i} {...fadeUp(0.4 + i * 0.05)}>
              <div 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className={`w-full text-left p-6 md:p-8 rounded-[32px] border transition-all cursor-pointer group ${
                  openIndex === i 
                  ? 'bg-surface/80 border-brand-primary/30 shadow-2xl' 
                  : 'bg-surface/30 border-base/60 hover:border-base'
                }`}
              >
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold text-brand-primary/60 font-mono uppercase tracking-widest">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-lg font-display font-bold group-hover:text-vault-50 transition-colors">
                      {faq.question}
                    </h3>
                  </div>
                  <div className={`shrink-0 p-2 rounded-full border border-base transition-transform duration-300 ${openIndex === i ? 'rotate-180 bg-brand-primary/10 border-brand-primary/30' : ''}`}>
                    {openIndex === i ? <Minus size={18} className="text-brand-primary" /> : <Plus size={18} className="text-secondary" />}
                  </div>
                </div>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-6 pb-2 text-secondary leading-relaxed font-medium text-[15px]">
                        <p className="mb-4">{faq.answer}</p>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-page border border-base text-[9px] font-bold uppercase tracking-widest text-secondary">
                          Category: {faq.category} Protocol
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Support CTA */}
        <motion.div {...fadeUp(0.8)} className="mt-24 text-center p-12 bg-brand-primary/5 rounded-[48px] border border-brand-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 blur-[80px] pointer-events-none" />
          <h3 className="text-2xl font-display font-bold mb-4">Still have protocol questions?</h3>
          <p className="text-muted mb-8 font-medium">Our institutional support team is available 24/7 for cryptographic consultation.</p>
          <div className="flex justify-center gap-4">
            <button className="px-10 py-4 rounded-2xl bg-brand-primary text-white text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-brand-primary/20">Contact Security Team</button>
            <button className="px-10 py-4 rounded-2xl bg-surface border border-base text-[11px] font-bold uppercase tracking-widest hover:border-brand-primary/30 transition-all">Visit Documentation</button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
