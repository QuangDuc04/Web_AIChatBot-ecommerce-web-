import { apiPost } from '@/lib/api/client';

export interface ContactSubmitDto {
  name: string;
  email: string;
  phone: string;
  content?: string;
  type?: 'contact' | 'quote';
}

export interface ContactSubmitResponse {
  id: string;
  message: string;
}

export const submitContact = (dto: ContactSubmitDto): Promise<ContactSubmitResponse> =>
  apiPost<ContactSubmitResponse>('/contact', dto);
