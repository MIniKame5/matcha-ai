

export type Role = 'user' | 'model';

export interface ChatMessage {
  id: number;
  role: Role;
  content: string;
  image?: { base64: string; mimeType: string; };
  candidates?: string[];
  selectedCandidateIndex?: number;
}

export type Language = 'jp' | 'en';

export interface ChatHistoryItem {
  id: string;
  title: string;
}
