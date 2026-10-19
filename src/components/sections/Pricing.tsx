import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { getStoredPlans, Plan } from '../../services/paymentService';
import PaymentModal from '../payment/PaymentModal';

export default function Pricing() {
  const [yearly, setYearly] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const storedPlans = getStoredPlans().filter(p => p.active);

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  return (
    <section id="pricing" className="py-24 bg-page border-y border-base relative overflow-hidden">
      <div className="max-w-[1100px] mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-primary">
            Pricing
          </p>
          <h2 className="font-display font-light text-primary leading-[1.08] tracking-tight text-[clamp(2.2rem,5vw,3.8rem)]">
            Invest in peace of mind
          </h2>
          <p className="text-secondary text-[14px] leading-relaxed max-w-xl mx-auto font-light">
            Lock in your rate at our founding member tier. Cancel at any time.
          </p>

          {/* Monthly / Yearly Toggle */}
          <div className="pt-6 flex justify-center">
            <div className="inline-flex items-center rounded-full p-1 border border-border-base bg-surface">
              <button
                onClick={() => setYearly(false)}
                className={`px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all ${
                  !yearly 
                    ? 'bg-page text-primary shadow-sm border border-border-base' 
                    : 'text-secondary hover:text-primary'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setYearly(true)}
                className={`px-4 py-1.5 rounded-full text-[12px] font-semibold flex items-center gap-1.5 transition-all ${
                  yearly 
                    ? 'bg-page text-primary shadow-sm border border-border-base' 
                    : 'text-secondary hover:text-primary'
                }`}
              >
                Yearly
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary font-bold">
                  SAVE 40%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {storedPlans.map((plan, i) => {
            const price = yearly ? plan.yearlyPrice : plan.monthlyPrice;
            return (
              <motion.div
                key={plan.id || plan.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="relative rounded-[16px] p-8 bg-surface/50 transition-all duration-300 hover:translate-y-[-2px] flex flex-col justify-between"
                style={{
                  border: plan.highlighted ? '2px solid transparent' : '1px solid var(--color-border-base)',
                  backgroundImage: plan.highlighted 
                    ? 'linear-gradient(var(--color-bg-surface), var(--color-bg-surface)), var(--color-brand-gradient)'
                    : undefined,
                  backgroundClip: plan.highlighted ? 'padding-box, border-box' : undefined,
                  backgroundOrigin: plan.highlighted ? 'padding-box, border-box' : undefined,
                  boxShadow: plan.highlighted ? 'var(--shadow-brand)' : 'none',
                }}
              >
                {/* Popular Badge */}
                {plan.highlighted && (
                  <span 
                    className="absolute -top-3.5 left-6 text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full text-white"
                    style={{ background: 'var(--color-brand-gradient)' }}
                  >
                    Recommended
                  </span>
                )}

                <div>
                  {/* Plan Name */}
                  <h3 className="text-[18px] font-semibold text-primary mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-secondary text-[12px] font-light mb-6">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mb-6 flex items-baseline">
                    <span className="text-[36px] font-light text-primary font-display">${price}</span>
                    <span className="text-secondary text-[14px] font-light ml-1">/mo</span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3.5 mb-8">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-[13px] text-secondary font-light">
                        <Check size={14} className="text-brand-primary shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Button */}
                <button
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full py-2.5 rounded-[6px] text-[13px] font-semibold transition-all cursor-pointer ${
                    plan.highlighted 
                      ? 'text-white hover:opacity-90' 
                      : 'bg-surface border border-border-base text-secondary hover:text-primary hover:bg-raised'
                  }`}
                  style={{
                    background: plan.highlighted ? 'var(--color-brand-primary)' : undefined,
                  }}
                >
                  Select {plan.name} Plan
                </button>

              </motion.div>
            );
          })}
        </div>

        <p className="text-center text-[11px] text-secondary/40 mt-8 font-medium tracking-wide">
          All plans include client-side encryption. Price is locked at founding member rate forever.
        </p>

        {selectedPlan && (
          <PaymentModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedPlan(null);
            }}
            plan={selectedPlan}
            billingCycle={yearly ? 'yearly' : 'monthly'}
          />
        )}

      </div>
    </section>
  );
}
