import React from 'react';
import { ShieldCheck, Lock, Eye, Scale } from 'lucide-react';
import { SEO } from '../../components/seo/SEO';

export default function PrivacyPolicy() {
  return (
    <div className="bg-page min-h-screen text-text">
      <SEO 
        title="Privacy Policy | Transfer Legacy"
        description="Our commitment to zero-knowledge privacy. Your data is encrypted locally and we never have access to your private keys or documents."
      />

      <section className="pt-32 pb-16 px-6 lg:px-8 border-b border-base bg-surface/30">
        <div className="max-w-4xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-8">
            <ShieldCheck size={24} />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold italic tracking-tighter mb-4">PRIVACY PROTOCOL.</h1>
          <p className="text-xl text-muted font-medium tracking-tight">Version 2.1 - Effective May 2026</p>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-8 max-w-4xl mx-auto prose prose-invert prose-emerald">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 not-prose">
          <div className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
            <h4 className="text-emerald-500 font-bold mb-2 flex items-center gap-2">
              <Lock size={16} /> Zero-Knowledge Policy
            </h4>
            <p className="text-xs text-muted leading-relaxed">We cannot see your data. Encryption happens on your device. We store only encrypted shards.</p>
          </div>
          <div className="p-6 rounded-2xl border border-brand-primary/20 bg-brand-primary/5">
            <h4 className="text-brand-primary font-bold mb-2 flex items-center gap-2">
              <Eye size={16} /> No Tracking
            </h4>
            <p className="text-xs text-muted leading-relaxed">No marketing cookies. No cross-site tracking. We prioritize your anonymity.</p>
          </div>
        </div>

        <h2>1. Our Privacy Philosophy</h2>
        <p>
          At Transfer Legacy, privacy is not a setting - it is the architecture. Our platform is built on the principle of <strong>Zero-Knowledge</strong>. This means we have mathematically engineered our systems so that we cannot access your sensitive data even if we were legally compelled to do so.
        </p>

        <h2>2. Data Collection</h2>
        <p>We collect only the minimum data required to maintain your account and the Dead Man's Switch protocol:</p>
        <ul>
          <li><strong>Account Metadata:</strong> Email address (for check-ins) and subscription status.</li>
          <li><strong>Encrypted Shards:</strong> Your vault data is fragmented and encrypted locally. We store only these encrypted blobs.</li>
          <li><strong>Log Data:</strong> Diagnostic logs used for performance optimization (Anonymized).</li>
        </ul>

        <h2>3. Use of Data</h2>
        <p>Your data is used solely for the purpose of executing your digital will. We do not sell, trade, or analyze your data for advertising purposes.</p>

        <h2>4. Institutional Security</h2>
        <p>We employ AES-256 GCM encryption and Shamir's Secret Sharing. Your data is distributed across multiple decentralized storage nodes (IPFS) to ensure 100-year reliability.</p>

        <div className="mt-20 p-8 rounded-[2rem] border border-base bg-raised not-prose flex flex-col md:flex-row items-center gap-8">
          <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary shrink-0">
            <Scale size={32} />
          </div>
          <div>
            <h4 className="text-xl font-bold italic mb-2">Legal Enforcement</h4>
            <p className="text-sm text-muted">For institutional inquiries or specific jurisdictional compliance questions, contact our legal team at <strong>legal@transferlegacy.com</strong></p>
          </div>
        </div>
      </section>
    </div>
  );
}
