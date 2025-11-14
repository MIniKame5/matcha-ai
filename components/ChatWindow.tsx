import React, { useEffect, useRef } from 'react';
import type { User } from 'firebase/auth';
import { ChatMessage, Language } from '../types';
import Message from './Message';
import { UI_TEXTS } from '../constants';
import { MatchaIcon } from './Icons';

interface ChatWindowProps {
  messages: ChatMessage[];
  currentUser: User | null;
  language: Language;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, currentUser, language }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
      <div className="max-w-4xl mx-auto">
        {currentUser ? (
          <>
            {messages.map((msg) => (
              <Message key={msg.id} message={msg} />
            ))}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full pt-16 text-center">
            <MatchaIcon className="w-16 h-16 text-green-300" />
            <h2 className="mt-4 text-2xl font-bold text-gray-700">おかえりなさい！</h2>
            <p className="mt-2 text-gray-500">{UI_TEXTS[language].welcomeMessage}</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </main>
  );
};

export default ChatWindow;