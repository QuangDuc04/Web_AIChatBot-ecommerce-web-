// Payment service — client-side only ('use client' components).
// Handles payment creation and status polling.

import { apiGet, apiPost } from '@/lib/api/client';
import type { Payment, PaymentMethod } from '@/types';

export interface CreatePaymentDto {
  orderId: string;
  method: PaymentMethod;
}

export interface CreatePaymentResponse {
  /**
   * Redirect URL returned by VNPay or MoMo.
   * Undefined for COD or Bank Transfer orders — no redirect is required.
   */
  paymentUrl?: string;
  payment: Payment;
}

/**
 * Initiate a payment for an order.
 *
 * - VNPay / MoMo: the response includes `paymentUrl` — redirect the user there.
 * - COD / Bank Transfer: `paymentUrl` is absent — show a confirmation screen.
 */
export const createPayment = (
  dto: CreatePaymentDto
): Promise<CreatePaymentResponse> =>
  apiPost<CreatePaymentResponse>('/payments/create', dto);

/** Poll the payment status for a given order. */
export const getPaymentStatus = (orderId: string): Promise<Payment> =>
  apiGet<Payment>(`/payments/status/${orderId}`);
