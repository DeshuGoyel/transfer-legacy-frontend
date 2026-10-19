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

const DEFAULT_PLANS: Plan[] = [
  {
    id: 'plan_personal',
    name: 'Personal',
    monthlyPrice: 19,
    yearlyPrice: 12,
    description: 'Secure your individual digital wealth.',
    features: ['10 protected assets', '3 active guardians', '1 primary heir', 'Standard encryption key'],
    maxGuardians: 3,
    maxAssets: 10,
    highlighted: false,
    active: true,
  },
  {
    id: 'plan_family',
    name: 'Family',
    monthlyPrice: 49,
    yearlyPrice: 29,
    description: 'Full protection for your heirs and estates.',
    features: ['Unlimited vault assets', '10 active guardians', '5 assigned heirs', 'AI Legacy Planner check-in', 'Premium support'],
    maxGuardians: 10,
    maxAssets: 9999,
    highlighted: true,
    active: true,
  },
  {
    id: 'plan_advisor',
    name: 'Advisor',
    monthlyPrice: 149,
    yearlyPrice: 89,
    description: 'For attorneys, executors, and professional fiduciaries.',
    features: ['Unlimited assets & heirs', 'Unlimited guardians', 'White-labeled customer portal', 'Multi-client management', 'Dedicated support'],
    maxGuardians: 999,
    maxAssets: 99999,
    highlighted: false,
    active: true,
  },
];

const DEFAULT_COUPONS: Coupon[] = [
  {
    id: 'c_legacy50',
    code: 'LEGACY50',
    discountPercent: 50,
    maxUses: 100,
    currentUses: 14,
    expiresAt: '2028-12-31',
    active: true,
    description: '50% off Founding Member Launch Discount',
  },
  {
    id: 'c_zorvik25',
    code: 'ZORVIK25',
    discountPercent: 25,
    maxUses: 500,
    currentUses: 42,
    expiresAt: '2027-12-31',
    active: true,
    description: '25% off Zorvik Tech Partner Promotion',
  },
  {
    id: 'c_alpha',
    code: 'ALPHA2026',
    discountPercent: 30,
    maxUses: 50,
    currentUses: 29,
    expiresAt: '2027-06-30',
    active: true,
    description: '30% Early Access Alpha VIP',
  },
];

export const getStoredPlans = (): Plan[] => {
  try {
    const raw = localStorage.getItem('tl_admin_plans');
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse tl_admin_plans:', err);
  }
  return DEFAULT_PLANS;
};

export const saveStoredPlans = (plans: Plan[]): void => {
  localStorage.setItem('tl_admin_plans', JSON.stringify(plans));
};

export const getStoredCoupons = (): Coupon[] => {
  try {
    const raw = localStorage.getItem('tl_admin_coupons');
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse tl_admin_coupons:', err);
  }
  return DEFAULT_COUPONS;
};

export const saveStoredCoupons = (coupons: Coupon[]): void => {
  localStorage.setItem('tl_admin_coupons', JSON.stringify(coupons));
};

export const validateCoupon = (code: string, amount: number) => {
  const coupons = getStoredCoupons();
  const trimmed = code.trim().toUpperCase();
  const coupon = coupons.find(c => c.code.toUpperCase() === trimmed);

  if (!coupon) {
    return { valid: false, error: 'Invalid coupon code' };
  }
  if (!coupon.active) {
    return { valid: false, error: 'This coupon is no longer active' };
  }
  if (coupon.currentUses >= coupon.maxUses) {
    return { valid: false, error: 'Coupon usage limit has been reached' };
  }
  if (new Date(coupon.expiresAt).getTime() < Date.now()) {
    return { valid: false, error: 'Coupon code has expired' };
  }

  const discountAmount = Math.round((amount * coupon.discountPercent) / 100);
  const payableAmount = Math.max(0, amount - discountAmount);

  return {
    valid: true,
    coupon,
    discountPercent: coupon.discountPercent,
    discountAmount,
    payableAmount,
  };
};

/**
 * Execute payment through Zorvik Tech Payment Gateway API
 */
export const processZorvikPayment = async (request: PaymentRequest): Promise<PaymentResult> => {
  // Simulate real network request to Zorvik Tech Payment API
  await new Promise(resolve => setTimeout(resolve, 1200));

  let discountApplied = 0;
  let finalAmount = request.amount;

  if (request.couponCode) {
    const couponValidation = validateCoupon(request.couponCode, request.amount);
    if (couponValidation.valid && couponValidation.coupon) {
      discountApplied = couponValidation.discountAmount || 0;
      finalAmount = couponValidation.payableAmount || 0;

      // Increment usage in coupons storage
      const coupons = getStoredCoupons();
      const updated = coupons.map(c => 
        c.id === couponValidation.coupon?.id 
          ? { ...c, currentUses: c.currentUses + 1 } 
          : c
      );
      saveStoredCoupons(updated);
    }
  }

  const timestamp = new Date().toISOString();
  const randomSuffix = Math.random().toString(36).substring(2, 9).toUpperCase();
  const transactionId = `ZORVIK_${Date.now()}_${randomSuffix}`;
  const orderId = `ORD_TL_${Date.now()}`;

  // Record user plan update in localStorage
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
