// @ts-nocheck — Dead file: customer auth removed (guest-only checkout)
// Auth service — client-side only ('use client' components).

import { apiGet, apiPost, clearTokens, setTokens } from '@/lib/api/client';
import type { User, LoginDto, RegisterDto } from '@/types';

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

/**
 * Register a new customer account.
 * Stores the returned tokens in localStorage via setTokens.
 */
export const register = async (dto: RegisterDto): Promise<AuthResponse> => {
  const result = await apiPost<AuthResponse>('/customer-auth/register', dto);
  setTokens(result.accessToken, result.refreshToken);
  return result;
};

/**
 * Log in with email + password.
 * Stores the returned tokens in localStorage via setTokens.
 */
export const login = async (dto: LoginDto): Promise<AuthResponse> => {
  const result = await apiPost<AuthResponse>('/customer-auth/login', dto);
  setTokens(result.accessToken, result.refreshToken);
  return result;
};

/**
 * Log in with Google ID token.
 * Stores the returned tokens in localStorage via setTokens.
 */
export const googleLogin = async (idToken: string): Promise<AuthResponse> => {
  const result = await apiPost<AuthResponse>('/customer-auth/google-login', { idToken });
  setTokens(result.accessToken, result.refreshToken);
  return result;
};

/**
 * Log out the current user and clear stored tokens.
 * Fire-and-forget — the backend invalidates the refresh token.
 */
export const logout = async (): Promise<void> => {
  try {
    await apiPost<void>('/customer-auth/logout');
  } finally {
    clearTokens();
  }
};

/** Return the currently authenticated user object. */
export const getMe = (): Promise<User> => apiGet<User>('/customer-auth/me');

/** Change the current user's password. */
export const changePassword = (dto: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> => apiPost<void>('/customer-auth/change-password', dto);

/** Trigger a password-reset email. */
export const forgotPassword = (email: string): Promise<void> =>
  apiPost<void>('/customer-auth/forgot-password', { email });

/** Complete a password reset using the token delivered by email. */
export const resetPassword = (dto: {
  token: string;
  password: string;
}): Promise<void> => apiPost<void>('/customer-auth/reset-password', dto);

/** Verify email address using the token delivered by email. */
export const verifyEmail = (token: string): Promise<void> =>
  apiPost<void>('/customer-auth/verify-email', { token });

/** Resend verification email to the current user's email. */
export const resendVerification = (): Promise<void> =>
  apiPost<void>('/customer-auth/resend-verification');
