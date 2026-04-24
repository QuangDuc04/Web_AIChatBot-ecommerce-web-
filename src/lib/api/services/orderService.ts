// Order service — guest order lookup (no auth required).

import { apiGet } from '@/lib/api/client';
import type { Order } from '@/types';

export interface OrderLookupResponse {
  order: Order;
  statusHistory: Array<{
    id: string;
    status: string;
    note?: string;
    createdAt: string;
  }>;
}

export interface OrderLookupByContactResponse {
  orders: Order[];
}

/** Lookup an order by order number + email (guest). */
export const lookupOrder = (
  orderNumber: string,
  email: string,
): Promise<OrderLookupResponse> =>
  apiGet<OrderLookupResponse>('/orders/lookup', {
    params: { orderNumber, email },
  });

/** Lookup orders by phone number or email. */
export const lookupByContact = (
  contact: string,
): Promise<OrderLookupByContactResponse> =>
  apiGet<OrderLookupByContactResponse>('/orders/lookup-by-contact', {
    params: { contact },
  });
