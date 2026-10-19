import React from 'react';
import { motion } from 'framer-motion';
import SEO from '../../components/seo/SEO';
import { ArrowRight, Shield, BookOpen, AlertTriangle, Landmark, CheckCircle2, Key, Fingerprint } from 'lucide-react';
import Button from '../../components/ui/Button';

const SeedPhraseInheritance = () => {
  return (
    <div className="min-h-screen bg-page text-primary pt-24 pb-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-aurora opacity-30 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 blur-[120px] pointer-events-none" />

      <SEO 
        title="Seed Phrase Inheritance: How to Securely Pass 12/24 Word Keys"
        description="Don't lose your crypto. Learn the most secure strategies for seed phrase inheritance, including Shamir's Secret Sharing and Transfer Legacy Vaults."
        canonical="https://transferlegacy.com/seed-phrase-inheritance"
      />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 px-4 py-2 rounded-full mb-8 shadow-[0_0_20px_rgba(79,92,255,0.1)]"
          >
            <Key className="w-4 h-4" />
            <span className="font-bold tracking-[0.2em] uppercase text-[10px]">Technical Security Guide</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-8 leading-[0.95] tracking-tight text-primary">
            The Seed Phrase <span className="italic text-brand-primary">Inheritance</span> Protocol
          </h1>
          
          <p className="text-xl text-secondary mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            Your 12 or 24-word recovery phrase is the ultimate master key. If your family doesn't have it, your crypto is gone. If they have it insecurely, your crypto is at risk.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" size="lg" className="px-10 h-14 text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-brand-primary/20">
              Secure Your Keys <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="space-y-16">
          <section className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[32px] p-8 md:p-12">
            <h2 className="flex items-center text-3xl font-display font-bold mb-8 text-primary tracking-tight">
              <Shield className="w-8 h-8 mr-4 text-brand-primary" />
              Why Paper Fails
            </h2>
            <div className="prose prose-invert max-w-none text-secondary">
              <p className="text-lg leading-relaxed mb-6">
                Storing your <span className="text-primary font-bold">Seed Phrase</span> on paper in a safe deposit box is a 20th-century solution for a 21st-century asset. Banks can deny access to heirs for months, and physical paper is vulnerable to fire, water, and degradation.
              </p>
              <p className="text-lg leading-relaxed">
                Worse, if you include a seed phrase in a traditional will, it becomes part of the <span className="italic text-brand-primary font-bold">Public Record</span> during probate. Hackers actively monitor probate filings for exactly this reason.
              </p>
            </div>
          </section>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[32px] p-8">
              <Fingerprint className="w-10 h-10 text-brand-gold mb-6" />
              <h3 className="text-xl font-display font-bold mb-4 text-primary">Digital Custody</h3>
              <p className="text-secondary text-sm leading-relaxed mb-6">
                Transfer Legacy uses <span className="text-primary font-bold">Zero-Knowledge Architecture</span>. Your seed phrase is encrypted locally and split across our secure network. Only your specific triggers can reunite and release the keys.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                <CheckCircle2 size={14} /> Local-Only Encryption
              </div>
            </div>

            <div className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[32px] p-8 border-brand-primary/20 bg-brand-primary/5">
              <Landmark className="w-10 h-10 text-brand-primary mb-6" />
              <h3 className="text-xl font-display font-bold mb-4 text-primary">Multi-Sig Guard</h3>
              <p className="text-secondary text-sm leading-relaxed mb-6">
                Appoint multiple <span className="text-primary font-bold">Guardians</span> who must reach a consensus before keys are released. They never see the keys - only the authorization to release them.
              </p>
              <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-widest text-brand-primary p-0">
                Learn about Quorum Release
              </Button>
            </div>
          </div>

          <section className="bg-obsidian-950/50 border border-brand-gold/20 rounded-[32px] p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <AlertTriangle size={120} className="text-brand-gold" />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl font-display font-bold mb-6 text-primary tracking-tight">The "Shamir" Alternative</h2>
              <p className="text-lg text-secondary leading-relaxed mb-8">
                For high-net-worth individuals, we support <span className="text-primary font-bold">Shamir's Secret Sharing</span>. This mathematically splits your key into multiple parts. You can give 1 part to your lawyer, 1 to your spouse, and keep 1 in your Transfer Legacy vault.
              </p>
              <div className="flex items-center gap-4 p-4 bg-brand-gold/10 rounded-2xl border border-brand-gold/20">
                <Shield className="text-brand-gold shrink-0" size={24} />
                <p className="text-sm font-medium text-brand-gold leading-tight">
                  Transfer Legacy automates the reconstruction of secret shares upon verified proof-of-life failure.
                </p>
              </div>
            </div>
          </section>

          <div className="bg-gradient-to-br from-brand-primary to-blue-900 text-obsidian-950 rounded-[40px] p-10 md:p-16 text-center shadow-2xl shadow-brand-primary/20">
            <BookOpen className="w-16 h-16 mx-auto mb-8 opacity-80" />
            <h3 className="text-3xl md:text-5xl font-display font-bold mb-6 tracking-tight leading-none">
              Initialize Your <br /><span className="italic">Key Recovery Vault</span>
            </h3>
            <p className="text-xl opacity-90 mb-12 max-w-2xl mx-auto font-medium">
              Join 10,000+ investors who trust Transfer Legacy to protect their master recovery keys.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button onClick={() => window.scrollTo(0,0)} className="bg-obsidian-950 text-white hover:bg-obsidian-900 px-12 h-16 rounded-2xl text-[12px] font-bold uppercase tracking-widest">
                Secure My Seed Phrase
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeedPhraseInheritance;
