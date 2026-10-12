import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { api } from '../../lib/api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

/* ── High-Fidelity Vault Visual Card Mockup ── */
function VaultVisual() {
  return (
    <div className="relative w-full max-w-[480px] mx-auto lg:mx-0 select-none">
      {/* blob */}
      <div className="absolute w-[460px] h-[460px] rounded-full bg-gradient-to-tr from-brand-primary/10 to-transparent -top-[60px] -right-[80px] z-0 pointer-events-none filter blur-md" />
      
      {/* notif */}
      <div className="absolute z-[3] left-[-26px] top-[22px] w-[200px] bg-surface border border-border-base rounded-[12px] shadow-lg p-[12px_14px] flex items-center gap-[10px] animate-float-slow">
        <div className="w-[30px] h-[30px] rounded-[8px] bg-brand-primary flex items-center justify-center shrink-0">
          <svg className="w-[15px] h-[15px] stroke-white fill-none stroke-2" viewBox="0 0 24 24">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <div>
          <div className="text-[0.74rem] font-bold leading-[1.25] text-primary">Legacy Score: 87</div>
          <div className="text-[0.65rem] text-muted">Your family is protected</div>
        </div>
      </div>

      {/* main product card */}
      <div className="bg-surface border border-border-base rounded-[16px] shadow-lg overflow-hidden relative z-[2]">
        <div className="p-[16px_20px] border-b border-border-base flex items-center justify-between">
          <span className="text-[0.7rem] font-semibold tracking-[0.1em] uppercase text-muted">Your Vault</span>
          <div className="flex items-baseline gap-[5px]">
            <b className="font-display text-[1.5rem] font-medium text-brand-primary">87</b>
            <span className="text-[0.72rem] text-muted">/ 100</span>
          </div>
        </div>
        <div className="p-[16px]">
          {[
            { icon: '🏦', name: 'HDFC Bank', sub: 'Salary · ₹3.2L' },
            { icon: '✉️', name: 'Gmail', sub: 'Master key to all accounts' },
            { icon: '📈', name: 'Zerodha', sub: 'Portfolio · ₹18.4L' },
            { icon: '₿', name: 'Bitcoin', sub: 'Hardware wallet · seed phrase' }
          ].map((acct, idx) => (
            <div key={idx} className="flex items-center gap-[12px] p-[11px_12px] rounded-[10px] hover:bg-raised transition-all duration-200 mt-[2px]">
              <div className="w-[34px] h-[34px] rounded-[9px] bg-raised flex items-center justify-center text-[0.95rem] shrink-0">{acct.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="text-[0.86rem] font-bold text-primary">{acct.name}</div>
                <div className="text-[0.72rem] text-muted truncate">{acct.sub}</div>
              </div>
              <div className="flex items-center gap-[5px] text-[0.7rem] font-bold text-brand-primary">
                <span className="w-[14px] h-[14px] rounded-full bg-brand-primary flex items-center justify-center">
                  <svg className="w-[8px] h-[8px] stroke-white stroke-[2.5px] fill-none" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                Secured
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* guardian card */}
      <div className="absolute z-[3] right-[-28px] bottom-[-30px] w-[236px] bg-surface border border-border-base rounded-[13px] shadow-lg p-[15px_16px] animate-float">
        <div className="flex items-center gap-[9px] mb-[12px]">
          <div className="w-[30px] h-[30px] rounded-[8px] bg-brand-primary/10 flex items-center justify-center text-[0.85rem]">🤝</div>
          <div>
            <div className="text-[0.78rem] font-bold text-primary">3 Guardians</div>
            <div className="text-[0.66rem] text-muted">Any 2 can unlock</div>
          </div>
        </div>
        <div className="flex flex-col gap-[8px]">
          {[
            { name: 'Sunita · Mother', av: 'S', color: '#6B8E6B' },
            { name: 'Rohan · Brother', av: 'R', color: '#4A7FB5' },
            { name: 'Priya · Spouse', av: 'P', color: '#B08D3E' }
          ].map((gp, idx) => (
            <div key={idx} className="flex items-center gap-[8px]">
              <span className="w-[20px] h-[20px] rounded-full text-[0.56rem] font-bold flex items-center justify-center text-white shrink-0" style={{ backgroundColor: gp.color }}>{gp.av}</span>
              <span className="flex-grow text-[0.72rem] text-secondary font-medium">{gp.name}</span>
              <span className="text-brand-primary text-[0.66rem] font-bold">✓</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Hero Main Section ── */
export default function Hero() {
  const [branding, setBranding] = useState({ waitlist_enabled: false });
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [position, setPosition] = useState<number | null>(null);

  useEffect(() => {
    async function loadBranding() {
      try {
        const res = await api.get<{ waitlist_enabled?: boolean }>('/app/branding', { skipAead: true });
        const data = res.data ? res.data : res;
        if (data && typeof data.waitlist_enabled === 'boolean') {
          setBranding({ waitlist_enabled: data.waitlist_enabled });
        }
      } catch { /* defaults to waitlist_enabled: false */ }
    }
    loadBranding();
  }, []);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    try {
      const result = await api.post<{ position?: number; isNew?: boolean }>('/app/waitlist', { email, name: null }, { skipAead: true });
      const waitlistData = result.data ? result.data : result;
      setPosition(waitlistData.position ?? null);
      setIsSuccess(true);

      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#4BAE82', '#1C6B4A', '#ffffff']
      });

      if (waitlistData.isNew) {
        toast.success('Successfully joined waitlist!');
      } else {
        toast.success("Welcome back! You're already registered.");
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to submit email. Please try again.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <header
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-24 md:py-32"
      style={{ background: 'var(--color-bg-page)' }}
    >
      {/* Background glow */}
      <div
        className="absolute top-0 inset-x-0 h-[400px] pointer-events-none opacity-50"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, var(--color-brand-primary-dim), transparent 75%)' }}
      />

      <div className="relative z-10 max-w-[1100px] mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-16 items-center">
        
        {/* ── LEFT COLUMN: Text + CTA ── */}
        <div className="flex flex-col items-start text-left max-w-xl">
          
          {/* Eyebrow Pill */}
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-semibold border border-border-base bg-surface/50 text-secondary mb-6"
          >
            <span className="w-3.5 h-3.5 rounded bg-[#FF6B35] text-white text-[9px] font-extrabold flex items-center justify-center font-sans">Y</span>
            <span>Backed by <b className="text-primary font-semibold">founding members in 14 countries</b></span>
          </div>

          {/* H1 in Fraunces display font */}
          <h1
            className="font-display font-light leading-[1.05] tracking-tight mb-5 text-primary text-[clamp(2.5rem,5vw,4.5rem)]"
          >
            Your family gets<br />everything you built —<br />
            <span className="font-script text-[1.06em] text-brand-primary font-semibold inline-block -rotate-[3deg] px-1 translate-y-1">automatically</span>.
          </h1>

          {/* Subline in Inter */}
          <p
            className="text-secondary leading-relaxed mb-8 text-[15px] font-light max-w-[440px] tracking-wide"
          >
            Bank accounts, Gmail, Zerodha, iCloud, crypto — protected in one encrypted vault and passed on the moment your family needs it. No lawyers. No technical steps.
          </p>

          {/* Action area */}
          <div className="w-full max-w-[440px]">
            {branding.waitlist_enabled ? (
              isSuccess ? (
                <div className="p-5 rounded-[8px] bg-brand-primary-transparent border border-brand-primary/20">
                  <p className="text-[12px] font-bold uppercase tracking-wider text-brand-primary mb-1">Spot Confirmed</p>
                  <p className="text-[20px] font-display font-light text-primary leading-none">
                    Waitlist Position: <span className="text-brand-primary font-mono font-semibold">#{position?.toLocaleString() || '128'}</span>
                  </p>
                  <p className="text-[11px] text-secondary mt-2">
                    Verification link sent. We will contact you as beta openings expand.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-2.5 w-full">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-grow bg-surface border border-border-base focus:border-brand-primary focus:shadow-[0_0_15px_rgba(75,174,130,0.15)] rounded-[8px] px-4 h-[50px] text-[13px] text-primary outline-none transition-all placeholder:text-muted"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-[50px] px-6 rounded-[8px] text-[13px] font-semibold text-white bg-brand-primary hover:bg-brand-primary-hover active:scale-[0.98] transition-all shrink-0 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? 'Securing...' : 'Claim Spot'} <ArrowRight size={13} />
                  </button>
                </form>
              )
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/onboarding">
                  <button
                    className="h-[50px] px-6 rounded-[8px] text-[13px] font-semibold text-white bg-brand-primary hover:bg-brand-primary-hover active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    Protect My Legacy <ArrowRight size={13} />
                  </button>
                </Link>
                <Link to="/dashboard">
                  <button
                    className="h-[50px] px-6 rounded-[8px] text-[13px] font-medium border border-border-base bg-surface/50 hover:bg-raised text-secondary flex items-center justify-center transition-colors cursor-pointer"
                  >
                    View Dashboard
                  </button>
                </Link>
              </div>
            )}
            
            {/* Proof line */}
            <div className="flex items-center gap-4 text-[11px] text-muted mt-4 tracking-wide font-medium">
              <div className="flex -space-x-2">
                {['SP', 'RM', 'AK', '+'].map((initial, i) => (
                  <span key={i} className="w-5 h-5 rounded-full border-2 border-page bg-brand-primary/10 text-brand-primary text-[8px] font-bold flex items-center justify-center">{initial}</span>
                ))}
              </div>
              <span>2,417 families protected</span>
              <span className="w-1 h-1 rounded-full bg-border-strong" />
              <span>Free plan · no card</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Depth View Product UI ── */}
        <div className="w-full flex justify-center lg:justify-end">
          <VaultVisual />
        </div>

      </div>
    </header>
  );
}
