/** Address type: shipping or billing */
export type AddressType = 'shipping' | 'billing';

/**
 * Frontend-safe Customer object (paper-web is customer-only).
 * Sensitive fields (password, tokens) are never included in API responses.
 */
export interface User {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  avatar: string | null;
  authProvider: 'local' | 'google';
  isActive: boolean;
  isOnline: boolean;
  lastSeenAt: Date | string | null;
  emailVerified: boolean;
  device: string | null;
  ipAddress: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Address {
  id: string;
  customerId: string;
  fullName: string;
  phone: string;
  street: string;
  /** Tỉnh/Thành phố */
  city: string;
  /** Quận/Huyện */
  district: string;
  /** Phường/Xã */
  ward: string;
  isDefault: boolean;
  type: AddressType;
  latitude: number | null;
  longitude: number | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}
