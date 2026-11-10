import SEO from '../../components/seo/SEO';
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Zap, Fingerprint, CheckCircle2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
});

export default function VaultSecurity() {
  const securityFeatures = [
    {
      icon: <Lock className="text-brand-primary" />,
      title: "AES-256 Bit Encryption",
      description: "Military-grade encryption protocols securing every byte of your institutional vault."
    },
    {
      icon: <Eye className="text-brand-gold" />,
      title: "Zero-Knowledge Architecture",
      description: "We never see your keys. Your data is decrypted only on your authorized devices."
    },
    {
      icon: <Zap className="text-trust-500" />,
      title: "Shamir's Secret Sharing",
      description: "Keys are fragmented across your chosen network, requiring a quorum to reconstruct."
    }
  ];

  return (
    <div className="min-h-screen bg-page text-primary pt-24 pb-20">
      <SEO 
        title="Institutional Vault Security & Cryptography | Transfer Legacy"
        description="Explore our military-grade security architecture: AES-256 GCM encryption, Shamir Secret Sharing, and zero-knowledge client decryption."
        canonicalUrl="https://transferlegacy.com/features/vault-security"
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center space-y-6 mb-20">
          <motion.div {...fadeUp(0)} className="flex items-center justify-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-brand-primary shadow-[0_0_10px_rgba(79,92,255,0.8)]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
              Institutional Security Protocol
            </p>
          </motion.div>
          <motion.h1 {...fadeUp(0.1)} className="text-5xl md:text-5xl font-display font-bold tracking-tight">
            Vault <span className="italic text-brand-primary">Security</span>
          </motion.h1>
          <motion.p {...fadeUp(0.2)} className="text-muted text-lg max-w-2xl mx-auto font-medium">
            Discover the multi-layered cryptographic defense system protecting the world's most sensitive digital legacies.
          </motion.p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {securityFeatures.map((feature, i) => (
            <motion.div key={i} {...fadeUp(0.3 + i * 0.1)}>
              <Card className="p-8 h-full bg-surface/40 hover:border-brand-primary/30 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-page border border-base flex items-center justify-center mb-6 group-hover:bg-brand-primary/10 transition-all">
                  {React.cloneElement(feature.icon as React.ReactElement, { size: 24 })}
                </div>
                <h3 className="text-xl font-display font-bold mb-3">{feature.title}</h3>
                <p className="text-sm text-primary0 leading-relaxed font-medium">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Deep Dive Section */}
        <motion.div {...fadeUp(0.6)} className="relative rounded-[48px] bg-surface/30 border border-base p-8 md:p-16 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 blur-[100px] pointer-events-none" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-5xl font-display font-bold leading-tight">
                Advanced <span className="text-brand-primary italic">Handshake</span> Verification
              </h2>
              <p className="text-muted leading-relaxed font-medium">
                Our protocol ensures that no single entity can access your vault. Recovery is only possible through a verified multi-signature process involving your designated heirs and trusted guardians.
              </p>
              <ul className="space-y-4">
                {[
                  "Biometric Identity Verification",
                  "Hardware Security Module (HSM) Integration",
                  "Real-time Threat Monitoring",
                  "Automated Protocol Audits"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-primary">
                    <CheckCircle2 size={16} className="text-trust-500" /> {item}
                  </li>
                ))}
              </ul>
              <Button variant="primary" className="h-12 px-10 text-[10px] font-bold uppercase tracking-widest">
                Start Security Audit
              </Button>
            </div>
            <div className="relative">
               <div className="aspect-square bg-page border border-base rounded-[40px] shadow-2xl flex items-center justify-center overflow-hidden">
                  <Fingerprint size={160} className="text-brand-primary/20 animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-to-t from-page via-transparent to-transparent" />
               </div>
               {/* Floating elements */}
               <div className="absolute -top-8 -right-8 p-6 bg-surface/80 border border-base rounded-2xl backdrop-blur-xl shadow-2xl">
                  <ShieldCheck size={32} className="text-trust-500" />
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ShieldCheck({ size, className }: { size: number, className: string }) {
  return <Shield size={size} className={className} />;
}
