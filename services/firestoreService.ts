
import { 
  collection,
  doc, 
  getDoc, 
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebaseConfig';
import { ChatMessage, ChatHistoryItem } from '../types';

const getChatsCollection = (userId: string) => {
  if (!isFirebaseConfigured || !db) throw new Error("Firestore is not configured.");
  return collection(db, 'users', userId, 'chats');
};

export const getChatHistoryList = async (userId: string): Promise<ChatHistoryItem[]> => {
  if (!isFirebaseConfigured || !db || !userId) return [];
  
  try {
    const q = query(getChatsCollection(userId), orderBy('updatedAt', 'desc'), limit(30));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      title: doc.data().title || '無題のチャット',
    }));

  } catch (error) {
    console.error("Error fetching chat history list: ", error);
    return [];
  }
};

export const getChatMessages = async (userId: string, chatId: string): Promise<ChatMessage[]> => {
  if (!isFirebaseConfigured || !db || !userId || !chatId) return [];
  
  const chatDocRef = doc(db, 'users', userId, 'chats', chatId);
  
  try {
    const docSnap = await getDoc(chatDocRef);
    if (docSnap.exists()) {
      return (docSnap.data()?.messages as ChatMessage[]) || [];
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching chat messages: ", error);
    return [];
  }
};


export const createNewChat = async (userId: string): Promise<string> => {
  if (!isFirebaseConfigured || !db || !userId) throw new Error("Cannot create chat.");
  
  try {
    const newChatRef = await addDoc(getChatsCollection(userId), {
      title: '新しいチャット',
      messages: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return newChatRef.id;
  } catch (error) {
    console.error("Error creating new chat: ", error);
    throw error;
  }
};

export const updateChat = async (userId: string, chatId: string, messages: ChatMessage[], title?: string): Promise<void> => {
  if (!isFirebaseConfigured || !db || !userId || !chatId) return;
  const chatDocRef = doc(db, 'users', userId, 'chats', chatId);
  try {
    const updateData: {
      messages: ChatMessage[];
      updatedAt: Timestamp;
      title?: string;
    } = {
      messages: messages,
      updatedAt: serverTimestamp(),
    };
    if (title) {
      updateData.title = title;
    }
    await updateDoc(chatDocRef, updateData);
  } catch (error) {
    console.error("Error updating chat: ", error);
    throw error;
  }
};
