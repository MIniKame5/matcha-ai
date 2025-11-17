import React, { useState, useEffect, useCallback } from 'react';
import { onAuthStateChangedListener, signInUser, signUpUser, signOutUser } from './services/authService.js';
import { getChatHistoryList, createNewChat, getChatMessages, updateChat } from './services/firestoreService.js';
import { chatService } from './services/geminiService.js';
import Header from './components/Header.js';
import ChatWindow from './components/ChatWindow.js';
import ChatInput from './components/ChatInput.js';
import AuthModal from './components/AuthModal.js';
import Sidebar from './components/Sidebar.js';
import { isFirebaseConfigured } from './firebaseConfig.js';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('jp');
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [appInitialized, setAppInitialized] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchHistory = useCallback(async (user) => {
    if (!user) return;
    const historyList = await getChatHistoryList(user.uid);
    setChatHistory(historyList);
    if (!activeChatId && historyList.length > 0) {
      await handleSelectChat(historyList[0].id, user);
    } else if (historyList.length === 0) {
      await handleNewChat(user);
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

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
  };
  
  const handleAuth = async (mode, email, pass) => {
    if (mode === 'login') {
      await signInUser(email, pass);
    } else {
      await signUpUser(email, pass);
    }
  };

  const handleLogout = async () => {
    await signOutUser();
  };

  const handleNewChat = async (user = currentUser) => {
    if (!user) return;
    setIsLoading(true);
    const newChatId = await createNewChat(user.uid);
    setActiveChatId(newChatId);
    setMessages([]);
    await fetchHistory(user);
    setIsLoading(false);
    if (window.innerWidth < 640) setIsSidebarOpen(false);
  };
  
  const handleSelectChat = async (chatId, user = currentUser) => {
    if (!user) return;
    setIsLoading(true);
    setActiveChatId(chatId);
    const loadedMessages = await getChatMessages(user.uid, chatId);
    setMessages(loadedMessages);
    setIsLoading(false);
    if (window.innerWidth < 640) setIsSidebarOpen(false);
  };

  const handleSelectCandidate = async (messageId, newIndex) => {
    let finalMessagesForSave = [];
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

  const handleSendMessage = async (userInput, selectedImage) => {
    if ((!userInput.trim() && !selectedImage) || isLoading || !currentUser || !activeChatId) return;
    const isNewChat = messages.length === 0;
    const userMessage = { 
      id: Date.now(), 
      role: 'user', 
      content: userInput, 
      image: selectedImage 
    };
    const modelMessageId = userMessage.id + 1;
    const modelMessagePlaceholder = { id: modelMessageId, role: 'model', content: '' };
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
      let finalModelMessage;
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
    return React.createElement('div', { className: "bg-green-50 flex items-center justify-center min-h-screen" },
      React.createElement('div', { className: "w-8 h-8 border-4 border-t-transparent border-green-500 rounded-full animate-spin" })
    );
  }

  return React.createElement(React.Fragment, null,
    isAuthModalOpen && React.createElement(AuthModal, { onAuth: handleAuth, onClose: () => setIsAuthModalOpen(false), language: language }),
    React.createElement('div', { className: "bg-green-50 font-sans flex h-screen" },
      React.createElement(Sidebar, {
        history: chatHistory,
        activeChatId: activeChatId,
        onNewChat: () => handleNewChat(),
        onSelectChat: handleSelectChat,
        isOpen: isSidebarOpen,
        onClose: () => setIsSidebarOpen(false),
        disabled: !currentUser
      }),
      React.createElement('div', { className: "flex-1 flex flex-col bg-white overflow-hidden" },
        !isFirebaseConfigured && React.createElement('div', { className: "bg-yellow-100 border-b-2 border-yellow-200 text-yellow-800 text-center p-2 text-sm font-semibold" },
          'Firebase設定が不完全です。アカウント機能や会話履歴の保存は利用できません。'
        ),
        React.createElement(Header, {
          language: language,
          onLanguageChange: handleLanguageChange,
          currentUser: currentUser,
          onLogout: handleLogout,
          onLoginClick: () => setIsAuthModalOpen(true),
          isAuthDisabled: !isFirebaseConfigured,
          onToggleSidebar: () => setIsSidebarOpen(!isSidebarOpen)
        }),
        React.createElement(ChatWindow, {
          messages: messages,
          currentUser: currentUser,
          language: language,
          onSelectCandidate: handleSelectCandidate,
          isLoading: isLoading && messages.length === 0
        }),
        error && React.createElement('div', { className: "text-center text-red-500 p-2 text-sm" }, `Error: ${error}`),
        React.createElement(ChatInput, {
          onSendMessage: handleSendMessage,
          isLoading: isLoading,
          language: language,
          disabled: !currentUser || !activeChatId
        })
      )
    )
  );
};

export default App;