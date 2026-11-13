import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const faqs = [
  {
    q: "Can Transfer Legacy see my private key or vault data?",
    a: "No. We utilize a strict client-side zero-knowledge architecture. Your passwords, documents, and private keys are encrypted directly on your local device using XChaCha20-Poly1305 before uploading. We store only scrambled ciphertext - we physically cannot decrypt your data."
  },
  {
    q: "How does the Dead Man's Switch actually work?",
    a: "We monitor your pings. If you miss your check-in interval, we send warning alerts via email and SMS. If you remain inactive past the grace period, your guardians are authorized to submit their shards. Shards are mathematically compiled, and only then is the key reconstituted to decrypt the vault."
  },
  {
    q: "What happens if Transfer Legacy goes out of business?",
    a: "Your vault is encrypted client-side. We also provide a downloadable open-source recovery script. Even if our servers permanently go offline, your family can run the script locally and reassemble your legacy offline using the guardian shards."
  },
  {
    q: "How is this different from sharing passwords in 1Password?",
    a: "Standard sharing grants immediate access. Transfer Legacy is built for inheritance. Access is sealed behind a liveness trigger. No single person (not even a guardian) can view your data until the switch conditions are met, protecting you from premature disclosure."
  },
  {
    q: "Is this legally binding in my country?",
    a: "Yes. Transfer Legacy is a cryptographic storage and transfer protocol. In most jurisdictions, digital assets can be passed via private contract or trusts. We recommend storing a copy of your formal will alongside your digital assets."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 bg-page relative overflow-hidden">
      <div className="max-w-[800px] mx-auto px-6">
        
        {/* Section Header */}
        <div className="mb-16 space-y-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-primary">
            FAQ
          </p>
          <h2 className="font-display font-light text-primary leading-[1.08] tracking-tight text-[clamp(2.2rem,5vw,3.5rem)]">
            Frequently Asked Questions
          </h2>
        </div>

        {/* Linear-Style Accordion list */}
        <div className="border-t border-border-base divide-y divide-border-base">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className="py-5">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between text-left gap-4 group cursor-pointer"
                >
                  <span className="text-[15px] font-medium text-secondary group-hover:text-primary transition-colors leading-snug">
                    {faq.q}
                  </span>
                  <ChevronRight
                    size={16}
                    className="text-secondary/50 group-hover:text-primary transition-transform duration-300 shrink-0"
                    style={{ transform: isOpen ? 'rotate(90deg)' : 'none' }}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="text-secondary text-[13px] leading-relaxed font-light mt-3 pr-8">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
