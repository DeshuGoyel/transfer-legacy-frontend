import { motion } from 'framer-motion';
import SEO from '../../../components/seo/SEO';
import { ArrowRight, Shield, Globe2, BookOpen, AlertTriangle, Landmark, Scale, Gavel, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import { useStore } from '../../../store/useStore';

const CryptoInheritanceIndia = () => {
  const cryptoInheritanceHreflangs = [
    { lang: 'en-IN', href: 'https://transferlegacy.com/crypto-inheritance-india' },
    { lang: 'en-US', href: 'https://transferlegacy.com/crypto-inheritance-usa' },
    { lang: 'en-GB', href: 'https://transferlegacy.com/crypto-inheritance-uk' },
    { lang: 'en-AE', href: 'https://transferlegacy.com/crypto-inheritance-uae' },
    { lang: 'x-default', href: 'https://transferlegacy.com/crypto-inheritance' },
  ];
  const navigate = useNavigate();
  const { isAuthenticated } = useStore();
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is cryptocurrency inheritance legal in India?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, inheriting cryptocurrency is legal in India. Digital assets are treated as property and can be passed down to legal heirs through a valid will or under the Hindu Succession Act / Indian Succession Act."
        }
      },
      {
        "@type": "Question",
        "name": "How is inherited crypto taxed in India?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "In India, there is currently no inheritance tax. However, heirs are subject to a 30% flat tax on gains when they sell or transfer the inherited assets, plus a 1% TDS on transactions."
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-page text-primary pt-24 pb-16 relative overflow-hidden">
      {/* Institutional Background Elements */}
      <div className="absolute inset-0 bg-aurora opacity-30 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 blur-[120px] pointer-events-none" />

      <SEO 
        title="Crypto Inheritance Law in India: The Ultimate Guide (2026)"
        description="Navigate crypto inheritance laws in India. Learn about digital wills, tax implications, and how to securely pass your Bitcoin to your family under the Hindu Succession Act."
        canonicalUrl="https://transferlegacy.com/crypto-inheritance-india"
        schema={faqSchema}
        hreflangs={cryptoInheritanceHreflangs}
      />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 px-4 py-2 rounded-full mb-8 shadow-[0_0_20px_rgba(79,92,255,0.1)]"
          >
            <Globe2 className="w-4 h-4" />
            <span className="font-bold tracking-[0.2em] uppercase text-[10px]">India Jurisdiction Guide</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-8 leading-[0.95] tracking-tight text-primary">
            Digital Succession <span className="italic text-brand-primary">in India</span>
          </h1>
          
          <p className="text-xl text-secondary mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            Protecting digital wealth under the Hindu Succession Act & Indian Succession Act. Ensure your crypto doesn't become a lost asset.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/onboarding')}
              variant="primary" size="lg" className="px-10 h-14 text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-brand-primary/20"
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Initialize India Vault'} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Link to="/legal/compliance" className="text-[11px] font-bold uppercase tracking-widest text-muted hover:text-primary transition-colors">
              View Global Framework
            </Link>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-16">
          
          <section className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[32px] p-8 md:p-12">
            <h2 className="flex items-center text-3xl font-display font-bold mb-8 text-primary tracking-tight">
              <Scale className="w-8 h-8 mr-4 text-brand-primary" />
              Legal Recognition
            </h2>
            <div className="prose prose-invert max-w-none text-secondary">
              <p className="text-lg leading-relaxed mb-6">
                India's regulatory environment for Virtual Digital Assets (VDAs) has matured significantly. Rulings from the <span className="text-primary font-bold">Supreme Court</span> and various High Courts recognize digital assets as intangible property.
              </p>
              <p className="text-lg leading-relaxed">
                Under the <span className="text-primary font-bold">Hindu Succession Act (1956)</span> and the <span className="text-primary font-bold">Indian Succession Act (1925)</span>, digital assets form part of the deceased's estate and must be distributed among legal heirs. However, the technical nature of crypto creates a "Key Recovery Barrier" that traditional wills cannot solve.
              </p>
            </div>
          </section>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[32px] p-8">
              <Landmark className="w-10 h-10 text-brand-gold mb-6" />
              <h3 className="text-xl font-display font-bold mb-4 text-primary">Taxation Policy</h3>
              <p className="text-secondary text-sm leading-relaxed mb-6">
                While inheritance itself is not taxed in India, subsequent transfers by heirs trigger a <span className="text-primary font-bold">30% VDA tax</span> and <span className="text-primary font-bold">1% TDS</span>. Proper documentation of the "Cost of Acquisition" is critical for heirs.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-[11px] font-bold text-muted uppercase tracking-wider">
                  <CheckCircle2 size={14} className="text-emerald-400" /> Zero Inheritance Tax
                </li>
                <li className="flex items-center gap-2 text-[11px] font-bold text-muted uppercase tracking-wider">
                  <CheckCircle2 size={14} className="text-brand-gold" /> 30% Realization Tax
                </li>
              </ul>
            </div>

            <div className="bg-surface/30 backdrop-blur-md border border-base/60 rounded-[32px] p-8 border-brand-primary/20 bg-brand-primary/5">
              <Gavel className="w-10 h-10 text-brand-primary mb-6" />
              <h3 className="text-xl font-display font-bold mb-4 text-primary">Probate Challenges</h3>
              <p className="text-secondary text-sm leading-relaxed mb-6">
                The Indian probate process can take <span className="text-primary font-bold">12-24 months</span>. Transfer Legacy's Sovereign Protocol allows for immediate asset recovery bypassing traditional court delays while remaining fully compliant.
              </p>
              <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-widest text-brand-primary p-0">
                Learn about bypass protocols
              </Button>
            </div>
          </div>

          <section className="bg-obsidian-950/50 border border-brand-gold/20 rounded-[32px] p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <AlertTriangle size={120} className="text-brand-gold" />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl font-display font-bold mb-6 text-primary tracking-tight">The "Nomination" Fallacy</h2>
              <p className="text-lg text-secondary leading-relaxed mb-8">
                Many Indian investors believe "Nominees" on centralized exchanges like <span className="text-primary font-bold">WazirX</span> or <span className="text-primary font-bold">CoinDCX</span> are absolute owners. In Indian law, a nominee is merely a <span className="italic">custodian</span>. The legal heirs retain the ultimate right, often leading to multi-year legal disputes.
              </p>
              <div className="flex items-center gap-4 p-4 bg-brand-gold/10 rounded-2xl border border-brand-gold/20">
                <Shield className="text-brand-gold shrink-0" size={24} />
                <p className="text-sm font-medium text-brand-gold leading-tight">
                  Transfer Legacy automates the "Legal Heir" verification via Guardian consensus, ensuring zero-friction asset release.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <div className="bg-gradient-to-br from-brand-primary to-blue-900 text-obsidian-950 rounded-[40px] p-10 md:p-16 text-center shadow-2xl shadow-brand-primary/20">
            <BookOpen className="w-16 h-16 mx-auto mb-8 opacity-80" />
            <h3 className="text-3xl md:text-5xl font-display font-bold mb-6 tracking-tight leading-none">
              Initialize Your <span className="italic">India Sovereign Vault</span>
            </h3>
            <p className="text-xl opacity-90 mb-12 max-w-2xl mx-auto font-medium">
              Join 5,000+ Indian investors securing their digital family heritage. AES-256 protected, Zero-Knowledge verified.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button 
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/onboarding')} 
                className="bg-obsidian-950 text-white hover:bg-obsidian-900 px-12 h-16 rounded-2xl text-[12px] font-bold uppercase tracking-widest"
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
              </Button>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-obsidian-900/60">
                Takes under 5 minutes
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoInheritanceIndia;
