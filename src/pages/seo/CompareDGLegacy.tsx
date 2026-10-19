import { motion } from 'framer-motion';
import SEO from '../../components/seo/SEO';
import { CheckCircle2, XCircle, Scale, Zap } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';

const CompareDGLegacy = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useStore();
  const comparisons = [
    {
      feature: "Architecture",
      legacy: "Sovereign Protocol (Dead Man's Switch)",
      competitor: "Email-based Check-ins"
    },
    {
      feature: "Jurisdiction Aware",
      legacy: "Built-in Tax & Legal Logic (US/UK/IN/UAE)",
      competitor: "Generic Storage"
    },
    {
      feature: "Biometric Integration",
      legacy: "Multi-layered Identity Verification",
      competitor: "Password Only"
    },
    {
      feature: "Institutional Grade",
      legacy: "Military AES-256-GCM + Multi-Sig Quorum",
      competitor: "Standard Cloud Encryption"
    }
  ];

  return (
    <div className="min-h-screen bg-page text-primary pt-24 pb-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-aurora opacity-30 pointer-events-none" />
      
      <SEO 
        title="Transfer Legacy vs. DGLegacy: Which Digital Inheritance Tool is Best?"
        description="A technical and legal comparison between Transfer Legacy and DGLegacy. Discover why our sovereign protocols outperform traditional digital vaults."
        canonicalUrl="https://transferlegacy.com/transfer-legacy-vs-dglegacy"
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
            Transfer Legacy <span className="italic text-brand-primary">vs. DGLegacy</span>
          </h1>
          
          <p className="text-xl text-secondary mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            In the institutional world, security isn't just a feature - it's the foundation. See how Transfer Legacy's sovereign protocol compares to DGLegacy's storage-first approach.
          </p>
        </div>

        <div className="space-y-16">
          {/* Comparison Table */}
          <div className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[32px] overflow-hidden">
            <div className="grid grid-cols-3 bg-obsidian-950/50 p-6 border-b border-base/60">
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted">Feature</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-brand-primary text-center">Transfer Legacy</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted text-center">DGLegacy</div>
            </div>
            {comparisons.map((item, index) => (
              <div key={index} className="grid grid-cols-3 p-6 border-b border-base/40 last:border-0 hover:bg-surface/50 transition-colors">
                <div className="text-[13px] font-bold text-primary flex items-center">{item.feature}</div>
                <div className="text-[12px] font-semibold text-emerald-400 text-center flex items-center justify-center gap-2">
                  <CheckCircle2 size={14} /> {item.legacy}
                </div>
                <div className="text-[12px] font-semibold text-secondary text-center flex items-center justify-center gap-2">
                  <XCircle size={14} className="text-red-400/50" /> {item.competitor}
                </div>
              </div>
            ))}
          </div>

          <section className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[32px] p-8 md:p-12">
            <h2 className="flex items-center text-3xl font-display font-bold mb-8 text-primary tracking-tight">
              <Zap className="w-8 h-8 mr-4 text-brand-primary" />
              The Sovereign Advantage
            </h2>
            <p className="text-lg text-secondary leading-relaxed mb-6">
              While DGLegacy focus on digital vault storage, Transfer Legacy focuses on <span className="text-primary font-bold">Autonomous Protocol Execution</span>. We don't just store your data; we manage the entire lifecycle of your digital estate through verified triggers and localized legal logic.
            </p>
            <p className="text-lg text-secondary leading-relaxed">
              Our <span className="italic text-brand-primary font-bold">Jurisdiction-Aware Engine</span> automatically adjusts your succession plan based on whether you are in the US, UK, India, or UAE, ensuring compliance with local inheritance taxes and digital asset laws.
            </p>
          </section>

          <div className="bg-gradient-to-br from-brand-primary to-blue-900 text-obsidian-950 rounded-[40px] p-10 md:p-16 text-center shadow-2xl shadow-brand-primary/20">
            <h3 className="text-3xl md:text-5xl font-display font-bold mb-6 tracking-tight leading-none">
              Choose the <span className="italic">Institutional Standard</span>
            </h3>
            <p className="text-xl opacity-90 mb-12 max-w-2xl mx-auto font-medium">
              Don't settle for simple storage. Secure your digital heritage with a sovereign protocol.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button 
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/onboarding')} 
                className="bg-obsidian-950 text-white hover:bg-obsidian-900 px-12 h-16 rounded-2xl text-[12px] font-bold uppercase tracking-widest"
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Start My Vault'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareDGLegacy;
