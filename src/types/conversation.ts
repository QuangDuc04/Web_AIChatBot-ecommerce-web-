export type ConversationType = 'customer_support' | 'order_inquiry';

export type ConversationStatus = 'open' | 'closed';

export type ParticipantRole = 'customer' | 'admin' | 'staff';

export type MessageType = 'text' | 'image' | 'file' | 'system';

export interface MessageAttachment {
  url: string;
  name: string;
  type: string;
  size: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  message: string;
  /** File attachments { url, name, type, size } */
  attachments: MessageAttachment[] | null;
  type: MessageType;
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ConversationParticipant {
  id: string;
  conversationId: string;
  userId: string;
  role: ParticipantRole;
  joinedAt: Date | string;
  lastReadAt: Date | string | null;
}

export interface Conversation {
  id: string;
  type: ConversationType;
  /** Associated order UUID, if this is an order inquiry */
  orderId: string | null;
  status: ConversationStatus;
  lastMessageAt: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  // Eager-loaded relations
  participants: ConversationParticipant[];
  messages: Message[];
}
