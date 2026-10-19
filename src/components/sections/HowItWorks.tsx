import { motion } from 'framer-motion';
import { Lock, Users, KeyRound } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Lock,
    title: 'Encrypt everything in 3 minutes',
    desc: 'Add your seed phrases, wallet passwords, exchange accounts, and documents. Everything is encrypted locally - it never leaves your device in plaintext.',
    detail: 'Works with BTC, ETH, SOL, hardware wallets, password managers, and any text secret.',
    accentColor: '#C9A050',
    glowColor: 'rgba(201,160,80,0.08)',
    borderColor: 'rgba(201,160,80,0.20)',
  },
  {
    number: '02',
    icon: Users,
    title: 'Choose people you trust',
    desc: 'Assign guardians - close friends or family - who each hold a unique fragment. No single person holds everything. No single point of failure.',
    detail: "Based on Shamir's Secret Sharing. Even if one guardian is compromised, your vault stays safe.",
    accentColor: '#C9A050',
    glowColor: 'rgba(201,160,80,0.08)',
    borderColor: 'rgba(201,160,80,0.20)',
  },
  {
    number: '03',
    icon: KeyRound,
    title: 'Your family inherits - automatically',
    desc: 'If you stop checking in, your vault enters transfer mode. Guardians receive guided instructions in plain English. No blockchain knowledge required.',
    detail: 'Multiple fail-safes and escalation delays ensure false triggers are impossible.',
    accentColor: '#C9A050',
    glowColor: 'rgba(201,160,80,0.08)',
    borderColor: 'rgba(201,160,80,0.20)',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-28 overflow-hidden bg-page">
      {/* Left gradient bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-px"
        style={{ background: 'linear-gradient(to bottom, transparent, var(--color-brand-primary), var(--color-brand-secondary), transparent)', opacity: 0.3 }}
      />

      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-24"
        >
          <p className="text-xs font-bold tracking-[0.22em] uppercase mb-5 gradient-text-brand">
            How It Works
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-primary tracking-tight mb-4">
            Three steps. Three minutes.
          </h2>
          <p className="text-lg text-secondary max-w-md mx-auto">
            Built for humans, not cryptographers.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="flex flex-col gap-0">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isRight = i % 2 === 1;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: 0.1, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                className={`relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center py-20 ${
                  i < steps.length - 1 ? 'border-b border-border-base/10' : ''
                }`}
              >
                {/* Watermark number */}
                <div
                  className={`absolute ${isRight ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-[180px] font-bold select-none pointer-events-none leading-none opacity-[0.03] dark:opacity-[0.05] text-primary`}
                >
                  {step.number}
                </div>

                {/* Text */}
                <div className={`relative z-10 ${isRight ? 'lg:order-2' : ''}`}>
                  <div className="flex items-center gap-4 mb-7">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center border"
                      style={{ background: step.glowColor, borderColor: step.borderColor }}
                    >
                      <Icon size={22} style={{ color: step.accentColor }} />
                    </div>
                    <span className="text-xs font-bold font-mono tracking-wider" style={{ color: `${step.accentColor}80` }}>
                      Step {step.number}
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold text-primary mb-5 leading-tight tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-secondary/70 text-base leading-relaxed mb-5">
                    {step.desc}
                  </p>
                  <div
                    className="text-sm leading-relaxed px-4 py-3 rounded-xl border"
                    style={{ color: `${step.accentColor}90`, background: step.glowColor, borderColor: step.borderColor }}
                  >
                    → {step.detail}
                  </div>
                </div>

                {/* Visual */}
                <div className={`relative z-10 ${isRight ? 'lg:order-1' : ''} flex justify-center`}>
                  <div
                    className="w-full max-w-[340px] aspect-square rounded-3xl border border-border-base flex items-center justify-center relative overflow-hidden group bg-surface"
                  >
                    {/* Hover glow */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                      style={{ background: `radial-gradient(circle at 50% 50%, ${step.glowColor}, transparent 70%)` }}
                    />
                    {/* Ambient center glow */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-40 h-40 rounded-full blur-3xl opacity-20" style={{ background: step.glowColor }} />
                    </div>
                    {/* Icon */}
                    <div className="relative z-10 flex flex-col items-center gap-5">
                      <div
                        className="w-24 h-24 rounded-3xl border flex items-center justify-center"
                        style={{ background: step.glowColor, borderColor: step.borderColor }}
                      >
                        <Icon size={46} style={{ color: step.accentColor }} strokeWidth={1.4} />
                      </div>
                      <span
                        className="text-xs font-mono tracking-wider font-bold"
                        style={{ color: `${step.accentColor}50` }}
                      >
                        [{step.number}] {step.title.split(' ').slice(0, 2).join(' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--color-brand-primary), transparent)', opacity: 0.2 }}
      />
    </section>
  );
}
