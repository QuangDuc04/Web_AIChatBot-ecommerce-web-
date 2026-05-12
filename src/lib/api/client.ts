// Client-side axios instance — guest only (no auth).
// Only used in Client Components ('use client').

import axios, { AxiosRequestConfig } from 'axios';
import { v4 as uuidv4 } from 'uuid';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ---------------------------------------------------------------------------
// Session ID helper — identifies the anonymous cart
// ---------------------------------------------------------------------------

/** Returns the anonymous cart session ID, generating and persisting one if absent. */
export const getSessionId = (): string => {
  if (typeof window === 'undefined') return '';
  let sessionId = localStorage.getItem('cart_session_id');
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem('cart_session_id', sessionId);
  }
  return sessionId;
};

// ---------------------------------------------------------------------------
// Axios instance
// ---------------------------------------------------------------------------

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30_000,
});

// ---------------------------------------------------------------------------
// Request interceptor — attach session header
// ---------------------------------------------------------------------------

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    config.headers['x-session-id'] = getSessionId();
  }
  return config;
});

// ---------------------------------------------------------------------------
// Response interceptor — unwrap data envelope
// ---------------------------------------------------------------------------

apiClient.interceptors.response.use(
  (response) => {
    // Unwrap backend envelope: { success, message, data } → data
    const payload = response.data;
    if (payload && typeof payload === 'object' && 'data' in payload) {
      return payload.data;
    }
    return response.data;
  },
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Có lỗi xảy ra';
    const normalizedError = new Error(message);
    return Promise.reject(normalizedError);
  },
);

// ---------------------------------------------------------------------------
// Token helpers (used by auth-related files)
// ---------------------------------------------------------------------------

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const setTokens = (accessToken: string, refreshToken: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const clearTokens = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// ---------------------------------------------------------------------------
// Typed HTTP helpers
// ---------------------------------------------------------------------------

export const apiGet = <T>(url: string, config?: AxiosRequestConfig) =>
  apiClient.get<unknown, T>(url, config);

export const apiPost = <T>(
  url: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any,
  config?: AxiosRequestConfig,
) => apiClient.post<unknown, T>(url, data, config);

export const apiPut = <T>(
  url: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any,
  config?: AxiosRequestConfig,
) => apiClient.put<unknown, T>(url, data, config);

export const apiDelete = <T>(url: string, config?: AxiosRequestConfig) =>
  apiClient.delete<unknown, T>(url, config);

export default apiClient;
