export interface Message {
  id: number;
  role: 'user' | 'model';
  content: string;
  image?: {
    base64: string;
    mimeType: string;
  };
  candidates?: string[];
  selectedCandidateIndex?: number;
}
