export type NotificationType =
  | 'order_update'
  | 'promotion'
  | 'system'
  | 'review_reply'
  | 'low_stock'
  | 'new_message';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  /** Additional context data e.g. { orderId: '...', productId: '...' } */
  data: Record<string, unknown> | null;
  icon: string | null;
  /** Deep-link URL to navigate to on click */
  url: string | null;
  isRead: boolean;
  readAt: Date | string | null;
  createdAt: Date | string;
}

export interface NotificationSettings {
  id: string;
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  newMessages: boolean;
  updatedAt: Date | string;
}
