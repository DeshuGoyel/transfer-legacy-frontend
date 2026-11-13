import { motion } from 'framer-motion';
import SEO from '../../components/seo/SEO';
import { CheckCircle2, XCircle, Scale, Zap, ArrowRight } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';

const Compare1Password = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useStore();

  const comparisons = [
    {
      feature: "Target Use Case",
      legacy: "Zero-Knowledge Estate Planning & Cryptographic Succession",
      competitor: "Everyday Web Login & Password Storage"
    },
    {
      feature: "Proof of Life / Dead Man's Switch",
      legacy: "Automated Multi-Channel Heartbeat (Email, SMS, TOTP)",
      competitor: "None (Relies on passive emergency kit possession)"
    },
    {
      feature: "Decentralized Key Sharding",
      legacy: "Shamir's Secret Sharing (3-of-5 Guardian Quorum)",
      competitor: "Single PDF Emergency Kit (Single point of failure)"
    },
    {
      feature: "Heir Recovery Protection",
      legacy: "Time-delayed challenge window to prevent unauthorized claims",
      competitor: "Instant access if someone discovers the PDF and Master Password"
    },
    {
      feature: "Jurisdiction & Tax Aware",
      legacy: "Built-in US/UK/IN/UAE Estate Tax & RUFADAA directives",
      competitor: "Generic text notes with zero legal framework"
    }
  ];

  return (
    <div className="min-h-screen bg-page text-primary pt-24 pb-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-aurora opacity-30 pointer-events-none" />

      <SEO
        title="Transfer Legacy vs. 1Password: Why Password Managers Fail for Crypto Inheritance"
        description="Learn why 1Password's emergency kit is unsafe for high-value crypto inheritance, and how Transfer Legacy's dead man's switch and Shamir sharding solve the problem."
        canonicalUrl="https://transferlegacy.com/transfer-legacy-vs-1password"
      />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 px-4 py-2 rounded-full mb-8"
          >
            <Scale className="w-4 h-4" />
            <span className="font-bold tracking-[0.2em] uppercase text-[10px]">Security Architecture Audit</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-display font-bold mb-8 leading-[0.95] tracking-tight text-primary">
            Transfer Legacy <span className="italic text-brand-primary">vs. 1Password</span>
          </h1>

          <p className="text-xl text-secondary mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            1Password is great for Netflix logins. But trusting your seed phrases and millions in digital wealth to a printed PDF Emergency Kit is an invitation to theft and disaster.
          </p>
        </div>

        <div className="space-y-16">
          <div className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[32px] overflow-hidden">
            <div className="grid grid-cols-3 bg-obsidian-950/50 p-6 border-b border-base/60">
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted">Feature</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-brand-primary text-center">Transfer Legacy</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted text-center">1Password</div>
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
              The Danger of the Single "Emergency Kit"
            </h2>
            <p className="text-lg text-secondary leading-relaxed">
              1Password relies on the owner printing out an <span className="text-primary font-bold">Emergency Kit PDF</span> containing the Secret Key and writing down their Master Password. If a roommate, contractor, cleaner, or burglar discovers this sheet, your entire digital life—including crypto wallets—is drained without warning.
            </p>
            <p className="text-lg text-secondary leading-relaxed">
              Transfer Legacy introduces <span className="italic text-brand-primary font-bold">Multi-Party Cryptographic Consensus</span>. No single physical document exists that can compromise your wealth. Shards are distributed among designated guardians, and release occurs only after verified proof-of-life heartbeats lapse with a configurable dispute delay window.
            </p>
          </section>

          <div className="bg-gradient-to-br from-brand-primary to-blue-900 text-obsidian-950 rounded-[40px] p-10 md:p-16 text-center shadow-2xl shadow-brand-primary/20">
            <h3 className="text-3xl md:text-5xl font-display font-bold mb-6 tracking-tight leading-none">
              Upgrade from Password Manager to <span className="italic">Succession Protocol</span>
            </h3>
            <p className="text-lg font-medium mb-8 max-w-xl mx-auto opacity-90">
              Never gamble your generational estate on a piece of paper. Deploy zero-knowledge succession today.
            </p>
            <Button
              size="lg"
              variant="outline"
              className="bg-obsidian-950 text-white border-obsidian-950 hover:bg-obsidian-900 px-8 py-4 rounded-2xl"
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/onboarding')}
            >
              Start Free Vault <ArrowRight size={16} className="ml-2 inline" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compare1Password;
