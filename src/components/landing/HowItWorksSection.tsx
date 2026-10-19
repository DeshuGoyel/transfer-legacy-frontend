import React from 'react';

export default function HowItWorksSection() {
  return (
    <section id="how" className="py-32 px-6 md:px-16 bg-blueprint-bg relative z-10">
      <div className="max-w-3xl mx-auto text-center mb-20">
        <div className="inline-block border border-blueprint-or/30 text-blueprint-or px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8">
          How it works
        </div>
        <h2 className="font-display text-4xl md:text-5xl font-medium text-white mb-6">
          Four things working together<br/>for the first time.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        <div className="bg-blueprint-bg3 border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-colors group relative overflow-hidden">
          <div className="w-12 h-12 rounded-xl bg-blueprint-or/10 border border-blueprint-or/20 flex items-center justify-center mb-6 group-hover:bg-blueprint-or/20 transition-colors">
            <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-blueprint-or stroke-2 fill-none">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
          </div>
          <h3 className="font-display text-xl text-white font-medium mb-4">The Vault</h3>
          <p className="text-sm text-blueprint-muted2 leading-relaxed">
            Zero-knowledge encrypted storage for bank credentials, passwords, seed phrases, files, photos, and digital access instructions. We never see your data.
          </p>
        </div>
        
        <div className="bg-blueprint-bg3 border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-colors group relative overflow-hidden">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6 group-hover:bg-amber-500/20 transition-colors">
            <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-amber-500 stroke-2 fill-none">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
            </svg>
          </div>
          <h3 className="font-display text-xl text-white font-medium mb-4">Guardian System</h3>
          <p className="text-sm text-blueprint-muted2 leading-relaxed">
            Designate 1 to 5 trusted guardians - your spouse, lawyer, adult child. They hold conditional access that activates only when needed. No technical knowledge required.
          </p>
        </div>
        
        <div className="bg-blueprint-bg3 border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-colors group relative overflow-hidden">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
            <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-emerald-500 stroke-2 fill-none">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <h3 className="font-display text-xl text-white font-medium mb-4">Transfer Guide</h3>
          <p className="text-sm text-blueprint-muted2 leading-relaxed">
            Step-by-step heir experience. Your family accesses everything in under 10 minutes - even if they've never heard of a seed phrase, a password manager, or a 2FA code.
          </p>
        </div>

        <div className="bg-blueprint-bg3 border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-colors group relative overflow-hidden">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
            <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-blue-500 stroke-2 fill-none">
              <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
          </div>
          <h3 className="font-display text-xl text-white font-medium mb-4">Legacy Organiser</h3>
          <p className="text-sm text-blueprint-muted2 leading-relaxed">
            Living digital inventory - bank accounts, investments, subscriptions, domain names, online businesses, insurance policies. Updated by you, ready for your family.
          </p>
        </div>
      </div>
    </section>
  );
}
