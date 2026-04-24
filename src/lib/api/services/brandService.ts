// Brand service — server-side ISR fetching.
import { serverFetch } from '../server';
import type { Brand } from '@/types/brand';
import type { PaginatedResponse } from '@/types/api';

/**
 * Fetch all brands.
 * Revalidates every 60 minutes.
 */
export async function getBrands(): Promise<Brand[]> {
  const res = await serverFetch<PaginatedResponse<Brand>>('/brands?limit=100', { revalidate: 3600 });
  return res?.items ?? [];
}

/**
 * Fetch a single brand by slug.
 */
export async function getBrandBySlug(slug: string): Promise<Brand> {
  return serverFetch<Brand>(`/brands/slug/${encodeURIComponent(slug)}`, {
    revalidate: 3600,
  });
}
