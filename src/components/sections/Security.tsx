import { motion } from 'framer-motion';
import { Shield, Key, EyeOff } from 'lucide-react';

const cards = [
  {
    tag: "PROTOCOL::AES_256_GCM",
    icon: Shield,
    title: "Device-Level Encryption",
    desc: "Your data is sealed on your local device before transmission. The unencrypted payload never touches our network.",
  },
  {
    tag: "SHARDING::SSS_M_OF_N",
    icon: Key,
    title: "Distributed Key Shards",
    desc: "Shards are generated using polynomial cryptography. No single guardian has access - they must reach threshold consensus.",
  },
  {
    tag: "ARCHITECTURE::ZERO_KNOWLEDGE",
    icon: EyeOff,
    title: "Zero-Knowledge Restraint",
    desc: "We do not store master passwords or maintain backdoors. Recovery is mathematically impossible without your guardians.",
  },
];

export default function Security() {
  return (
    <section 
      id="security" 
      className="py-28 overflow-hidden relative select-none bg-[#090C09]"
    >
      {/* Background radial gradient glow */}
      <div 
        className="absolute top-0 inset-x-0 h-[500px] pointer-events-none opacity-50"
        style={{ background: 'radial-gradient(circle at 50% 0%, var(--color-brand-primary-dim), transparent 70%)' }}
      />

      <div className="max-w-[1100px] mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-20">
          <span 
            className="text-[10px] font-bold uppercase tracking-[0.18em] px-2.5 py-1 rounded-full border mb-5 inline-block text-brand-primary border-white/5 bg-white/5"
          >
            Cryptographic Integrity
          </span>
          <h2 className="font-display font-light leading-[1.08] tracking-tight text-[clamp(2.2rem,5vw,3.8rem)] text-white">
            We are mathematically incapable <span className="font-script text-[1.1em] text-brand-primary inline-block -rotate-[2deg] translate-y-1">of reading your data</span>.
          </h2>
          <p className="text-secondary/80 text-[15px] leading-relaxed mt-4 font-light max-w-xl">
            Not policy promises. Pure zero-knowledge architecture. Everything is client-side encrypted before syncing.
          </p>
        </div>

        {/* 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group border rounded-[12px] p-8 transition-all duration-300 hover:translate-y-[-2px] flex flex-col items-start bg-[#121612] border-white/5"
              >
                {/* Mono Tag */}
                <span 
                  className="font-mono text-[9px] uppercase tracking-wider mb-8 text-white/40"
                >
                  {card.tag}
                </span>

                {/* Icon */}
                <div 
                  className="w-10 h-10 rounded-[8px] flex items-center justify-center mb-6 bg-brand-primary/10 border border-brand-primary/15"
                >
                  <Icon size={16} className="text-brand-primary" strokeWidth={2} />
                </div>

                {/* Title */}
                <h3 className="text-[16px] font-semibold text-white mb-2">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-secondary/80 text-[13px] leading-relaxed font-light">
                  {card.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
