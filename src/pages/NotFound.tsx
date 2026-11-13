import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldAlert, BookOpen, Compass, Home } from 'lucide-react';
import Button from '../components/ui/Button';
import SEO from '../components/seo/SEO';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-page text-primary flex items-center justify-center pt-24 pb-16 px-6 relative overflow-hidden">
      <SEO 
        title="404 — Shard Not Found | Transfer Legacy"
        description="The requested protocol shard or cryptographic path cannot be located."
        noindex={true}
      />

      {/* Aurora glow background */}
      <div className="absolute inset-0 bg-aurora opacity-25 pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] bg-brand-primary/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-xl w-full text-center relative z-10 space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary shadow-[0_0_40px_rgba(79,92,255,0.2)] mb-2"
        >
          <ShieldAlert size={36} />
        </motion.div>

        <div className="space-y-3">
          <p className="text-[11px] font-mono font-bold uppercase tracking-[0.3em] text-secondary/60">
            Error 404 • Missing Cryptographic Shard
          </p>
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-primary">
            Address Not Found
          </h1>
          <p className="text-secondary text-base leading-relaxed max-w-md mx-auto">
            The page you are looking for has been moved, unlinked, or does not exist on this sovereign network.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/">
            <Button variant="primary" size="lg" className="w-full sm:w-auto px-8 h-12 text-xs font-bold uppercase tracking-widest">
              <Home className="mr-2 w-4 h-4" /> Return to Vault
            </Button>
          </Link>
          <Link to="/resources">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto px-8 h-12 text-xs font-bold uppercase tracking-widest">
              <BookOpen className="mr-2 w-4 h-4" /> Explore Guides
            </Button>
          </Link>
        </div>

        {/* Popular recovery destinations */}
        <div className="pt-10 border-t border-border-base/50 text-left">
          <p className="text-[11px] font-mono uppercase tracking-widest text-secondary/50 mb-4 text-center">
            Suggested Verification Destinations
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <Link 
              to="/crypto-inheritance" 
              className="p-3 rounded-xl bg-surface/40 border border-border-base/40 hover:border-brand-primary/50 text-secondary hover:text-primary transition-all flex items-center gap-2"
            >
              <Compass size={14} className="text-brand-primary" />
              <span>Crypto Inheritance Guide</span>
            </Link>
            <Link 
              to="/digital-will" 
              className="p-3 rounded-xl bg-surface/40 border border-border-base/40 hover:border-brand-primary/50 text-secondary hover:text-primary transition-all flex items-center gap-2"
            >
              <Compass size={14} className="text-brand-primary" />
              <span>Digital Will Protocol</span>
            </Link>
            <Link 
              to="/tools/crypto-risk-calculator" 
              className="p-3 rounded-xl bg-surface/40 border border-border-base/40 hover:border-brand-primary/50 text-secondary hover:text-primary transition-all flex items-center gap-2"
            >
              <Compass size={14} className="text-brand-primary" />
              <span>Risk Calculator</span>
            </Link>
            <Link 
              to="/contact" 
              className="p-3 rounded-xl bg-surface/40 border border-border-base/40 hover:border-brand-primary/50 text-secondary hover:text-primary transition-all flex items-center gap-2"
            >
              <Compass size={14} className="text-brand-primary" />
              <span>Contact Security Desk</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
