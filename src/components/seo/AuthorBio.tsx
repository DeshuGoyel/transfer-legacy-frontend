import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export const authorPersonSchema = {
  "@type": "Person",
  "name": "Vikash Kumar Singh",
  "jobTitle": "Co-Founder & Lead Security Systems Engineer",
  "worksFor": {
    "@type": "Organization",
    "name": "Transfer Legacy",
    "url": "https://transferlegacy.com"
  },
  "image": "https://transferlegacy.com/images/author_vikash.png",
  "sameAs": [
    "https://github.com/ItsMeVikashKumarSingh/",
    "https://x.com/encrypted_ghost",
    "https://www.linkedin.com/in/itsmevikashkumarsingh"
  ]
};

interface AuthorBioProps {
  className?: string;
  publishDate?: string;
  readTime?: string;
}

export const AuthorBio: React.FC<AuthorBioProps> = ({ 
  className = "", 
  publishDate = "November 2026", 
  readTime = "6 min read" 
}) => {
  return (
    <aside 
      itemScope 
      itemType="https://schema.org/Person" 
      className={`my-12 p-6 md:p-8 rounded-[28px] bg-surface/40 backdrop-blur-md border border-base/60 shadow-xl relative overflow-hidden ${className}`}
    >
      {/* Background glow accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10">
        {/* Author Portrait */}
        <div className="relative shrink-0">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 border-brand-primary/30 shadow-[0_0_25px_rgba(79,92,255,0.2)] bg-surface">
            <img 
              itemProp="image"
              src="/images/author_vikash.png" 
              alt="Vikash Kumar Singh — Co-Founder & Security Systems Engineer at Transfer Legacy" 
              className="w-full h-full object-cover object-top"
              loading="lazy"
            />
          </div>
          <div 
            title="Verified Cryptographic Engineer" 
            className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-trust-500 border-2 border-page flex items-center justify-center text-white shadow-md"
          >
            <ShieldCheck size={14} className="stroke-[2.5]" />
          </div>
        </div>

        {/* Author Bio Info */}
        <div className="flex-1 space-y-2.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <h3 itemProp="name" className="text-xl md:text-2xl font-display font-bold text-primary tracking-tight">
              Vikash Kumar Singh
            </h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-brand-primary/10 border border-brand-primary/20 text-brand-primary">
              <CheckCircle2 size={11} /> Co-Founder &amp; Security Architect
            </span>
          </div>

          <p itemProp="description" className="text-xs md:text-sm text-secondary leading-relaxed font-normal max-w-2xl">
            Specializing in zero-knowledge cryptographic proofs, client-side encryption, and decentralized succession architecture. Building institutional-grade estate protocols for self-custodial digital wealth.
          </p>

          <div className="pt-1 flex flex-wrap items-center justify-between gap-4 text-xs">
            {/* Meta Tags */}
            <div className="flex items-center gap-3 text-secondary/70 text-[11px] font-mono">
              <span>Published: {publishDate}</span>
              <span>•</span>
              <span>{readTime}</span>
              <span>•</span>
              <span className="text-trust-500 font-semibold">Peer-Reviewed</span>
            </div>

            {/* Social / E-E-A-T Links */}
            <div className="flex items-center gap-3">
              {/* GitHub */}
              <a 
                itemProp="sameAs"
                href="https://github.com/ItsMeVikashKumarSingh/" 
                target="_blank" 
                rel="author noopener noreferrer"
                aria-label="Vikash Kumar Singh on GitHub"
                className="w-8 h-8 rounded-lg bg-surface border border-base/80 hover:border-brand-primary/60 flex items-center justify-center text-secondary hover:text-primary transition-all duration-200"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
              </a>

              {/* X / Twitter */}
              <a 
                itemProp="sameAs"
                href="https://x.com/encrypted_ghost" 
                target="_blank" 
                rel="author noopener noreferrer"
                aria-label="Vikash Kumar Singh on X"
                className="w-8 h-8 rounded-lg bg-surface border border-base/80 hover:border-brand-primary/60 flex items-center justify-center text-secondary hover:text-primary transition-all duration-200"
              >
                <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              {/* LinkedIn */}
              <a 
                itemProp="sameAs"
                href="https://www.linkedin.com/in/itsmevikashkumarsingh" 
                target="_blank" 
                rel="author noopener noreferrer"
                aria-label="Vikash Kumar Singh on LinkedIn"
                className="w-8 h-8 rounded-lg bg-surface border border-base/80 hover:border-brand-primary/60 flex items-center justify-center text-secondary hover:text-primary transition-all duration-200"
              >
                <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AuthorBio;
