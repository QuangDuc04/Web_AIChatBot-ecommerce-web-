// Flash sale service — server-side ISR fetching.
import { serverFetch } from '../server';
import type { FlashSale } from '@/types/flashSale';

/**
 * Fetch the currently active flash sale (if any).
 * Returns null if no sale is active.
 * Revalidates every 5 minutes — flash sales change frequently.
 */
export async function getActiveFlashSale(): Promise<FlashSale | null> {
  try {
    return await serverFetch<FlashSale>('/flash-sales/active', {
      revalidate: 300,
    });
  } catch {
    return null;
  }
}
