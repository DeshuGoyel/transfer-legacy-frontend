import React from 'react';
import { motion } from 'framer-motion';
import SEO from '../../components/seo/SEO';
import { ArrowRight, Shield, BookOpen, CheckCircle2, Lock, Key } from 'lucide-react';
import Button from '../../components/ui/Button';

const PasswordInheritance = () => {
  
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://transferlegacy.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Resources",
        "item": "https://transferlegacy.com/resources"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Password Inheritance",
        "item": "https://transferlegacy.com/password-inheritance"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-page text-primary pt-24 pb-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-aurora opacity-30 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 blur-[120px] pointer-events-none" />

      <SEO 
        title="Password Inheritance Guide: Passing Digital Access Securely"
        description="Don't lose access to your digital life. Learn how to securely pass passwords, 2FA codes, and vault access to your heirs with Transfer Legacy."
        canonical="https://transferlegacy.com/password-inheritance"
        schema={breadcrumbSchema}
      />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 px-4 py-2 rounded-full mb-8 shadow-[0_0_20px_rgba(79,92,255,0.1)]"
          >
            <Lock className="w-4 h-4" />
            <span className="font-bold tracking-[0.2em] uppercase text-[10px]">Digital Access Guide</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-8 leading-[0.95] tracking-tight text-primary">
            The Password <span className="italic text-brand-primary">Inheritance</span> Protocol
          </h1>
          
          <p className="text-xl text-secondary mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            Your digital life is locked behind passwords and 2FA. If you don't plan for their succession, your memories, accounts, and assets are permanently inaccessible.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" size="lg" className="px-10 h-14 text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-brand-primary/20">
              Secure Your Access <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="space-y-16">
          <section className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[32px] p-8 md:p-12">
            <h2 className="flex items-center text-3xl font-display font-bold mb-8 text-primary tracking-tight">
              <Key className="w-8 h-8 mr-4 text-brand-primary" />
              The 2FA Deadlock
            </h2>
            <div className="prose prose-invert max-w-none text-secondary">
              <p className="text-lg leading-relaxed mb-6">
                Most modern accounts use <span className="text-primary font-bold">Two-Factor Authentication (2FA)</span>. Even if your family has your master password, they cannot bypass your phone's biometrics or authenticator apps. This creates a "Deadlock" that traditional probate cannot solve.
              </p>
              <p className="text-lg leading-relaxed">
                Transfer Legacy's <span className="italic text-brand-primary font-bold">Emergency Vault</span> allows you to store backup codes, recovery phrases, and authenticator seeds in a zero-knowledge environment that only releases during a verified status event.
              </p>
            </div>
          </section>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[32px] p-8">
              <Shield className="w-10 h-10 text-brand-gold mb-6" />
              <h3 className="text-xl font-display font-bold mb-4 text-primary">Zero-Knowledge Storage</h3>
              <p className="text-secondary text-sm leading-relaxed mb-6">
                Your passwords are encrypted with <span className="text-primary font-bold">Client-Side AES-256</span>. We never see your data. We only facilitate the secure handover based on your predefined triggers.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                <CheckCircle2 size={14} /> Locally Encrypted
              </div>
            </div>

            <div className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[32px] p-8 border-brand-primary/20 bg-brand-primary/5">
              <BookOpen className="w-10 h-10 text-brand-primary mb-6" />
              <h3 className="text-xl font-display font-bold mb-4 text-primary">Access Management</h3>
              <p className="text-secondary text-sm leading-relaxed mb-6">
                Define who gets access to what. You can give your spouse access to financial credentials and your children access to photos and social memories, ensuring the right people get the right data.
              </p>
              <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-widest text-brand-primary p-0">
                Configure Access Segregation
              </Button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-brand-primary to-blue-900 text-obsidian-950 rounded-[40px] p-10 md:p-16 text-center shadow-2xl shadow-brand-primary/20">
            <h3 className="text-3xl md:text-5xl font-display font-bold mb-6 tracking-tight leading-none">
              Don't Let Your <span className="italic">Digital Life</span> Be Locked
            </h3>
            <p className="text-xl opacity-90 mb-12 max-w-2xl mx-auto font-medium">
              Initialize your Password Succession Protocol and ensure your heirs never lose access.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button onClick={() => window.scrollTo(0,0)} className="bg-obsidian-950 text-white hover:bg-obsidian-900 px-12 h-16 rounded-2xl text-[12px] font-bold uppercase tracking-widest">
                Start My Access Vault
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordInheritance;
