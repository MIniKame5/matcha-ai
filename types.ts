
export type Role = 'user' | 'model';

export interface ChatMessage {
  id: number;
  role: Role;
  content: string;
}

export type Language = 'jp' | 'en';
