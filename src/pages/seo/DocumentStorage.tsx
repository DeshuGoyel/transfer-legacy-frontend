import React from 'react';
import { motion } from 'framer-motion';
import SEO from '../../components/seo/SEO';
import { ArrowRight, Shield, FileCheck, CheckCircle2, FileText, Lock } from 'lucide-react';
import Button from '../../components/ui/Button';

const DocumentStorage = () => {
  
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
        "name": "Document Storage",
        "item": "https://transferlegacy.com/store-important-documents-for-family"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-page text-primary pt-24 pb-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-aurora opacity-30 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 blur-[120px] pointer-events-none" />

      <SEO 
        title="Secure Document Storage for Families: Protect Your Critical Files"
        description="Learn the institutional standard for secure document storage. Protect your birth certificates, deeds, and legal papers with Transfer Legacy's encrypted vaults."
        canonical="https://transferlegacy.com/store-important-documents-for-family"
        schema={breadcrumbSchema}
      />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 px-4 py-2 rounded-full mb-8 shadow-[0_0_20px_rgba(79,92,255,0.1)]"
          >
            <FileText className="w-4 h-4" />
            <span className="font-bold tracking-[0.2em] uppercase text-[10px]">Secure Documentation Guide</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-8 leading-[0.95] tracking-tight text-primary">
            Sovereign <span className="italic text-brand-primary">Document Vaults</span>
          </h1>
          
          <p className="text-xl text-secondary mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            Your most important physical documents deserve institutional-grade digital protection. Learn how to bridge the physical-digital divide for your family's heritage.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" size="lg" className="px-10 h-14 text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-brand-primary/20">
              Initialize Your Vault <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="space-y-16">
          <section className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[32px] p-8 md:p-12">
            <h2 className="flex items-center text-3xl font-display font-bold mb-8 text-primary tracking-tight">
              <Lock className="w-8 h-8 mr-4 text-brand-primary" />
              Beyond Google Drive
            </h2>
            <div className="prose prose-invert max-w-none text-secondary">
              <p className="text-lg leading-relaxed mb-6">
                Standard cloud storage (Google Drive, Dropbox) is built for convenience, not inheritance. If you lose access to your account, your family has almost <span className="text-primary font-bold">Zero Chance</span> of recovering your files through customer support.
              </p>
              <p className="text-lg leading-relaxed">
                Transfer Legacy's vault is built on <span className="italic text-brand-primary font-bold">Zero-Knowledge Architecture</span>. We provide the technical assurance that your files are encrypted and only accessible to your verified heirs upon a protocol trigger.
              </p>
            </div>
          </section>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[32px] p-8">
              <FileCheck className="w-10 h-10 text-brand-gold mb-6" />
              <h3 className="text-xl font-display font-bold mb-4 text-primary">Verified Release</h3>
              <p className="text-secondary text-sm leading-relaxed mb-6">
                Our protocol ensures that sensitive documents like <span className="text-primary font-bold">Birth Certificates, Property Deeds, and Trust Documents</span> are only released after a multi-layered identity verification of your heirs.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                <CheckCircle2 size={14} /> Multi-Sig Verified
              </div>
            </div>

            <div className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[32px] p-8 border-brand-primary/20 bg-brand-primary/5">
              <Shield className="w-10 h-10 text-brand-primary mb-6" />
              <h3 className="text-xl font-display font-bold mb-4 text-primary">Tamper-Proof Storage</h3>
              <p className="text-secondary text-sm leading-relaxed mb-6">
                Every file upload is hashed and timestamped on our private audit log, providing <span className="text-primary font-bold">Mathematical Proof</span> of the document's existence and integrity.
              </p>
              <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-widest text-brand-primary p-0">
                View Security Audit
              </Button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-brand-primary to-blue-900 text-obsidian-950 rounded-[40px] p-10 md:p-16 text-center shadow-2xl shadow-brand-primary/20">
            <h3 className="text-3xl md:text-5xl font-display font-bold mb-6 tracking-tight leading-none">
              Protect Your <br /><span className="italic">Critical Documents</span>
            </h3>
            <p className="text-xl opacity-90 mb-12 max-w-2xl mx-auto font-medium">
              Initialize your Sovereign Vault and ensure your family's history is never lost.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button onClick={() => window.scrollTo(0,0)} className="bg-obsidian-950 text-white hover:bg-obsidian-900 px-12 h-16 rounded-2xl text-[12px] font-bold uppercase tracking-widest">
                Start Document Vault
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentStorage;
