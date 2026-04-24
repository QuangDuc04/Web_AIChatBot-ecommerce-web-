// Banner service — server-side ISR fetching only.
// All functions use serverFetch (native fetch + Next.js cache).
// Public endpoint: GET /banners/active

import { serverFetch } from '../server';

// ---------------------------------------------------------------------------
// Banner type (not yet in src/types — defined here until added globally)
// ---------------------------------------------------------------------------

export interface Banner {
  id: string;
  title: string;
  image: string;
  link: string;
  displayOrder: number;
  placement: string;
}

// ---------------------------------------------------------------------------
// Server-side functions
// ---------------------------------------------------------------------------

/**
 * Fetch all active banners.
 * Revalidates every 10 minutes — banners change more frequently than other content.
 */
export async function getActiveBanners(): Promise<Banner[]> {
  return serverFetch<Banner[]>('/banners/active', {
    revalidate: 600,
  });
}
