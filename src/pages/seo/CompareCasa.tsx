import { motion } from 'framer-motion';
import SEO from '../../components/seo/SEO';
import { CheckCircle2, XCircle, Scale, Zap, Shield, ArrowRight } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';

const CompareCasa = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useStore();

  const comparisons = [
    {
      feature: "Asset Scope",
      legacy: "All Crypto, Seed Phrases, Passwords, Documents, Bank Logins",
      competitor: "Bitcoin & Ethereum Multisig Only"
    },
    {
      feature: "Hardware Requirements",
      legacy: "Zero required (Supports software & hardware secrets)",
      competitor: "Requires multiple specific hardware wallets (Coldcard/Ledger)"
    },
    {
      feature: "Inheritance Mechanism",
      legacy: "Automated Liveness Heartbeat + Guardian Quorum (SSS)",
      competitor: "Casa Covenant (Manual recovery key transfer)"
    },
    {
      feature: "Pricing Model",
      legacy: "Free Tier Available / $9 mo Pro (0% asset take)",
      competitor: "$250 to $1,000+ per month (Gold/Platinum tiers)"
    },
    {
      feature: "Custody Model",
      legacy: "100% Non-Custodial Zero-Knowledge Client-Side Encryption",
      competitor: "Collaborative Multisig (Casa holds 1 key)"
    },
    {
      feature: "Jurisdiction / Legal Logic",
      legacy: "Built-in US/UK/IN/UAE Estate Tax & Probate Directives",
      competitor: "Technical key recovery only (No legal logic)"
    }
  ];

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Transfer Legacy",
    "description": "Zero-knowledge cryptographic inheritance protocol and sovereign estate vault.",
    "brand": {
      "@type": "Brand",
      "name": "Transfer Legacy"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "128"
    }
  };

  return (
    <div className="min-h-screen bg-page text-primary pt-24 pb-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-aurora opacity-30 pointer-events-none" />

      <SEO
        title="Transfer Legacy vs. Casa (Casa Covenant): 2026 Comparison"
        description="Detailed comparison between Transfer Legacy and Casa Covenant. Discover why sovereign crypto investors choose Transfer Legacy for full-spectrum digital asset inheritance."
        canonicalUrl="https://transferlegacy.com/transfer-legacy-vs-casa"
        schema={productSchema}
      />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 px-4 py-2 rounded-full mb-8"
          >
            <Scale className="w-4 h-4" />
            <span className="font-bold tracking-[0.2em] uppercase text-[10px]">Technical Comparison</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-display font-bold mb-8 leading-[0.95] tracking-tight text-primary">
            Transfer Legacy <span className="italic text-brand-primary">vs. Casa</span>
          </h1>

          <p className="text-xl text-secondary mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            Casa is famous for collaborative Bitcoin multisig, but Casa Covenant costs thousands per year and only handles on-chain multisig keys. See how Transfer Legacy protects your entire digital estate.
          </p>
        </div>

        <div className="space-y-16">
          {/* Comparison Table */}
          <div className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[32px] overflow-hidden">
            <div className="grid grid-cols-3 bg-obsidian-950/50 p-6 border-b border-base/60">
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted">Feature</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-brand-primary text-center">Transfer Legacy</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted text-center">Casa Covenant</div>
            </div>
            {comparisons.map((item, index) => (
              <div key={index} className="grid grid-cols-3 p-6 border-b border-base/40 last:border-0 hover:bg-surface/50 transition-colors">
                <div className="text-[13px] font-bold text-primary flex items-center">{item.feature}</div>
                <div className="text-[12px] font-semibold text-emerald-400 text-center flex items-center justify-center gap-2">
                  <CheckCircle2 size={14} className="shrink-0" /> {item.legacy}
                </div>
                <div className="text-[12px] font-semibold text-secondary text-center flex items-center justify-center gap-2">
                  <XCircle size={14} className="text-red-400/50 shrink-0" /> {item.competitor}
                </div>
              </div>
            ))}
          </div>

          <section className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[32px] p-8 md:p-12 space-y-6">
            <h2 className="flex items-center text-3xl font-display font-bold text-primary tracking-tight">
              <Zap className="w-8 h-8 mr-4 text-brand-primary" />
              Beyond Just Multisig Bitcoin
            </h2>
            <p className="text-lg text-secondary leading-relaxed">
              While Casa requires your heirs to master complex multisig hardware ceremonies, Transfer Legacy allows sovereign investors to safeguard <span className="text-primary font-bold">every asset type</span>: hardware seed phrases, centralized exchange credentials (Coinbase, Binance), confidential financial documents, and personal directives.
            </p>
            <p className="text-lg text-secondary leading-relaxed">
              With our <span className="italic text-brand-primary font-bold">Zero-Knowledge Shamir Secret Engine</span>, your data is mathematically divided into cryptographic fragments distributed across your chosen guardians. No single guardian—and not even Transfer Legacy—can ever access your secrets until a verified succession event occurs.
            </p>
          </section>

          <div className="bg-gradient-to-br from-brand-primary to-blue-900 text-obsidian-950 rounded-[40px] p-10 md:p-16 text-center shadow-2xl shadow-brand-primary/20">
            <h3 className="text-3xl md:text-5xl font-display font-bold mb-6 tracking-tight leading-none">
              Protect Your Estate with <span className="italic">True Zero-Knowledge</span>
            </h3>
            <p className="text-lg font-medium mb-8 max-w-xl mx-auto opacity-90">
              Skip the $1,000/yr fees. Set up your zero-knowledge succession protocol in minutes.
            </p>
            <Button
              size="lg"
              variant="outline"
              className="bg-obsidian-950 text-white border-obsidian-950 hover:bg-obsidian-900 px-8 py-4 rounded-2xl"
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/onboarding')}
            >
              Start Free Vault Today <ArrowRight size={16} className="ml-2 inline" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareCasa;
