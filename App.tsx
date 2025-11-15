import React, { useState, useEffect } from 'react';
import { type User } from 'firebase/auth';
import { ChatMessage, Language } from './types';
import { UI_TEXTS } from './constants';
import { chatService } from './services/geminiService';
import { onAuthStateChangedListener, signUpUser, signInUser, signOutUser } from './services/authService';
import { getChatHistory, saveChatHistory } from './services/firestoreService';
import { isFirebaseConfigured } from './firebaseConfig';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import AuthModal from './components/AuthModal';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('jp');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [appInitialized, setAppInitialized] = useState(false);

  useEffect(() => {
    if (isFirebaseConfigured) {
      const unsubscribe = onAuthStateChangedListener(async (user) => {
        chatService.initializeChat(language);
        if (user) {
          setCurrentUser(user);
          setIsLoading(true);
          const history = await getChatHistory(user.uid);
          setMessages(history ?? [{ id: Date.now(), role: 'model', content: UI_TEXTS[language].greeting }]);
          setIsLoading(false);
        } else {
          setCurrentUser(null);
          setMessages([]);
        }
        setAppInitialized(true);
      });
      return unsubscribe;
    } else {
      // Firebaseが未設定の場合、ログインしていない状態でアプリを初期化
      chatService.initializeChat(language);
      setMessages([]);
      setCurrentUser(null);
      setAppInitialized(true);
    }
  }, [language]);

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

  const handleSendMessage = async (userInput: string) => {
    if (!userInput.trim() || isLoading || !currentUser) return;

    const userMessage: ChatMessage = { id: Date.now(), role: 'user', content: userInput };
    const modelMessageId = userMessage.id + 1;
    const modelMessagePlaceholder: ChatMessage = { id: modelMessageId, role: 'model', content: '' };

    setMessages(prev => [...prev, userMessage, modelMessagePlaceholder]);
    
    setIsLoading(true);
    setError(null);
    
    let finalMessagesForSave: ChatMessage[] = [];

    try {
      const stream = await chatService.sendMessageStream(userInput);
      let fullModelResponse = '';

      for await (const chunk of stream) {
        const chunkText = chunk.text;
        fullModelResponse += chunkText;
        setMessages(prev => {
          const updatedMessages = prev.map(msg => 
            msg.id === modelMessageId 
              ? { ...msg, content: fullModelResponse } 
              : msg
          );
          finalMessagesForSave = updatedMessages;
          return updatedMessages;
        });
      }
    } catch (e) {
      console.error("Error sending message:", e);
      const errorMessage = e instanceof Error ? e.message : "Failed to get a response.";
      setError(errorMessage);
       setMessages(prev => {
         const updatedMessages = prev.map(msg =>
            msg.id === modelMessageId
              ? { ...msg, content: `Error: ${errorMessage}` }
              : msg
          );
          finalMessagesForSave = updatedMessages;
          return updatedMessages;
       });
    } finally {
      setIsLoading(false);
       if (currentUser && finalMessagesForSave.length > 0) {
          saveChatHistory(currentUser.uid, finalMessagesForSave);
      }
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
      <div className="bg-green-50 font-sans flex items-center justify-center min-h-screen p-0 sm:p-4">
        <div className="w-full h-full sm:max-w-3xl sm:h-[95vh] flex flex-col bg-white sm:rounded-2xl shadow-lg overflow-hidden border border-gray-200">
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
          />
          <ChatWindow messages={messages} currentUser={currentUser} language={language}/>
          {error && <div className="text-center text-red-500 p-2 text-sm">{`Error: ${error}`}</div>}
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} language={language} disabled={!currentUser} />
        </div>
      </div>
    </>
  );
};

export default App;