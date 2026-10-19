import { motion } from 'framer-motion';

export default function Features() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section id="how" className="py-28 bg-page overflow-hidden">
      <div className="max-w-[1100px] mx-auto px-6 space-y-32">
        
        {/* Section Title */}
        <div className="max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] mb-4 text-brand-primary">
            How it works
          </p>
          <h2 className="font-display font-light text-primary leading-[1.08] tracking-tight text-[clamp(2.2rem,5vw,3.8rem)]">
            Three quiet steps.<br />Ten minutes. Protected for good.
          </h2>
        </div>

        {/* ── ROW 1: Step 1 (Text Left, visual Right) ── */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
        >
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="font-display text-[0.95rem] text-brand-primary italic">Step one</div>
            <h3 className="font-display font-light text-primary text-[clamp(1.6rem,2.6vw,2.3rem)] tracking-tight leading-tight">
              Add your accounts. Encrypted before they leave your device.
            </h3>
            <p className="text-secondary text-[1rem] leading-relaxed font-light">
              Everything your family might need, sealed in a vault only you can open. We store scrambled text - reading it ourselves is mathematically impossible.
            </p>
            <ul className="space-y-3 text-[0.92rem] text-secondary">
              <li className="flex items-start gap-2.5">
                <span className="w-[19px] h-[19px] rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <svg className="w-[10px] h-[10px] stroke-brand-primary stroke-[2.5px] fill-none" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                <span>Banks, Gmail, Zerodha, iCloud, Apple ID</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-[19px] h-[19px] rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <svg className="w-[10px] h-[10px] stroke-brand-primary stroke-[2.5px] fill-none" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                <span>Crypto wallets, seed phrases, hardware keys</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-[19px] h-[19px] rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <svg className="w-[10px] h-[10px] stroke-brand-primary stroke-[2.5px] fill-none" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                <span>Online businesses, domains, insurance</span>
              </li>
            </ul>
          </motion.div>

          <motion.div 
            variants={itemVariants} 
            className="bg-surface border border-border-base rounded-[15px] shadow p-6 relative overflow-hidden"
          >
            <div className="text-[0.68rem] font-semibold tracking-[0.1em] uppercase text-muted mb-4">Your vault · encrypted</div>
            {[
              { icon: '🏦', name: 'HDFC Bank', sub: '₹3.2L' },
              { icon: '✉️', name: 'Gmail', sub: 'Master key' },
              { icon: '📈', name: 'Zerodha', sub: '₹18.4L' },
              { icon: '₿', name: 'Bitcoin seed', sub: 'Ledger' }
            ].map((row, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-page border border-border-base rounded-[10px] mt-2 first:mt-0">
                <div className="w-[30px] h-[30px] rounded-[8px] bg-raised flex items-center justify-center text-[0.85rem] shrink-0">{row.icon}</div>
                <span className="flex-grow text-[0.83rem] font-medium text-primary">{row.name}</span>
                <span className="text-[0.72rem] text-muted mr-2">{row.sub}</span>
                <span className="text-[0.64rem] font-bold px-2 py-0.5 rounded-full bg-brand-primary/15 text-brand-primary">Secured</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── ROW 2: Step 2 (Text Right, visual Left) ── */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
        >
          <motion.div 
            variants={itemVariants} 
            className="order-last lg:order-first bg-surface border border-border-base rounded-[15px] shadow p-6 relative overflow-hidden"
          >
            <div className="text-[0.68rem] font-semibold tracking-[0.1em] uppercase text-muted mb-4">Your guardians</div>
            {[
              { letter: 'S', name: 'Sunita · Mother', color: '#6B8E6B' },
              { letter: 'R', name: 'Rohan · Brother', color: '#4A7FB5' },
              { letter: 'P', name: 'Priya · Spouse', color: '#B08D3E' }
            ].map((g, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-page border border-border-base rounded-[10px] mt-2 first:mt-0">
                <span className="w-[28px] h-[28px] rounded-full text-[0.66rem] font-bold flex items-center justify-center text-white shrink-0" style={{ backgroundColor: g.color }}>{g.letter}</span>
                <div className="flex-grow">
                  <div className="text-[0.83rem] font-medium text-primary">{g.name}</div>
                  <div className="text-[0.72rem] text-muted font-mono">Fragment {idx+1} of 3</div>
                </div>
                <span className="text-[0.64rem] font-bold px-2 py-0.5 rounded-full bg-brand-primary/15 text-brand-primary">Accepted</span>
              </div>
            ))}
            <div className="mt-[13px] p-[11px_13px] bg-brand-primary/10 rounded-[9px] text-[0.76rem] text-brand-primary font-medium">
              🔐 Any 2 of 3 can unlock - no one holds full access alone.
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-6">
            <div className="font-display text-[0.95rem] text-brand-primary italic">Step two</div>
            <h3 className="font-display font-light text-primary text-[clamp(1.6rem,2.6vw,2.3rem)] tracking-tight leading-tight">
              Choose guardians. No single one can open it alone.
            </h3>
            <p className="text-secondary text-[1rem] leading-relaxed font-light">
              Your trusted people each hold one fragment of the key. It takes two of them together to unlock - the same maths that guards the world's most sensitive systems.
            </p>
            <ul className="space-y-3 text-[0.92rem] text-secondary">
              <li className="flex items-start gap-2.5">
                <span className="w-[19px] h-[19px] rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <svg className="w-[10px] h-[10px] stroke-brand-primary stroke-[2.5px] fill-none" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                <span>Pick 2 to 5 people you trust</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-[19px] h-[19px] rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <svg className="w-[10px] h-[10px] stroke-brand-primary stroke-[2.5px] fill-none" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                <span>Any 2 of 3 fragments reconstruct the key</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-[19px] h-[19px] rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <svg className="w-[10px] h-[10px] stroke-brand-primary stroke-[2.5px] fill-none" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                <span>Change guardians anytime - vault stays sealed</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* ── ROW 3: Step 3 (Text Left, visual Right) ── */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
        >
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="font-display text-[0.95rem] text-brand-primary italic">Step three</div>
            <h3 className="font-display font-light text-primary text-[clamp(1.6rem,2.6vw,2.3rem)] tracking-tight leading-tight">
              Your family inherits - guided, gentle, automatic.
            </h3>
            <p className="text-secondary text-[1rem] leading-relaxed font-light">
              If you stop checking in, we reach out first - quietly, several times. Only then do guardians receive plain-language steps for every account. No jargon in a hard moment.
            </p>
            <ul className="space-y-3 text-[0.92rem] text-secondary">
              <li className="flex items-start gap-2.5">
                <span className="w-[19px] h-[19px] rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <svg className="w-[10px] h-[10px] stroke-brand-primary stroke-[2.5px] fill-none" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                <span>Smart check-ins - knows travel from emergency</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-[19px] h-[19px] rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <svg className="w-[10px] h-[10px] stroke-brand-primary stroke-[2.5px] fill-none" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                <span>Reminders long before anything is shared</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-[19px] h-[19px] rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <svg className="w-[10px] h-[10px] stroke-brand-primary stroke-[2.5px] fill-none" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                <span>Plain-English guidance, account by account</span>
              </li>
            </ul>
          </motion.div>

          <motion.div 
            variants={itemVariants} 
            className="bg-surface border border-border-base rounded-[15px] shadow p-6 relative overflow-hidden"
          >
            <div className="text-[0.68rem] font-semibold tracking-[0.1em] uppercase text-muted mb-6">Check-in status</div>
            
            {/* Timeline switch track */}
            <div className="flex items-center mb-6 relative">
              {/* Lines */}
              <div className="absolute top-[5px] left-[12.5%] right-[12.5%] h-[2px] bg-border-base z-0">
                <div className="h-full bg-brand-primary" style={{ width: '33.33%' }} />
              </div>
              
              {/* Nodes */}
              {['Active', 'Remind', 'Alert', 'Release'].map((node, i) => (
                <div key={i} className="flex-1 text-center relative z-10">
                  <div className={`w-[12px] h-[12px] rounded-full mx-auto mb-2 border-2 border-page ${i === 0 ? 'bg-brand-primary' : i === 1 ? 'bg-brand-primary ring-4 ring-brand-primary/25' : 'bg-border-strong'}`} />
                  <span className={`text-[0.64rem] font-bold tracking-[0.06em] uppercase ${i <= 1 ? 'text-brand-primary' : 'text-muted'}`}>{node}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 p-3 bg-page border border-border-base rounded-[10px]">
              <span className="text-base shrink-0">✅</span>
              <span className="text-[0.83rem] font-semibold text-brand-primary">Checked in 2 days ago</span>
            </div>

            <div className="mt-3 p-[11px_13px] bg-brand-primary/10 rounded-[9px] text-[0.76rem] text-brand-primary font-medium">
              If activated, guardians get step-by-step access guidance for every account in your vault.
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
