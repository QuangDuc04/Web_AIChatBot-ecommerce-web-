// Coupon service — client-side only.
import { apiGet } from '@/lib/api/client';

export interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscountAmount: number | null;
  endDate: string | null;
}

/** Fetch all currently active/available coupons. */
export const getActiveCoupons = (): Promise<Coupon[]> =>
  apiGet<Coupon[]>('/coupons/active');
