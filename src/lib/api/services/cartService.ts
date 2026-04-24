// Cart service — client-side only ('use client' components).
// The axios instance in client.ts automatically attaches `x-session-id` from
// localStorage key `cart_session_id`, so anonymous cart operations work without
// extra configuration here.

import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api/client';
import type { Cart } from '@/types';

/** Fetch the current cart (session-based). */
export const getCart = (): Promise<Cart> => apiGet<Cart>('/cart');

/** Add a product (or variant) to the cart. */
export const addToCart = (dto: {
  productId: string;
  variantId?: string;
  quantity: number;
  buyingUnitType?: string | null;
}): Promise<Cart> => apiPost<Cart>('/cart/items', dto);

/** Update quantity and/or buying unit of an existing cart item. */
export const updateCartItem = (
  itemId: string,
  dto: { quantity: number; buyingUnitType?: string | null },
): Promise<Cart> => apiPut<Cart>(`/cart/items/${itemId}`, dto);

/** Remove a single item from the cart. */
export const removeCartItem = (itemId: string): Promise<Cart> =>
  apiDelete<Cart>(`/cart/items/${itemId}`);

/** Remove all items from the cart. */
export const clearCart = (): Promise<void> =>
  apiDelete<void>('/cart/clear');
