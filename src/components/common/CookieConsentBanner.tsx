import React, { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consented = localStorage.getItem('tl_storage_consent');
      if (!consented) {
        setVisible(true);
      }
    } catch {
      // Ignore local storage errors in private browsing modes
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('tl_storage_consent', 'acknowledged');
    } catch {
      // Ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="p-4 md:p-5 rounded-2xl bg-surface/95 border border-base/80 backdrop-blur-md shadow-2xl flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-brand-primary">
            <ShieldCheck size={18} />
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Privacy & Essential Storage</h4>
          </div>
          <button 
            onClick={handleAccept} 
            className="text-muted hover:text-primary transition-colors p-1"
            aria-label="Dismiss banner"
          >
            <X size={14} />
          </button>
        </div>
        <p className="text-xs text-muted leading-relaxed">
          We use strictly essential browser storage to derive zero-knowledge cryptographic keys and maintain your authenticated session. We never deploy tracking or advertising cookies.{' '}
          <Link to="/legal/privacy" className="text-brand-primary underline hover:text-brand-primary/80 font-medium">
            Read our Privacy Protocol
          </Link>.
        </p>
        <div className="flex justify-end pt-1">
          <button
            onClick={handleAccept}
            className="px-4 py-2 rounded-xl bg-brand-primary text-white text-[10px] font-bold uppercase tracking-widest hover:scale-[1.02] transition-transform shadow-lg shadow-brand-primary/20"
          >
            Acknowledge & Continue
          </button>
        </div>
      </div>
    </div>
  );
}
