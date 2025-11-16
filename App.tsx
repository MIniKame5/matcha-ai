
import React, { useState, useEffect, useCallback } from 'react';
import { type User } from 'firebase/auth';
import { ChatMessage, Language, ChatHistoryItem } from './types';
import { UI_TEXTS } from './constants';
import { chatService } from './services/geminiService';
import { onAuthStateChangedListener, signUpUser, signInUser, signOutUser } from './services/authService';
import { 
  getChatHistoryList, 
  getChatMessages, 
  createNewChat,
  updateChat,
} from './services/firestoreService';
import { isFirebaseConfigured } from './firebaseConfig';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import AuthModal from './components/AuthModal';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('jp');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [appInitialized, setAppInitialized] = useState(false);

  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchHistory = useCallback(async (user: User) => {
    if (!user) return;
    const historyList = await getChatHistoryList(user.uid);
    setChatHistory(historyList);
    if (!activeChatId && historyList.length > 0) {
      handleSelectChat(historyList[0].id);
    } else if (historyList.length === 0) {
        handleNewChat();
    }
  }, [activeChatId]);

  useEffect(() => {
    if (isFirebaseConfigured) {
      const unsubscribe = onAuthStateChangedListener(async (user) => {
        chatService.initializeChat(language);
        if (user) {
          setCurrentUser(user);
          setIsLoading(true);
          await fetchHistory(user);
          setIsLoading(false);
        } else {
          setCurrentUser(null);
          setMessages([]);
          setChatHistory([]);
          setActiveChatId(null);
        }
        setAppInitialized(true);
      });
      return unsubscribe;
    } else {
      chatService.initializeChat(language);
      setMessages([]);
      setCurrentUser(null);
      setAppInitialized(true);
    }
  }, [language, fetchHistory]);

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
  };
  
  const handleAuth = async (mode: 'login' | 'signup', email: string, pass: string) => {
    if (mode === 'login') {
      await signInUser(email, pass);
    } else {
      await signUpUser(email, pass);
    }
  };

  const handleLogout = async () => {
    await signOutUser();
  };

  const handleNewChat = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    const newChatId = await createNewChat(currentUser.uid);
    setActiveChatId(newChatId);
    setMessages([]);
    await fetchHistory(currentUser);
    setIsLoading(false);
    if (window.innerWidth < 640) setIsSidebarOpen(false);
  };
  
  const handleSelectChat = async (chatId: string) => {
     if (!currentUser) return;
    setIsLoading(true);
    setActiveChatId(chatId);
    const loadedMessages = await getChatMessages(currentUser.uid, chatId);
    setMessages(loadedMessages);
    setIsLoading(false);
    if (window.innerWidth < 640) setIsSidebarOpen(false);
  };

  const handleSelectCandidate = async (messageId: number, newIndex: number) => {
    let finalMessagesForSave: ChatMessage[] = [];
    const updatedMessages = messages.map(msg => {
      if (msg.id === messageId && msg.candidates) {
        return {
          ...msg,
          content: msg.candidates[newIndex],
          selectedCandidateIndex: newIndex,
        };
      }
      return msg;
    });
    
    setMessages(updatedMessages);
    finalMessagesForSave = updatedMessages;

    if (currentUser && activeChatId && finalMessagesForSave.length > 0) {
      await updateChat(currentUser.uid, activeChatId, finalMessagesForSave);
    }
  };


  const handleSendMessage = async (userInput: string, selectedImage?: { base64: string; mimeType: string; }) => {
    if ((!userInput.trim() && !selectedImage) || isLoading || !currentUser || !activeChatId) return;

    const isNewChat = messages.length === 0;

    const userMessage: ChatMessage = { 
      id: Date.now(), 
      role: 'user', 
      content: userInput, 
      image: selectedImage 
    };
    const modelMessageId = userMessage.id + 1;
    const modelMessagePlaceholder: ChatMessage = { id: modelMessageId, role: 'model', content: '' };
    
    const currentMessages = [...messages, userMessage];
    setMessages([...currentMessages, modelMessagePlaceholder]);
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await chatService.sendMessage(userInput, selectedImage);
      
      const responseCandidates = response.candidates
        ?.map(c => c.content.parts.map(p => p.text).join(''))
        .filter(t => t) ?? [];
      
      const firstResponse = response.text;

      let finalModelMessage: ChatMessage;

      if (responseCandidates.length > 0) {
        finalModelMessage = {
          id: modelMessageId,
          role: 'model',
          content: firstResponse,
          candidates: responseCandidates,
          selectedCandidateIndex: 0,
        };
      } else {
         throw new Error("The model did not return any responses.");
      }
      
      const finalMessages = [...currentMessages, finalModelMessage];
      setMessages(finalMessages);

      if (isNewChat) {
        const title = await chatService.generateChatTitle(userInput || "Image conversation");
        await updateChat(currentUser.uid, activeChatId, finalMessages, title);
        await fetchHistory(currentUser);
      } else {
        await updateChat(currentUser.uid, activeChatId, finalMessages);
      }


    } catch (e) {
      console.error("Error sending message:", e);
      const errorMessage = e instanceof Error ? e.message : "Failed to get a response.";
      setError(errorMessage);
       setMessages(prev => prev.map(msg =>
          msg.id === modelMessageId ? { ...msg, content: `Error: ${errorMessage}` } : msg
        ));
    } finally {
      setIsLoading(false);
    }
  };

  if (!appInitialized) {
    return (
      <div className="bg-green-50 flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-t-transparent border-green-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      {isAuthModalOpen && <AuthModal onAuth={handleAuth} onClose={() => setIsAuthModalOpen(false)} language={language} />}
      <div className="bg-green-50 font-sans flex h-screen">
        <Sidebar 
          history={chatHistory}
          activeChatId={activeChatId}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          disabled={!currentUser}
        />
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
           {!isFirebaseConfigured && (
            <div className="bg-yellow-100 border-b-2 border-yellow-200 text-yellow-800 text-center p-2 text-sm font-semibold">
              Firebase設定が不完全です。アカウント機能や会話履歴の保存は利用できません。
            </div>
          )}
          <Header 
            language={language} 
            onLanguageChange={handleLanguageChange}
            currentUser={currentUser}
            onLogout={handleLogout}
            onLoginClick={() => setIsAuthModalOpen(true)}
            isAuthDisabled={!isFirebaseConfigured}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
          <ChatWindow 
            messages={messages} 
            currentUser={currentUser} 
            language={language} 
            onSelectCandidate={handleSelectCandidate}
            isLoading={isLoading && messages.length === 0}
          />
          {error && <div className="text-center text-red-500 p-2 text-sm">{`Error: ${error}`}</div>}
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} language={language} disabled={!currentUser || !activeChatId} />
        </div>
      </div>
    </>
  );
};

export default App;
