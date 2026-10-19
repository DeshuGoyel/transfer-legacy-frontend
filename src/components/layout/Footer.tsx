import { Globe, Mail, MessageSquare, Shield, Lock, Fingerprint } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import ThemeToggle from './ThemeToggle';

export default function Footer({ variant = 'app' }: { variant?: 'app' | 'marketing' }) {
  if (variant === 'marketing') {
    return (
      <footer className="relative overflow-hidden bg-page border-t border-border-base select-none">
        <div className="max-w-[1100px] mx-auto px-6 py-16 relative z-10">
          {/* Footer Top Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 pb-12 border-b border-border-base">
            {/* Col 1: Brand & Security Badges */}
            <div className="md:col-span-2 space-y-6">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-8 h-8 overflow-hidden flex items-center justify-center shrink-0">
                  <img src="/logo-dark.png" alt="Transfer Legacy" className="w-full h-full object-contain dark:block hidden" />
                  <img src="/logo-light.jpeg" alt="Transfer Legacy" className="w-full h-full object-contain dark:hidden block" />
                </div>
                <span className="font-display font-medium text-[1.18rem] text-primary transition-opacity group-hover:opacity-75">
                  Transfer Legacy
                </span>
              </Link>
              
              <p className="text-[13px] text-secondary leading-relaxed font-light max-w-xs">
                Client-side encrypted estate planning vault. Math-based digital inheritance for bank accounts, files, and crypto.
              </p>

              {/* Security Badges */}
              <div className="flex flex-wrap gap-3 items-center opacity-30 text-[10px] font-bold uppercase tracking-widest text-secondary">
                <span className="border border-border-base rounded-[4px] px-2 py-1 bg-surface">SOC 2 Type II</span>
                <span className="border border-border-base rounded-[4px] px-2 py-1 bg-surface">GDPR</span>
                <span className="border border-border-base rounded-[4px] px-2 py-1 bg-surface">ISO 27001</span>
              </div>
            </div>

            {/* Col 2: Product */}
            <div>
              <h4 className="text-primary font-semibold text-[12px] uppercase tracking-wider mb-4">Product</h4>
              <ul className="space-y-3 text-[13px] font-light">
                <li>
                  <a href="/#how" className="text-secondary hover:text-primary transition-colors">How it works</a>
                </li>
                <li>
                  <a href="/#security" className="text-secondary hover:text-primary transition-colors">Security</a>
                </li>
                <li>
                  <a href="/#pricing" className="text-secondary hover:text-primary transition-colors">Pricing</a>
                </li>
              </ul>
            </div>

            {/* Col 3: Legal */}
            <div>
              <h4 className="text-primary font-semibold text-[12px] uppercase tracking-wider mb-4">Legal</h4>
              <ul className="space-y-3 text-[13px] font-light">
                <li>
                  <Link to="/legal/privacy" className="text-secondary hover:text-primary transition-colors">Privacy Protocol</Link>
                </li>
                <li>
                  <Link to="/legal/terms" className="text-secondary hover:text-primary transition-colors">Terms of Service</Link>
                </li>
                <li>
                  <Link to="/legal/security-architecture" className="text-secondary hover:text-primary transition-colors">Security Spec</Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Company */}
            <div>
              <h4 className="text-primary font-semibold text-[12px] uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-3 text-[13px] font-light">
                <li>
                  <Link to="/resources/blog" className="text-secondary hover:text-primary transition-colors">Journal</Link>
                </li>
                <li>
                  <Link to="/contact" className="text-secondary hover:text-primary transition-colors">Contact</Link>
                </li>
                <li>
                  <span className="text-secondary/40">Careers - hiring</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-[12px] text-secondary/50">
            <div className="flex items-center gap-4">
              <p>© {new Date().getFullYear()} Transfer Legacy, Inc.</p>
              <span className="text-secondary/20">•</span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                <span>All networks operational</span>
              </div>
            </div>

            {/* Theme Toggle & Accent */}
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <span className="text-secondary/20">•</span>
              <p className="font-light">Built with restraint for the sovereign.</p>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // App Layout
  return (
    <footer className="bg-surface/30 backdrop-blur-xl border-t border-base pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-16 mb-24">
          <div className="lg:col-span-2">
            <Logo className="mb-8" size={40} showTagline={true} />
            <p className="text-muted/80 text-sm leading-relaxed mb-8 max-w-sm font-medium tracking-tight">
              Transfer Legacy is the global standard for sovereign digital asset succession. We provide institutional-grade infrastructure to secure your crypto, identities, and memories for generations to come.
            </p>
            <div className="flex space-x-6">
              <Link to="/" className="text-muted/40 hover:text-brand-primary transition-all duration-300 transform hover:scale-110" aria-label="Visit our Global Website"><Globe size={20} /></Link>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-muted/40 hover:text-brand-primary transition-all duration-300 transform hover:scale-110" aria-label="Social Link"><MessageSquare size={20} /></a>
              <a href="mailto:support@transferlegacy.global" className="text-muted/40 hover:text-brand-primary transition-all duration-300 transform hover:scale-110" aria-label="Email Link"><Mail size={20} /></a>
            </div>
          </div>
          
          <div>
            <h3 className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-8">The Protocol</h3>
            <ul className="space-y-4 text-sm text-muted font-medium">
              <li><Link to="/features/zero-knowledge" className="hover:text-brand-primary transition-colors">Zero-Knowledge Vault</Link></li>
              <li><Link to="/features/guardian-network" className="hover:text-brand-primary transition-colors">Guardian Network</Link></li>
              <li><Link to="/features/inheritance-logic" className="hover:text-brand-primary transition-colors">Smart Succession</Link></li>
              <li><Link to="/features/vault-security" className="hover:text-brand-primary transition-colors">Encryption Standards</Link></li>
              <li><Link to="/features/asset-tracking" className="hover:text-brand-primary transition-colors">Asset Mapping</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-8">Trust Center</h3>
            <ul className="space-y-4 text-sm text-muted font-medium">
              <li><Link to="/whitepaper" className="hover:text-brand-primary transition-colors">Technical Whitepaper</Link></li>
              <li><Link to="/legal-templates" className="hover:text-brand-primary transition-colors">Succession Templates</Link></li>
              <li><Link to="/legal/compliance" className="hover:text-brand-primary transition-colors">Global Compliance</Link></li>
              <li><Link to="/legal/security-architecture" className="hover:text-brand-primary transition-colors">Sovereign Architecture</Link></li>
              <li><Link to="/resources/faq" className="hover:text-brand-primary transition-colors">Protocol FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-8">Knowledge</h3>
            <ul className="space-y-4 text-sm text-muted font-medium">
              <li><Link to="/resources" className="hover:text-brand-primary transition-colors font-bold text-brand-primary">Resource Hub</Link></li>
              <li><Link to="/transfer-legacy-vs-traditional-wills" className="hover:text-brand-primary transition-colors">Legacy vs. Wills</Link></li>
              <li><Link to="/crypto-inheritance-india" className="hover:text-brand-primary transition-colors">India Guide</Link></li>
              <li><Link to="/crypto-inheritance-usa" className="hover:text-brand-primary transition-colors">USA Guide</Link></li>
              <li><Link to="/crypto-inheritance-uk" className="hover:text-brand-primary transition-colors">UK Guide</Link></li>
              <li><Link to="/crypto-inheritance-uae" className="hover:text-brand-primary transition-colors">UAE Guide</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-8">Support</h3>
            <ul className="space-y-4 text-sm text-muted font-medium">
              <li><Link to="/onboarding" className="hover:text-brand-primary transition-colors">Start Protocol</Link></li>
              <li><Link to="/tools/planner" className="hover:text-brand-primary transition-colors">Succession Audit</Link></li>
              <li><Link to="/tools/crypto-risk-calculator" className="hover:text-brand-primary transition-colors">Risk Calculator</Link></li>
              <li><Link to="/legal/privacy" className="hover:text-brand-primary transition-colors">Privacy Protocol</Link></li>
              <li><a href="mailto:support@transferlegacy.global" className="flex items-center gap-2 hover:text-brand-primary transition-colors"><Mail size={14} /> Institutional Desk</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-12 border-t border-border-base/50 flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex items-center gap-6 opacity-30 grayscale grayscale-100">
               <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest"><Shield size={12} /> ISO 27001</div>
               <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest"><Lock size={12} /> ZK-Standard</div>
               <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest"><Fingerprint size={12} /> SOC2 Type II</div>
            </div>
            <p className="text-muted/40 text-[11px] font-bold uppercase tracking-[0.15em]">
              © 2026 TRANSFER LEGACY GLOBAL. ALL PROTOCOLS ENCRYPTED.
            </p>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-success"></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted/60">System Status: Nominal</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
