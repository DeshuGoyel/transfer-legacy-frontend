import SEO from '../../components/seo/SEO';
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Key, Users, Shield, Clock, ArrowRight, Download, Search } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
});

export default function ResourceGuides() {
  const guides = [
    {
      category: "Foundations",
      title: "Introduction to Digital Succession",
      description: "Learn the fundamentals of securing your digital legacy in the decentralized age.",
      time: "10 min read",
      icon: <BookOpen className="text-brand-primary" />
    },
    {
      category: "Security",
      title: "Mastering Shamir's Secret Sharing",
      description: "A deep dive into the mathematics of decentralized key management.",
      time: "15 min read",
      icon: <Key className="text-brand-gold" />
    },
    {
      category: "Trust",
      title: "Choosing Your Digital Guardians",
      description: "How to select and onboard the right people to protect your vault.",
      time: "8 min read",
      icon: <Users className="text-trust-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-page text-primary pt-24 pb-20">
      <SEO 
        title="Institutional Guides & Handbooks | Transfer Legacy"
        description="Access sovereign estate planning guides, attorney checklists, and wallet recovery templates."
        canonicalUrl="https://transferlegacy.com/resources/guides"
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-20">
          <div className="space-y-6">
            <motion.div {...fadeUp(0)} className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-brand-primary shadow-[0_0_10px_rgba(79,92,255,0.8)]" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
                Institutional Knowledge Base
              </p>
            </motion.div>
            <motion.h1 {...fadeUp(0.1)} className="text-5xl md:text-5xl font-display font-bold tracking-tight">
              Protocol <span className="italic text-brand-primary">Guides</span>
            </motion.h1>
            <motion.p {...fadeUp(0.2)} className="text-muted text-lg max-w-xl font-medium">
              Step-by-step instructions and deep dives into the Transfer Legacy ecosystem.
            </motion.p>
          </div>
          <motion.div {...fadeUp(0.3)} className="w-full md:w-96 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-brand-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search protocol documentation..."
              className="w-full bg-surface border border-base rounded-2xl pl-12 pr-4 py-4 text-sm text-primary focus:border-brand-primary/50 transition-all placeholder:text-muted"
            />
          </motion.div>
        </div>

        {/* Featured Guide */}
        <motion.div {...fadeUp(0.4)} className="relative group cursor-pointer mb-24">
          <Card className="p-0 overflow-hidden border-brand-primary/20 bg-surface/40 hover:border-brand-primary/40 transition-all">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 md:p-16 space-y-8">
                <div className="inline-flex px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-[10px] font-bold uppercase tracking-widest text-brand-primary">
                  Masterclass
                </div>
                <h2 className="text-3xl md:text-5xl font-display font-bold leading-tight group-hover:text-vault-50 transition-colors">
                  The Institutional <span className="italic text-brand-primary">100-Year</span> Digital Legacy Plan
                </h2>
                <p className="text-muted leading-relaxed font-medium">
                  Our flagship guide on architecting a generational digital estate that survives technology shifts, legal changes, and geopolitical events.
                </p>
                <div className="flex items-center gap-6">
                  <Button variant="primary" className="h-12 px-10 text-[10px] font-bold uppercase tracking-widest">
                    Read Guide <ArrowRight size={16} className="ml-2" />
                  </Button>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted flex items-center gap-2">
                    <Clock size={14} /> 25 Min Read
                  </span>
                </div>
              </div>
              <div className="bg-page/50 border-l border-base flex items-center justify-center p-12">
                <Shield size={160} className="text-brand-primary/20 animate-pulse" />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {guides.map((guide, i) => (
            <motion.div key={i} {...fadeUp(0.5 + i * 0.1)}>
              <Card className="p-8 h-full bg-surface/40 hover:border-brand-primary/30 transition-all group cursor-pointer">
                <div className="flex justify-between items-start mb-8">
                  <div className="w-12 h-12 rounded-xl bg-page border border-base flex items-center justify-center group-hover:bg-brand-primary/10 transition-all">
                    {React.cloneElement(guide.icon as React.ReactElement, { size: 20 })}
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-muted">{guide.time}</span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-primary mb-2">{guide.category}</p>
                <h3 className="text-xl font-display font-bold mb-4 group-hover:text-vault-50 transition-colors">{guide.title}</h3>
                <p className="text-sm text-secondary leading-relaxed font-medium mb-8">
                  {guide.description}
                </p>
                <div className="flex items-center text-[10px] font-bold uppercase tracking-widest text-brand-primary group-hover:gap-2 transition-all">
                  Read Protocol <ArrowRight size={14} className="ml-1" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* PDF Resources */}
        <motion.div {...fadeUp(0.8)} className="bg-surface/30 border border-base rounded-[40px] p-8 md:p-12 text-center">
          <h3 className="text-2xl font-display font-bold mb-8">Downloadable Institutional Toolkits</h3>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              "Guardian Onboarding Kit",
              "Heir Verification Checklist",
              "Zero-Knowledge Technical Spec",
              "Institutional Compliance PDF"
            ].map((tool, i) => (
              <button key={i} className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-page border border-base hover:border-brand-primary/30 transition-all group">
                <Download size={18} className="text-brand-primary group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-secondary">{tool}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
