import { GoogleGenAI } from "@google/genai";
import { getSystemInstruction } from '../constants.js';

class GeminiChatService {
  chat = null;
  language = 'jp';
  ai = null;

  constructor() {
    const apiKey = process.env.API_KEY;
    if (apiKey) {
      this.ai = new GoogleGenAI({ apiKey });
    } else {
      console.error("API_KEY environment variable not set.");
    }
  }

  initializeChat(language) {
    this.language = language;
    if (!this.ai) {
      throw new Error("No API key is configured. Please set the API_KEY environment variable.");
    }
    this.chat = this.ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: getSystemInstruction(this.language),
      },
    });
  }

  async sendMessage(prompt, image) {
    if (!this.ai) {
      throw new Error("No API key is configured. Please set the API_KEY environment variable.");
    }
    const contentsParts = [];
    if (image) {
      contentsParts.push({
        inlineData: {
          mimeType: image.mimeType,
          data: image.base64,
        },
      });
    }
    if (prompt.trim()) {
      contentsParts.push({ text: prompt });
    }
    if (contentsParts.length === 0) {
      throw new Error("Cannot send empty message or no content.");
    }
    if (!this.chat) {
      this.initializeChat(this.language);
    }
    if (!this.chat) {
        throw new Error("Chat could not be initialized. API Key might be missing.");
    }

    try {
      const result = await this.chat.sendMessage({ 
        contents: { parts: contentsParts },
        generationConfig: {
          candidateCount: 2,
        }
      });
      return result;
    } catch (error) {
      console.error(`Gemini API call failed`, error);
      throw error;
    }
  }

  async generateChatTitle(firstMessage) {
    if (!this.ai) {
      throw new Error("API not initialized");
    }
    try {
      const prompt = `以下のユーザーの最初の質問を、非常に短く（5単語または15文字程度）、簡潔なタイトルに要約してください。元の言語のままにしてください。タイトル以外の余計な言葉（「タイトル：」など）は含めないでください。\n\n質問： "${firstMessage}"`;
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      let title = response.text.trim().replace(/^["']|["']$/g, '');
      return title || "新しいチャット";
    } catch (error) {
      console.error('Error generating title:', error);
      return "新しいチャット";
    }
  }
}

export const chatService = new GeminiChatService();