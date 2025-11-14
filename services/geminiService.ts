import { GoogleGenAI, Chat } from "@google/genai";
import { getSystemInstruction } from "../constants";
import { Language } from "../types";

class GeminiChatService {
  private chat: Chat | null = null;
  private language: Language = 'jp';
  private ai: GoogleGenAI | null = null;

  constructor() {
    const apiKey = process.env.API_KEY;
    if (apiKey) {
      // Fix: Initialize GoogleGenAI with the API key directly from process.env.API_KEY.
      this.ai = new GoogleGenAI({ apiKey });
    } else {
      console.error("API_KEY environment variable not set.");
    }
  }

  public initializeChat(language: Language) {
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

  public async sendMessageStream(prompt: string) {
    if (!this.chat) {
      this.initializeChat(this.language);
    }
    if (!this.chat) {
        throw new Error("Chat could not be initialized. API Key might be missing.");
    }

    try {
      const result = await this.chat.sendMessageStream({ message: prompt });
      return result;
    } catch (error: unknown) {
      console.error(`Gemini API call failed`, error);
      // Re-throw the error so the UI layer can handle it.
      throw error;
    }
  }
}

export const chatService = new GeminiChatService();
