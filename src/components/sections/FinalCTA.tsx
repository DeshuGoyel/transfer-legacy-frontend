import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { api } from '../../lib/api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

export default function FinalCTA() {
  const [branding, setBranding] = useState({ waitlist_enabled: false });
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [position, setPosition] = useState<number | null>(null);

  useEffect(() => {
    async function loadBranding() {
      try {
        const res = await api.get<{ data?: { waitlist_enabled?: boolean }; waitlist_enabled?: boolean }>('/app/branding', { skipAead: true });
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
      const result = await api.post<{ data?: { position?: number; isNew?: boolean }; position?: number; isNew?: boolean }>('/app/waitlist', { email, name: null }, { skipAead: true });
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
      const msg = error instanceof Error ? error.message : 'Failed to submit. Please try again.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="waitlist" className="py-32 bg-page relative overflow-hidden border-t border-border-base select-none">
      {/* Background radial glow */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-50"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 50%, var(--color-brand-primary-dim), transparent 75%)' }}
      />

      <div className="max-w-[1100px] mx-auto px-6 relative z-10 text-center flex flex-col items-center">
        
        {/* Fraunces Display Heading */}
        <h2 className="font-display font-light text-primary leading-[1.08] tracking-tight text-[clamp(2.4rem,6vw,4.5rem)] max-w-3xl mb-6">
          Don't let what you built <span className="font-script text-[1.06em] text-brand-primary font-semibold inline-block -rotate-[3deg] px-1 translate-y-1">disappear</span>.
        </h2>

        {/* Subtitle */}
        <p className="text-secondary text-[15px] font-light max-w-md mb-10 leading-relaxed">
          Set up your zero-knowledge digital legacy vault in less than 10 minutes. Protect your family today.
        </p>

        {/* Waitlist Capture / Onboarding */}
        <div className="w-full max-w-[440px]">
          {branding.waitlist_enabled ? (
            isSuccess ? (
              <div className="p-5 rounded-[8px] bg-brand-primary-transparent border border-brand-primary/20">
                <p className="text-[12px] font-bold uppercase tracking-wider text-brand-primary mb-1">Spot Confirmed</p>
                <p className="text-[20px] font-display font-light text-primary leading-none">
                  Waitlist Position: <span className="text-brand-primary font-mono font-semibold">#{position?.toLocaleString() || '128'}</span>
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
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link to="/onboarding">
                <button
                  className="h-[50px] px-6 rounded-[8px] text-[13px] font-semibold text-white bg-brand-primary hover:bg-brand-primary-hover active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  Protect My Legacy <ArrowRight size={13} />
                </button>
              </Link>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
