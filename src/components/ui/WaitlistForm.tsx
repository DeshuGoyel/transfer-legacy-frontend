import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { waitlistSchema, WaitlistFormData } from '../../lib/validations';
import Button from './Button';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { Lock, Loader2, ShieldCheck, CheckCircle2 } from 'lucide-react';

import { api } from '../../lib/api';

export function WaitlistForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [position, setPosition] = useState<number | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const mouseX = useMotionValue(200);
  const mouseY = useMotionValue(200);
  const rotateX = useTransform(mouseY, [0, 400], [8, -8]);
  const rotateY = useTransform(mouseX, [0, 400], [-8, 8]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  function handleMouseLeave() {
    mouseX.set(200);
    mouseY.set(200);
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
  });

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F97316', '#A855F7', '#EC4899', '#ffffff']
    });
  };

  const onSubmit = async (data: WaitlistFormData) => {
    setIsSubmitting(true);
    try {
      const result = await api.post<{ position?: number; isNew?: boolean }>('/app/waitlist', { email: data.email, name: null }, { skipAead: true });
      const waitlistData = result.data ? result.data : result;

      setPosition(waitlistData.position ?? null);
      setIsSuccess(true);
      triggerConfetti();

      if (waitlistData.isNew) {
        toast.success('Successfully joined waitlist!');
      } else {
        // More prominent notification for existing users
        toast.error('You are already on the list!', {
          duration: 5000,
          icon: '⚠️',
          style: {
            border: '1px solid var(--color-brand-primary)',
            padding: '16px',
            color: 'var(--color-text-primary)',
            background: 'var(--color-bg-surface)',
          },
        });
      }

    } catch (error: unknown) {
      console.error('Waitlist error:', error);
      const msg = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ perspective: 1200 }} className="w-full max-w-md mx-auto relative z-10">
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full"
      >
        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ transform: "translateZ(30px)" }}
            className="bg-brand-primary/10 border border-brand-primary/30 rounded-2xl p-8 text-center shadow-lg backdrop-blur-md"
          >
            <div className="w-16 h-16 bg-brand-primary/20 text-brand-primary rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-2xl font-bold text-primary font-display mb-2">You're on the list!</h3>
            <p className="text-secondary mb-6 text-lg">
              Status: <strong className="text-brand-gold text-xl">#{position?.toLocaleString()}</strong>
            </p>
            <div className="text-sm text-muted">
              We'll email you when beta access opens.
            </div>
          </motion.div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ transform: "translateZ(30px)" }}
            className="w-full bg-surface/80 backdrop-blur-xl border border-base rounded-3xl p-8 shadow-xl group relative overflow-hidden"
          >
            <motion.div
              animate={{ opacity: isFocused ? 1 : 0 }}
              className="absolute inset-0 bg-gradient-to-tr from-brand-primary/10 to-transparent pointer-events-none transition-opacity duration-300"
            />

            <div className="flex flex-col gap-5 relative z-10">
              <div className="relative">
                <motion.input
                  {...register('email')}
                  type="email"
                  placeholder="Enter your email address"
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  style={{ transform: "translateZ(20px)" }}
                  whileFocus={{ scale: 1.01 }}
                  className="w-full bg-page/50 border border-base focus:border-brand-primary rounded-xl px-5 py-4 text-primary placeholder-muted transition-all focus:shadow-[0_0_20px_rgba(249,115,22,0.15)] block"
                />
                <AnimatePresence>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="text-error text-sm pl-2 mt-2 font-medium"
                    >
                      {errors.email.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 text-lg font-bold bg-brand-primary hover:bg-brand-primary-hover text-white shadow-brand transition-all flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-90' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Securing Spot...
                  </>
                ) : (
                  <>
                    <Lock size={18} className="opacity-80" />
                    Claim Your Spot
                  </>
                )}
              </Button>
            </div>

            <div className="mt-6 flex flex-col items-center gap-3 relative z-10">
              <div className="flex items-center gap-4 text-[11px] font-medium text-muted uppercase tracking-wider">
                <div className="flex items-center gap-1.5 border border-base bg-surface/50 rounded-full px-2.5 py-1">
                  <ShieldCheck size={12} className="text-brand-success" />
                  AES-256 Encrypted
                </div>
                <div className="flex items-center gap-1.5 border border-base bg-surface/50 rounded-full px-2.5 py-1">
                  <Lock size={12} className="text-brand-primary" />
                  Zero-Knowledge
                </div>
              </div>
              <p className="text-xs text-muted text-center">
                Zero spam. Cancel anytime. Join 2,400+ protected families.
              </p>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
