import React, { useState } from 'react';
import { 
  CreditCard, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  Star, 
  ShieldCheck, 
  DollarSign, 
  X, 
  Layers
} from 'lucide-react';
import { getStoredPlans, saveStoredPlans, Plan } from '../../../services/paymentService';
import toast from 'react-hot-toast';

export default function PlanManagement() {
  const [plans, setPlans] = useState<Plan[]>(getStoredPlans);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formName, setFormName] = useState('');
  const [formMonthlyPrice, setFormMonthlyPrice] = useState(19);
  const [formYearlyPrice, setFormYearlyPrice] = useState(12);
  const [formDescription, setFormDescription] = useState('');
  const [formFeatures, setFormFeatures] = useState('');
  const [formMaxGuardians, setFormMaxGuardians] = useState(5);
  const [formMaxAssets, setFormMaxAssets] = useState(25);
  const [formHighlighted, setFormHighlighted] = useState(false);
  const [formActive, setFormActive] = useState(true);

  const handleOpenAdd = () => {
    setEditingPlan(null);
    setFormName('');
    setFormMonthlyPrice(29);
    setFormYearlyPrice(19);
    setFormDescription('Standard digital inheritance protection tier.');
    setFormFeatures('Unlimited encrypted items\n5 Guardian invitations\nAutomated Proof of Life\nHeir Succession Guide');
    setFormMaxGuardians(5);
    setFormMaxAssets(50);
    setFormHighlighted(false);
    setFormActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setFormName(plan.name);
    setFormMonthlyPrice(plan.monthlyPrice);
    setFormYearlyPrice(plan.yearlyPrice);
    setFormDescription(plan.description);
    setFormFeatures(plan.features.join('\n'));
    setFormMaxGuardians(plan.maxGuardians);
    setFormMaxAssets(plan.maxAssets);
    setFormHighlighted(plan.highlighted);
    setFormActive(plan.active);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error('Plan name is required');
      return;
    }

    const featureList = formFeatures
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    let updated: Plan[];

    if (editingPlan) {
      updated = plans.map((p) =>
        p.id === editingPlan.id
          ? {
              ...p,
              name: formName.trim(),
              monthlyPrice: Number(formMonthlyPrice),
              yearlyPrice: Number(formYearlyPrice),
              description: formDescription.trim(),
              features: featureList,
              maxGuardians: Number(formMaxGuardians),
              maxAssets: Number(formMaxAssets),
              highlighted: formHighlighted,
              active: formActive,
            }
          : p
      );
      toast.success(`Plan "${formName}" updated successfully`);
    } else {
      const newPlan: Plan = {
        id: `plan_${Date.now()}`,
        name: formName.trim(),
        monthlyPrice: Number(formMonthlyPrice),
        yearlyPrice: Number(formYearlyPrice),
        description: formDescription.trim(),
        features: featureList,
        maxGuardians: Number(formMaxGuardians),
        maxAssets: Number(formMaxAssets),
        highlighted: formHighlighted,
        active: formActive,
      };
      updated = [...plans, newPlan];
      toast.success(`New plan tier "${formName}" created`);
    }

    setPlans(updated);
    saveStoredPlans(updated);
    setIsModalOpen(false);
  };

  const handleDeletePlan = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the plan "${name}"?`)) {
      const updated = plans.filter((p) => p.id !== id);
      setPlans(updated);
      saveStoredPlans(updated);
      toast.success(`Plan "${name}" removed`);
    }
  };

  const handleToggleActive = (id: string) => {
    const updated = plans.map((p) =>
      p.id === id ? { ...p, active: !p.active } : p
    );
    setPlans(updated);
    saveStoredPlans(updated);
    toast.success('Plan availability toggled');
  };

  return (
    <div className="space-y-8 animate-fadeIn text-[#E9E6DF]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
              Monetization Engine
            </span>
          </div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">
            Subscription Plan Tiers
          </h1>
          <p className="text-xs text-[#9B97A3] mt-1">
            Configure pricing, quotas, features, and highlight badges across the public checkout portal.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl bg-brand-primary hover:opacity-90 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-primary/20 flex items-center gap-2 self-start md:self-auto transition-all"
        >
          <Plus size={16} /> Create Plan Tier
        </button>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`p-6 rounded-2xl bg-[#0E1015] border transition-all flex flex-col justify-between relative overflow-hidden ${
              plan.highlighted
                ? 'border-brand-primary/50 shadow-xl shadow-brand-primary/10'
                : 'border-[rgba(255,255,255,0.08)] hover:border-white/20'
            }`}
          >
            {plan.highlighted && (
              <span className="absolute top-3 right-4 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest bg-brand-primary text-white flex items-center gap-1 shadow-md">
                <Star size={11} className="fill-white" /> Recommended
              </span>
            )}

            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-display font-bold text-white tracking-tight">
                  {plan.name}
                </h3>
                {!plan.active && (
                  <span className="px-2 py-0.5 rounded text-[9px] uppercase font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    Inactive
                  </span>
                )}
              </div>

              <p className="text-xs text-[#9B97A3] mb-5 min-h-[36px] leading-relaxed">
                {plan.description}
              </p>

              <div className="mb-6 p-4 rounded-xl bg-[#08090C] border border-[rgba(255,255,255,0.06)] flex items-baseline justify-between font-mono">
                <div>
                  <span className="text-2xl font-bold text-white">${plan.yearlyPrice}</span>
                  <span className="text-[11px] text-[#9B97A3]">/mo (Yearly)</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-[#9B97A3]">${plan.monthlyPrice}</span>
                  <span className="text-[10px] text-[#6B6675]">/mo (Monthly)</span>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-[11px] text-[#9B97A3]">
                  <span>Max Guardians:</span>
                  <span className="text-white font-mono font-bold">{plan.maxGuardians >= 999 ? 'Unlimited' : plan.maxGuardians}</span>
                </div>
                <div className="flex justify-between text-[11px] text-[#9B97A3]">
                  <span>Max Assets:</span>
                  <span className="text-white font-mono font-bold">{plan.maxAssets >= 9999 ? 'Unlimited' : plan.maxAssets}</span>
                </div>
              </div>

              <ul className="space-y-2.5 mb-6 border-t border-[rgba(255,255,255,0.06)] pt-4">
                {plan.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-[#E9E6DF]">
                    <Check size={14} className="text-brand-primary shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between gap-2">
              <button
                onClick={() => handleToggleActive(plan.id)}
                className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-colors ${
                  plan.active
                    ? 'text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10'
                    : 'text-[#9B97A3] border-white/10 hover:text-white'
                }`}
              >
                {plan.active ? 'Active' : 'Enable'}
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(plan)}
                  className="p-2 rounded-lg text-[#9B97A3] hover:text-white hover:bg-white/5 transition-colors"
                  title="Edit Plan"
                >
                  <Edit3 size={15} />
                </button>
                <button
                  onClick={() => handleDeletePlan(plan.id, plan.name)}
                  className="p-2 rounded-lg text-[#9B97A3] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Delete Plan"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Plan Edit / Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <form
            onSubmit={handleSave}
            className="w-full max-w-lg bg-[#08090C] border border-[rgba(255,255,255,0.1)] rounded-2xl p-6 text-[#E9E6DF] my-8 space-y-5"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[rgba(255,255,255,0.08)]">
              <h3 className="font-display font-bold text-lg text-white">
                {editingPlan ? `Edit Tier: ${editingPlan.name}` : 'Create New Subscription Tier'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-[#9B97A3] hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#9B97A3] block mb-1">
                  Plan Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Enterprise Executive"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#0E1015] border border-[rgba(255,255,255,0.08)] rounded-xl text-white focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#9B97A3] block mb-1">
                    Monthly Price ($ USD)
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formMonthlyPrice}
                    onChange={(e) => setFormMonthlyPrice(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-[#0E1015] border border-[rgba(255,255,255,0.08)] rounded-xl text-white font-mono focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#9B97A3] block mb-1">
                    Yearly Rate ($ USD/mo)
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formYearlyPrice}
                    onChange={(e) => setFormYearlyPrice(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-[#0E1015] border border-[rgba(255,255,255,0.08)] rounded-xl text-white font-mono focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#9B97A3] block mb-1">
                  Tagline / Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. For family offices and institutional trust administration."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#0E1015] border border-[rgba(255,255,255,0.08)] rounded-xl text-white focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#9B97A3] block mb-1">
                    Max Guardians (Quota)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formMaxGuardians}
                    onChange={(e) => setFormMaxGuardians(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-[#0E1015] border border-[rgba(255,255,255,0.08)] rounded-xl text-white font-mono focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#9B97A3] block mb-1">
                    Max Assets (Quota)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formMaxAssets}
                    onChange={(e) => setFormMaxAssets(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-[#0E1015] border border-[rgba(255,255,255,0.08)] rounded-xl text-white font-mono focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#9B97A3] block mb-1">
                  Feature Highlights (One per line)
                </label>
                <textarea
                  rows={4}
                  value={formFeatures}
                  onChange={(e) => setFormFeatures(e.target.value)}
                  placeholder="Unlimited vault assets&#10;Quantum-resistant keys&#10;Dedicated phone concierge"
                  className="w-full px-4 py-2.5 bg-[#0E1015] border border-[rgba(255,255,255,0.08)] rounded-xl text-white font-mono text-xs focus:outline-none focus:border-brand-primary leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formHighlighted}
                    onChange={(e) => setFormHighlighted(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-600 text-brand-primary focus:ring-0 bg-[#0E1015]"
                  />
                  <span className="text-xs text-[#E9E6DF]">Highlight as "Recommended"</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formActive}
                    onChange={(e) => setFormActive(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-600 text-brand-primary focus:ring-0 bg-[#0E1015]"
                  />
                  <span className="text-xs text-[#E9E6DF]">Active for Public Purchase</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[rgba(255,255,255,0.08)]">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold uppercase text-[#9B97A3] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-brand-primary text-white font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
              >
                {editingPlan ? 'Save Changes' : 'Publish Plan'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
