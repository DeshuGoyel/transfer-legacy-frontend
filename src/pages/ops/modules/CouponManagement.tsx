import React, { useState, useEffect } from 'react';
import { 
  Tag, 
  Plus, 
  Trash2, 
  Copy, 
  CheckCircle2, 
  Clock, 
  Percent, 
  X, 
  AlertCircle,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { fetchCoupons, Coupon } from '../../../services/paymentService';
import { opsApi } from '../../../lib/opsApi';
import toast from 'react-hot-toast';

export default function CouponManagement() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [code, setCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(25);
  const [maxUses, setMaxUses] = useState(100);
  const [expiresAt, setExpiresAt] = useState('2027-12-31');
  const [description, setDescription] = useState('');

  const loadCoupons = async () => {
    setIsLoading(true);
    try {
      const data = await fetchCoupons();
      setCoupons(data);
    } catch (err: any) {
      console.error('Failed to load coupons:', err);
      toast.error(err.message || 'Failed to load coupons from database');
      setCoupons([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error('Coupon code is required');
      return;
    }

    const trimmedCode = code.trim().toUpperCase();
    if (coupons.some((c) => c.code.toUpperCase() === trimmedCode)) {
      toast.error('A coupon with this code already exists');
      return;
    }

    try {
      await opsApi.post('/ops/coupons', {
        code: trimmedCode,
        discount_percent: Number(discountPercent),
        max_uses: Number(maxUses),
        expires_at: new Date(`${expiresAt}T23:59:59Z`).toISOString(),
        description: description.trim() || undefined,
      });

      toast.success(`Coupon ${trimmedCode} created in database!`);
      await loadCoupons();
      setIsModalOpen(false);
      setCode('');
      setDescription('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create coupon in database');
    }
  };

  const handleDeleteCoupon = async (id: string, couponCode: string) => {
    if (confirm(`Are you sure you want to delete coupon "${couponCode}"?`)) {
      try {
        await opsApi.delete(`/ops/coupons/${id}`);
        toast.success(`Coupon ${couponCode} deleted from database`);
        await loadCoupons();
      } catch (err: any) {
        toast.error(err.message || 'Failed to delete coupon');
      }
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      await opsApi.post(`/ops/coupons/${id}/toggle`);
      toast.success('Coupon status updated in database');
      await loadCoupons();
    } catch (err: any) {
      toast.error(err.message || 'Failed to toggle coupon status');
    }
  };

  const handleCopyCode = (couponCode: string) => {
    navigator.clipboard.writeText(couponCode);
    toast.success(`Copied "${couponCode}" to clipboard!`);
  };

  return (
    <div className="space-y-8 animate-fadeIn text-[#E9E6DF]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
              Promotional Engine
            </span>
          </div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">
            Coupon & Discount Management
          </h1>
          <p className="text-xs text-[#9B97A3] mt-1">
            Generate promotional codes, track redemption caps, and manage partner discount campaigns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadCoupons}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-[#0E1015] border border-[rgba(255,255,255,0.08)] hover:text-white text-[#9B97A3] transition-all disabled:opacity-50"
            title="Refresh database coupons"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-brand-primary hover:opacity-90 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-primary/20 flex items-center gap-2 self-start md:self-auto transition-all"
          >
            <Plus size={16} /> New Coupon Code
          </button>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="rounded-2xl bg-[#0E1015] border border-[rgba(255,255,255,0.07)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.07)] bg-[#08090C]/50 text-[10px] font-bold uppercase tracking-wider text-[#9B97A3]">
                <th className="py-4 px-6">Coupon Code</th>
                <th className="py-4 px-6">Discount</th>
                <th className="py-4 px-6">Usage / Limit</th>
                <th className="py-4 px-6">Expiration</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,255,255,0.05)] text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#9B97A3]">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-primary" />
                    <span>Loading promotional coupons from database...</span>
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#9B97A3]">
                    No promotional coupons found. Click "New Coupon Code" to launch a campaign.
                  </td>
                </tr>
              ) : (
                coupons.map((c) => {
                  const isExpired = new Date(c.expiresAt).getTime() < Date.now();
                  const isFull = c.currentUses >= c.maxUses;

                  return (
                    <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-bold text-sm text-white tracking-wider bg-[#08090C] px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                            <Tag size={13} className="text-brand-primary" />
                            {c.code}
                          </span>
                          <button
                            onClick={() => handleCopyCode(c.code)}
                            title="Copy Code"
                            className="p-1.5 rounded-lg text-[#9B97A3] hover:text-white hover:bg-white/5 transition-colors"
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                        {c.description && (
                          <p className="text-[11px] text-[#9B97A3] mt-1">{c.description}</p>
                        )}
                      </td>

                      <td className="py-4 px-6 font-mono text-emerald-400 font-bold text-sm">
                        {c.discountPercent}% OFF
                      </td>

                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <span className="font-mono text-xs text-white">
                            {c.currentUses} / {c.maxUses} used
                          </span>
                          <div className="w-28 h-1.5 bg-[#08090C] rounded-full overflow-hidden border border-white/5">
                            <div
                              className="h-full bg-brand-primary rounded-full"
                              style={{ width: `${Math.min(100, (c.currentUses / c.maxUses) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 font-mono text-[#9B97A3] text-xs">
                        {c.expiresAt}
                      </td>

                      <td className="py-4 px-6">
                        {isExpired ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            Expired
                          </span>
                        ) : isFull ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            Limit Reached
                          </span>
                        ) : c.active ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Active
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-white/5 text-[#9B97A3] border border-white/10">
                            Disabled
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleActive(c.id)}
                            className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-colors ${
                              c.active
                                ? 'text-amber-400 border-amber-500/20 hover:bg-amber-500/10'
                                : 'text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10'
                            }`}
                          >
                            {c.active ? 'Disable' : 'Enable'}
                          </button>

                          <button
                            onClick={() => handleDeleteCoupon(c.id, c.code)}
                            className="p-1.5 rounded-lg text-[#9B97A3] hover:text-rose-500 hover:bg-white/5 transition-colors"
                            title="Delete Coupon"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form
            onSubmit={handleCreateCoupon}
            className="w-full max-w-md bg-[#08090C] border border-[rgba(255,255,255,0.1)] rounded-2xl p-6 text-[#E9E6DF] space-y-4"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[rgba(255,255,255,0.08)]">
              <h3 className="font-display font-bold text-lg text-white">
                Create Promo Coupon
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
                  Coupon Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUMMER50"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-2.5 bg-[#0E1015] border border-[rgba(255,255,255,0.08)] rounded-xl text-white font-mono uppercase focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#9B97A3] block mb-1">
                    Discount Percentage (%)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-[#0E1015] border border-[rgba(255,255,255,0.08)] rounded-xl text-white font-mono focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#9B97A3] block mb-1">
                    Max Redemptions
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={maxUses}
                    onChange={(e) => setMaxUses(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-[#0E1015] border border-[rgba(255,255,255,0.08)] rounded-xl text-white font-mono focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#9B97A3] block mb-1">
                  Expiration Date
                </label>
                <input
                  type="date"
                  required
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#0E1015] border border-[rgba(255,255,255,0.08)] rounded-xl text-white font-mono focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#9B97A3] block mb-1">
                  Description / Campaign Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Zorvik Tech partner special promo"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#0E1015] border border-[rgba(255,255,255,0.08)] rounded-xl text-white focus:outline-none focus:border-brand-primary"
                />
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
                Launch Coupon
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
