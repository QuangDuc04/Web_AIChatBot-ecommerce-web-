// Notification service — client-side only.
import { apiGet, apiPut } from '@/lib/api/client';
import type { Notification } from '@/types/notification';
import type { PaginatedResponse } from '@/types/api';

/** Fetch paginated notifications for the current user. */
export const getNotifications = (
  page = 1,
  limit = 20
): Promise<PaginatedResponse<Notification>> =>
  apiGet<PaginatedResponse<Notification>>(
    `/notifications?page=${page}&limit=${limit}`
  );

/** Fetch unread notification count. */
export const getUnreadCount = (): Promise<{ count: number }> =>
  apiGet<{ count: number }>('/notifications/unread-count');

/** Mark a notification as read. */
export const markAsRead = (id: string): Promise<void> =>
  apiPut<void>(`/notifications/${id}/read`);

/** Mark all notifications as read. */
export const markAllAsRead = (): Promise<void> =>
  apiPut<void>('/notifications/read-all');

/** Fetch the current user's notification settings. */
export const getNotificationSettings = (): Promise<import('@/types/notification').NotificationSettings> =>
  apiGet<import('@/types/notification').NotificationSettings>('/notifications/settings');

/** Update notification settings. */
export const updateNotificationSettings = (
  dto: Partial<Omit<import('@/types/notification').NotificationSettings, 'id' | 'userId' | 'updatedAt'>>
): Promise<import('@/types/notification').NotificationSettings> =>
  apiPut<import('@/types/notification').NotificationSettings>('/notifications/settings', dto);
