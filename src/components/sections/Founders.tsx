import { motion } from 'framer-motion';

const founders = [
  {
    name: 'Deshu Goyel',
    role: 'Founder & CEO',
    bio: `Post-graduate in Computer Application and Marketing, Market Analyst, and expert in the discrepagraphic field. Deshu focuses on investment, management, and R&D, bridging strategic thinking with secure digital infrastructure.`,
    quote: `"The hardest part isn't building the vault. It's explaining to a grieving family why they can't access what was left for them."`,
    image: '/images/founder_deshu.png',
    initials: 'DG',
    accent: '#C9A050',
    gradientFrom: '#1C1A22',
    gradientTo: '#141318',
  },
  {
    name: 'Vikash Kumar Singh',
    role: 'Co-Founder & CTO',
    bio: `B.Tech graduate, backend developer, and Web3 expert. Vikash specializes in building scalable decentralized systems and secure infrastructure for the future of digital inheritance.`,
    quote: `"We built a system where 'trust' is replaced by 'proof'. Math doesn't lie."`,
    image: '/images/founder_vikash.png',
    initials: 'VK',
    accent: '#C9A050',
    gradientFrom: '#1C1A22',
    gradientTo: '#141318',
  },
];

export default function Founders() {
  return (
    <section id="founders" className="relative py-28 overflow-hidden" style={{ background: '#0C0B10' }}>
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(201,160,80,0.25), transparent)' }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.18em] mb-4"
            style={{ color: '#C9A050' }}
          >
            The Team
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Built by people who've felt this problem.
          </h2>
          <p className="text-white/40 text-lg max-w-2xl font-light">
            Not a team of generalists chasing a trend - two founders who got tired of waiting for someone else to solve this.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {founders.map((f, i) => (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.7 }}
              className="group rounded-[16px] overflow-hidden border transition-all duration-300 hover:border-[rgba(255,255,255,0.12)]"
              style={{ background: '#141318', borderColor: 'rgba(255,255,255,0.07)' }}
            >
              {/* Photo / gradient banner */}
              <div
                className="relative overflow-hidden"
                style={{ 
                  height: '400px',
                  background: `linear-gradient(135deg, ${f.gradientFrom}, ${f.gradientTo})` 
                }}
              >
                {/* Texture */}
                <div
                  className="absolute inset-0 opacity-20 mix-blend-overlay"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    backgroundSize: '180px',
                  }}
                />
                {/* Bottom fade */}
                <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#141318] to-transparent z-20" />

                {/* Real photo (falls back gracefully) */}
                <img
                  src={f.image}
                  alt={f.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 z-10"
                  style={{ objectPosition: 'center 20%' }}
                  onError={(_e) => { 
                    console.error('Failed to load image:', f.image);
                  }}
                />

                {/* Removed initials fallback as requested */}
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col gap-5">
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">{f.name}</h3>
                  <p
                    className="text-sm font-bold uppercase tracking-wider mt-1"
                    style={{ color: f.accent }}
                  >
                    {f.role}
                  </p>
                </div>

                <p className="text-white/40 text-sm leading-relaxed">{f.bio}</p>

                <blockquote
                  className="border-l-2 pl-4 italic text-white/55 text-sm leading-relaxed"
                  style={{ borderColor: `${f.accent}50` }}
                >
                  {f.quote}
                </blockquote>


              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
