// News service — server-side ISR fetching only.
// All functions use serverFetch (native fetch + Next.js cache).
// Public endpoints: GET /news/active, GET /news/slug/:slug

import { serverFetch } from '../server';
import type { News } from '@/types';

/**
 * Fetch all active (published) news articles.
 * Revalidates every 60 minutes.
 */
export async function getActiveNews(): Promise<News[]> {
  return serverFetch<News[]>('/news/active', {
    revalidate: 3600,
  });
}

/**
 * Fetch a single news article by its slug.
 * Revalidates every 60 minutes.
 */
export async function getNewsBySlug(slug: string): Promise<News> {
  return serverFetch<News>(`/news/slug/${encodeURIComponent(slug)}`, {
    revalidate: 3600,
  });
}
