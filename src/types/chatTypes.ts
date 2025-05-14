import { CodePayload } from '../components/LiveUIPreview';

// Changed from enum to const object and string union type
export const MessageType = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
} as const;

export type MessageType = (typeof MessageType)[keyof typeof MessageType];

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
  hasUIPreview?: boolean;
  uiPreviewCode?: CodePayload;
} 