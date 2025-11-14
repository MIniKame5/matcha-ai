import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebaseConfig';
import { ChatMessage } from '../types';

export const saveChatHistory = async (userId: string, messages: ChatMessage[]): Promise<void> => {
  if (!isFirebaseConfigured || !db || !userId) return;
  const userDocRef = doc(db, 'chatHistory', userId);
  try {
    await setDoc(userDocRef, { 
      messages: messages,
      updatedAt: serverTimestamp() 
    });
  } catch (error) {
    console.error("Error saving chat history: ", error);
    throw error;
  }
};

export const getChatHistory = async (userId: string): Promise<ChatMessage[] | null> => {
  if (!isFirebaseConfigured || !db || !userId) return null;
  const userDocRef = doc(db, 'chatHistory', userId);
  try {
    // Fix: Corrected typo from `userDoc-ref` to `userDocRef`.
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      return (docSnap.data()?.messages as ChatMessage[]) || null;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching chat history: ", error);
    throw error;
  }
};
