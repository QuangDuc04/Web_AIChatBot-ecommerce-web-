import { apiGet, apiPost } from '@/lib/api/client';

export interface BankInfo {
  bankCode: string;
  accountNumber: string;
  accountName: string;
}

export interface ConfirmationData {
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  shippingAddress: {
    street: string;
    ward: string;
    district: string;
    city: string;
  };
  items: {
    productId: string;
    productName: string;
    variantName?: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
  paymentMethod: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  expiresAt: string;
  bankInfo: BankInfo;
}

export interface ConfirmResult {
  orderId: string;
  orderNumber: string;
}

export const getConfirmation = (token: string): Promise<ConfirmationData> =>
  apiGet<ConfirmationData>(`/order-confirm/${token}`);

export const confirmOrder = (token: string, paymentMethod: string): Promise<ConfirmResult> =>
  apiPost<ConfirmResult>(`/order-confirm/${token}/confirm`, { paymentMethod });
