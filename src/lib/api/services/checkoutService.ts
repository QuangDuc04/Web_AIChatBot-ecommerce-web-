// Checkout service — guest-only checkout flow.

import { apiPost } from '@/lib/api/client';
import type { Order, PaymentMethod } from '@/types';

export interface CheckoutValidation {
  valid: boolean;
  errors?: string[];
}

export interface OrderCalculation {
  subtotal: number;
  shippingFee: number;
  tax: number;
  discount: number;
  total: number;
}

export interface GuestAddress {
  street: string;
  city: string;
  district: string;
  ward: string;
}

export interface CheckoutItem {
  productId: string;
  variantId?: string;
  quantity: number;
  buyingUnitType?: string | null;
}

export interface CalculateCheckoutDto {
  items: CheckoutItem[];
  couponCode?: string;
  email?: string;
  guestAddress?: GuestAddress;
  shippingMethodId?: string;
  shippingAddressId?: string;
}

export interface CreateOrderDto {
  items: CheckoutItem[];
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestAddress: GuestAddress;
  paymentMethod: PaymentMethod;
  customerNote?: string;
  couponCode?: string;
  shippingMethodId?: string;
}

export const validateCheckout = (items: CheckoutItem[]): Promise<CheckoutValidation> =>
  apiPost<CheckoutValidation>('/checkout/validate', { items });

export const calculateOrder = (
  dto: CalculateCheckoutDto,
): Promise<OrderCalculation> =>
  apiPost<OrderCalculation>('/checkout/calculate', dto);

export const createOrder = (dto: CreateOrderDto): Promise<Order> =>
  apiPost<Order>('/checkout/create-order', dto);
