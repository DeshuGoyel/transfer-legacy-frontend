import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, CreditCard, QrCode, Building, Coins, Tag, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { processZorvikPayment, validateCoupon, Plan } from '../../services/paymentService';
import toast from 'react-hot-toast';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan;
  billingCycle: 'yearly' | 'monthly';
  onPaymentSuccess?: (planName: string) => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  plan,
  billingCycle,
  onPaymentSuccess
}: PaymentModalProps) {
  const basePrice = billingCycle === 'yearly' ? plan.yearlyPrice * 12 : plan.monthlyPrice;
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountPercent: number;
    discountAmount: number;
    payableAmount: number;
  } | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'crypto'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedTx, setCompletedTx] = useState<{
    txId: string;
    amount: number;
    plan: string;
  } | null>(null);

  const currentPayable = appliedCoupon ? appliedCoupon.payableAmount : basePrice;

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    const result = validateCoupon(couponCode, basePrice);
    if (!result.valid) {
      toast.error(result.error || 'Invalid coupon code');
      setAppliedCoupon(null);
      return;
    }

    setAppliedCoupon({
      code: couponCode.trim().toUpperCase(),
      discountPercent: result.discountPercent || 0,
      discountAmount: result.discountAmount || 0,
      payableAmount: result.payableAmount ?? basePrice,
    });
    toast.success(`Coupon applied! ${result.discountPercent}% discount activated.`);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast('Coupon removed');
  };

  const handleExecutePayment = async () => {
    setIsProcessing(true);
    try {
      const userEmail = localStorage.getItem('tl_user_email') || 'vault.owner@protocol.internal';
      const userName = localStorage.getItem('tl_user_name') || 'Vault Owner';

      const result = await processZorvikPayment({
        planId: plan.id,
        planName: plan.name,
        amount: basePrice,
        currency: 'USD',
        couponCode: appliedCoupon?.code,
        paymentMethod,
        userEmail,
        userName,
      });

      if (result.success) {
        setCompletedTx({
          txId: result.transactionId,
          amount: result.amount,
          plan: result.planName,
        });
        toast.success(`Payment verified! Upgraded to ${result.planName} tier.`);
        if (onPaymentSuccess) {
          onPaymentSuccess(result.planName);
        }
      }
    } catch (err) {
      console.error('Zorvik payment failed:', err);
      toast.error('Transaction could not be completed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setCompletedTx(null);
    setAppliedCoupon(null);
    setCouponCode('');
    setIsProcessing(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-xl bg-[#08090C] border border-[rgba(255,255,255,0.1)] rounded-[28px] shadow-2xl overflow-hidden text-[#E9E6DF] my-8"
        >
          {/* Top Brand Bar */}
          <div className="px-6 py-4 bg-[#0E1015] border-b border-[rgba(255,255,255,0.07)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShieldCheck size={18} />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Zorvik Tech Payment Gateway
                </span>
                <p className="text-[10px] text-[#9B97A3] font-mono">
                  256-bit End-to-End Encrypted Checkout
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg text-[#9B97A3] hover:text-white hover:bg-white/5 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {completedTx ? (
            /* Success State */
            <div className="p-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <CheckCircle2 size={36} />
              </div>

              <div>
                <h3 className="text-2xl font-display font-bold text-white tracking-tight">
                  Payment Verified
                </h3>
                <p className="text-sm text-[#9B97A3] mt-1">
                  Your vault has been upgraded to the <span className="text-white font-bold">{completedTx.plan}</span> plan.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0E1015] border border-white/5 text-left space-y-2.5 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-[#9B97A3]">Transaction Reference:</span>
                  <span className="text-white font-bold">{completedTx.txId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9B97A3]">Amount Paid:</span>
                  <span className="text-emerald-400 font-bold">${completedTx.amount} USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9B97A3]">Processor:</span>
                  <span className="text-[#9B97A3]">Zorvik Tech Settlement Network</span>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-3.5 rounded-xl bg-brand-primary text-white font-bold uppercase text-xs tracking-widest hover:opacity-90 shadow-lg shadow-brand-primary/25 transition-all"
              >
                Return to Dashboard
              </button>
            </div>
          ) : (
            /* Checkout Form */
            <div className="p-6 sm:p-8 space-y-6">
              {/* Plan Summary Card */}
              <div className="p-5 rounded-2xl bg-[#0E1015] border border-[rgba(255,255,255,0.06)] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-brand-primary">
                    Selected Tier
                  </span>
                  <h4 className="text-xl font-display font-bold text-white mt-0.5">
                    {plan.name} Tier
                  </h4>
                  <p className="text-xs text-[#9B97A3] mt-1">
                    Billed {billingCycle === 'yearly' ? 'annually' : 'monthly'}
                  </p>
                </div>

                <div className="text-right">
                  {appliedCoupon ? (
                    <div>
                      <span className="text-xs text-[#9B97A3] line-through block font-mono">
                        ${basePrice}
                      </span>
                      <span className="text-2xl font-display font-bold text-emerald-400 font-mono">
                        ${currentPayable}
                      </span>
                      <span className="text-[10px] text-emerald-400 block font-medium">
                        Saved ${appliedCoupon.discountAmount} ({appliedCoupon.discountPercent}%)
                      </span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-2xl font-display font-bold text-white font-mono">
                        ${basePrice}
                      </span>
                      <span className="text-xs text-[#9B97A3] block">
                        USD / {billingCycle === 'yearly' ? 'year' : 'mo'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Coupon Code Section */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#9B97A3] flex items-center gap-1.5">
                  <Tag size={13} /> Have a Promo / Partner Coupon?
                </label>

                {appliedCoupon ? (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-emerald-400 uppercase">
                        {appliedCoupon.code}
                      </span>
                      <span className="text-emerald-300">
                        ({appliedCoupon.discountPercent}% off applied)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-[#9B97A3] hover:text-rose-400 font-bold text-[11px] uppercase tracking-wider transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. LEGACY50 or ZORVIK25"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-[#0E1015] border border-[rgba(255,255,255,0.08)] text-white text-xs font-mono uppercase placeholder:normal-case placeholder:font-sans placeholder:text-[#6B6675] focus:outline-none focus:border-brand-primary"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider transition-colors border border-white/10"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#9B97A3]">
                  Select Zorvik Payment Channel
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'upi', label: 'UPI / QR', sub: 'GPay, PhonePe, Paytm', icon: QrCode },
                    { id: 'card', label: 'Cards', sub: 'Visa, Mastercard, RuPay', icon: CreditCard },
                    { id: 'netbanking', label: 'Net Banking', sub: '50+ Supported Banks', icon: Building },
                    { id: 'crypto', label: 'Crypto (Web3)', sub: 'USDC, USDT, ETH', icon: Coins },
                  ].map((method) => {
                    const Icon = method.icon;
                    const isSelected = paymentMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id as typeof paymentMethod)}
                        className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'bg-brand-primary/10 border-brand-primary text-white shadow-lg shadow-brand-primary/10'
                            : 'bg-[#0E1015] border-[rgba(255,255,255,0.06)] text-[#9B97A3] hover:border-white/15 hover:text-white'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-brand-primary text-white' : 'bg-white/5 text-[#9B97A3]'}`}>
                          <Icon size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white leading-tight">{method.label}</p>
                          <p className="text-[10px] text-[#9B97A3] mt-0.5">{method.sub}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pay Button */}
              <button
                type="button"
                onClick={handleExecutePayment}
                disabled={isProcessing}
                className="w-full py-4 rounded-xl bg-brand-primary hover:opacity-90 disabled:opacity-50 text-white font-bold uppercase text-xs tracking-widest shadow-xl shadow-brand-primary/25 transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Connecting to Zorvik Tech...
                  </>
                ) : (
                  <>
                    Authorize & Pay ${currentPayable} USD
                    <ArrowRight size={14} />
                  </>
                )}
              </button>

              <p className="text-center text-[10px] text-[#6B6675] font-mono">
                Processed via Zorvik Tech Gateway · SSL Encrypted · Instant Activation
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
