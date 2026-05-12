// Conversation service — client-side only.
import { apiGet, apiPost } from '@/lib/api/client';
import type { Conversation, Message } from '@/types/conversation';
import type { PaginatedResponse } from '@/types/api';

/** Get or create a customer support conversation. */
export const getOrCreateSupportConversation = (): Promise<Conversation> =>
  apiPost<Conversation>('/conversations', { type: 'customer_support' });

/** Get messages for a conversation (paginated). */
export const getMessages = (
  conversationId: string,
  page = 1,
  limit = 50
): Promise<PaginatedResponse<Message>> =>
  apiGet<PaginatedResponse<Message>>(
    `/conversations/${conversationId}/messages?page=${page}&limit=${limit}`
  );

/** Send a text message to a conversation. */
export const sendMessage = (
  conversationId: string,
  message: string
): Promise<Message> =>
  apiPost<Message>(`/conversations/${conversationId}/messages`, {
    message,
    type: 'text',
  });
