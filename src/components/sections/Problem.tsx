import { motion } from 'framer-motion';

const cards = [
  {
    icon: "🏦",
    title: "Banks freeze on day one",
    desc: "Even a listed nominee waits 4–7 months through succession certificates, NOCs and indemnity bonds."
  },
  {
    icon: "✉️",
    title: "Gmail is the master key",
    desc: "Every reset and statement runs through email. Google deletes inactive accounts - and everything linked locks with it."
  },
  {
    icon: "📈",
    title: "A nominee can't just log in",
    desc: "Being named isn't access. Your family still needs a court certificate and months before a single rupee moves."
  },
  {
    icon: "📸",
    title: "Memories vanish for good",
    desc: "Apple's process to reach a lost iCloud runs 18+ months. Most accounts close first. The photos never come back."
  }
];

export default function Problem() {
  return (
    <section id="problem" className="py-24 bg-page border-y border-base relative overflow-hidden">
      <div className="max-w-[1100px] mx-auto px-6 relative z-10">
        
        {/* Section kicker */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-base bg-surface/40 text-secondary text-[11px] font-bold uppercase tracking-wider">
            The problem
          </div>
        </div>

        {/* Big Claim */}
        <p className="font-display font-light text-primary leading-[1.14] tracking-tight text-[clamp(1.9rem,3.4vw,2.9rem)] max-w-[900px] mb-14">
          When someone passes, families don't lose the money. They lose <span className="relative z-10 font-medium inline-block text-brand-primary after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-[0.02em] after:h-[0.15em] after:bg-brand-primary/10 after:-z-10">access to it</span> - accounts freeze, passwords vanish, and $140 billion disappears every year.
        </p>

        {/* Grid cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="border-t-2 border-primary pt-5 space-y-3"
            >
              <span className="text-[1.3rem] block">{card.icon}</span>
              <h3 className="text-[0.98rem] font-bold text-primary leading-snug">
                {card.title}
              </h3>
              <p className="text-secondary text-[0.86rem] leading-relaxed font-light">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
