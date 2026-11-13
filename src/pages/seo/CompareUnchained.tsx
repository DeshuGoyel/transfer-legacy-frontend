import { motion } from 'framer-motion';
import SEO from '../../components/seo/SEO';
import { CheckCircle2, XCircle, Scale, Zap, ArrowRight } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';

const CompareUnchained = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useStore();

  const comparisons = [
    {
      feature: "Scope of Inheritance",
      legacy: "Complete Digital Estate (Keys, Exchanges, Documents, Passwords)",
      competitor: "Bitcoin-Only Collaborative Vaults"
    },
    {
      feature: "Cost / Ongoing Fees",
      legacy: "Free Tier / $9 mo Pro (Zero AUM fees)",
      competitor: "Inheritance Plan Setup ($1,000+) + Ongoing Custody/Annual Fees"
    },
    {
      feature: "Privacy Architecture",
      legacy: "Client-Side Zero-Knowledge Encryption (Mathematical Privacy)",
      competitor: "Requires full KYC verification and identity disclosure"
    },
    {
      feature: "Heir Onboarding Friction",
      legacy: "Decrypted guide & direct claim portal with localized instructions",
      competitor: "Heirs must complete full institutional KYC with Unchained"
    },
    {
      feature: "Dead Man's Switch Trigger",
      legacy: "Autonomous multi-frequency cryptographic heartbeats",
      competitor: "Manual reporting by family members to Unchained desk"
    }
  ];

  return (
    <div className="min-h-screen bg-page text-primary pt-24 pb-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-aurora opacity-30 pointer-events-none" />

      <SEO
        title="Transfer Legacy vs. Unchained Capital: Crypto Inheritance Compared"
        description="A technical comparison between Transfer Legacy and Unchained Capital inheritance plans. See why Transfer Legacy offers broader coverage, zero AUM fees, and true mathematical privacy."
        canonicalUrl="https://transferlegacy.com/transfer-legacy-vs-unchained"
      />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 px-4 py-2 rounded-full mb-8"
          >
            <Scale className="w-4 h-4" />
            <span className="font-bold tracking-[0.2em] uppercase text-[10px]">Comparative Analysis</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-display font-bold mb-8 leading-[0.95] tracking-tight text-primary">
            Transfer Legacy <span className="italic text-brand-primary">vs. Unchained</span>
          </h1>

          <p className="text-xl text-secondary mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            Unchained Capital provides excellent collaborative custody for Bitcoin-only portfolios, but real-world wealth includes altcoins, exchanges, passwords, and private legal documents.
          </p>
        </div>

        <div className="space-y-16">
          <div className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[32px] overflow-hidden">
            <div className="grid grid-cols-3 bg-obsidian-950/50 p-6 border-b border-base/60">
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted">Feature</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-brand-primary text-center">Transfer Legacy</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted text-center">Unchained Capital</div>
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
              Sovereign vs. Regulated Collaborative Custody
            </h2>
            <p className="text-lg text-secondary leading-relaxed">
              When working with Unchained, your heirs must go through a lengthy corporate onboarding and legal verification process with their client desk. If your jurisdiction isn't supported or regulatory policies change, delays can last months.
            </p>
            <p className="text-lg text-secondary leading-relaxed">
              Transfer Legacy operates on <span className="text-primary font-bold">cryptographic rules</span> rather than corporate discretion. Once your life verification heartbeat lapses and your designated guardian quorum approves the attestations, the encrypted shards reconstruct locally on your beneficiary's browser without intermediary delays.
            </p>
          </section>

          <div className="bg-gradient-to-br from-brand-primary to-blue-900 text-obsidian-950 rounded-[40px] p-10 md:p-16 text-center shadow-2xl shadow-brand-primary/20">
            <h3 className="text-3xl md:text-5xl font-display font-bold mb-6 tracking-tight leading-none">
              Complete Digital Asset <span className="italic">Succession</span>
            </h3>
            <p className="text-lg font-medium mb-8 max-w-xl mx-auto opacity-90">
              Do not leave half your digital footprint unprotected. Protect keys, accounts, and wills in one zero-knowledge vault.
            </p>
            <Button
              size="lg"
              variant="outline"
              className="bg-obsidian-950 text-white border-obsidian-950 hover:bg-obsidian-900 px-8 py-4 rounded-2xl"
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/onboarding')}
            >
              Get Started for Free <ArrowRight size={16} className="ml-2 inline" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareUnchained;
