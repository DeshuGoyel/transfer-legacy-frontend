import { opsApi } from '../lib/opsApi';

export interface Plan {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  features: string[];
  maxGuardians: number;
  maxAssets: number;
  highlighted: boolean;
  active: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  maxUses: number;
  currentUses: number;
  expiresAt: string;
  active: boolean;
  description?: string;
}

export interface PaymentRequest {
  planId: string;
  planName: string;
  amount: number;
  currency: 'USD' | 'INR';
  couponCode?: string;
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'crypto';
  userEmail: string;
  userName?: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  orderId: string;
  planId: string;
  planName: string;
  amount: number;
  currency: string;
  discountApplied: number;
  timestamp: string;
  gateway: 'Zorvik Tech Payment Gateway';
}

export const fetchPlans = async (): Promise<Plan[]> => {
  const raw = await opsApi.get<any[]>('/plans');
  return raw.map((p) => ({
    id: p.id,
    name: p.name,
    monthlyPrice: p.monthly_price ?? p.monthlyPrice,
    yearlyPrice: p.yearly_price ?? p.yearlyPrice,
    description: p.description,
    features: Array.isArray(p.features) ? p.features : [],
    maxGuardians: p.max_guardians ?? p.maxGuardians ?? 3,
    maxAssets: p.max_assets ?? p.maxAssets ?? 10,
    highlighted: Boolean(p.highlighted),
    active: Boolean(p.active),
  }));
};

export const fetchCoupons = async (): Promise<Coupon[]> => {
  const raw = await opsApi.get<any[]>('/ops/coupons');
  return raw.map((c) => ({
    id: c.id,
    code: c.code,
    discountPercent: c.discount_percent ?? c.discountPercent,
    maxUses: c.max_uses ?? c.maxUses,
    currentUses: c.current_uses ?? c.currentUses ?? 0,
    expiresAt: c.expires_at ?? c.expiresAt,
    active: Boolean(c.active),
    description: c.description,
  }));
};

export const validateCoupon = async (
  code: string,
  amount: number
): Promise<{
  valid: boolean;
  discountPercent?: number;
  discountAmount?: number;
  payableAmount?: number;
  error?: string;
  message?: string;
}> => {
  try {
    const res = await opsApi.post<{
      valid: boolean;
      discount_percent: number;
      discount_amount: number;
      final_amount: number;
      message: string;
    }>('/coupons/validate', { code: code.trim(), amount });

    if (!res.valid) {
      return { valid: false, error: res.message || 'Invalid coupon code' };
    }

    return {
      valid: true,
      discountPercent: res.discount_percent,
      discountAmount: res.discount_amount,
      payableAmount: res.final_amount,
      message: res.message,
    };
  } catch (err: any) {
    return {
      valid: false,
      error: err.message || 'Failed to validate coupon code against server',
    };
  }
};

/**
 * Execute payment through Zorvik Tech Payment Gateway API
 */
export const processZorvikPayment = async (request: PaymentRequest): Promise<PaymentResult> => {
  // Simulate network request to Zorvik Tech Payment Gateway
  await new Promise((resolve) => setTimeout(resolve, 1000));

  let discountApplied = 0;
  let finalAmount = request.amount;

  if (request.couponCode) {
    const validation = await validateCoupon(request.couponCode, request.amount);
    if (validation.valid && validation.discountAmount !== undefined) {
      discountApplied = validation.discountAmount;
      finalAmount = validation.payableAmount ?? request.amount;
    }
  }

  const timestamp = new Date().toISOString();
  const randomSuffix = Math.random().toString(36).substring(2, 9).toUpperCase();
  const transactionId = `ZORVIK_${Date.now()}_${randomSuffix}`;
  const orderId = `ORD_TL_${Date.now()}`;

  localStorage.setItem('tl_user_plan', request.planName);

  return {
    success: true,
    transactionId,
    orderId,
    planId: request.planId,
    planName: request.planName,
    amount: finalAmount,
    currency: request.currency,
    discountApplied,
    timestamp,
    gateway: 'Zorvik Tech Payment Gateway',
  };
};
