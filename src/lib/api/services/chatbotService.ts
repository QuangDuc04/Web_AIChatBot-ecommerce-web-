import { apiPost, apiGet, apiDelete } from '@/lib/api/client';

export interface ChatbotResponse {
  reply: string;
  sessionId: string;
  escalated: boolean;
}

export interface ChatbotHistory {
  messages: { role: 'user' | 'assistant'; content: string }[];
}

export const sendChatbotMessage = (message: string, signal?: AbortSignal): Promise<ChatbotResponse> =>
  apiPost<ChatbotResponse>('/chatbot/message', { message }, { signal });

export const getChatbotHistory = (): Promise<ChatbotHistory> =>
  apiGet<ChatbotHistory>('/chatbot/history');

export const clearChatbotHistory = (): Promise<void> =>
  apiDelete<void>('/chatbot/history');
