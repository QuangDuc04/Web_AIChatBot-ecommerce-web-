// User service — client-side only ('use client' components).
// Covers the current user's profile and their saved addresses.

import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api/client';
import type { Address, User } from '@/types';

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------

/** Fetch the current user's profile. */
export const getProfile = (): Promise<User> => apiGet<User>('/users/profile');

/** Update the current user's profile fields. */
export const updateProfile = (dto: Partial<User>): Promise<User> =>
  apiPut<User>('/users/profile', dto);

// ---------------------------------------------------------------------------
// Addresses
// ---------------------------------------------------------------------------

/** List all saved addresses for the current user. */
export const getAddresses = (): Promise<Address[]> =>
  apiGet<Address[]>('/users/addresses');

/** Fetch a single address by ID. */
export const getAddress = (id: string): Promise<Address> =>
  apiGet<Address>(`/users/addresses/${id}`);

/** Create a new address. */
export const createAddress = (
  dto: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<Address> => apiPost<Address>('/users/addresses', dto);

/** Update an existing address. */
export const updateAddress = (
  id: string,
  dto: Partial<Address>
): Promise<Address> => apiPut<Address>(`/users/addresses/${id}`, dto);

/** Delete an address by ID. */
export const deleteAddress = (id: string): Promise<void> =>
  apiDelete<void>(`/users/addresses/${id}`);

/** Mark an address as the default shipping address. */
export const setDefaultAddress = (id: string): Promise<Address> =>
  apiPut<Address>(`/users/addresses/${id}/default`);
