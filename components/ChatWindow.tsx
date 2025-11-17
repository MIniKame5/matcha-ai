import React, { useEffect, useRef } from 'react';
import { Message } from './Message';
import { MatchaIcon } from './Icons';
import { UI_TEXTS } from '../constants';
import { Message as MessageType } from '../types';

interface ChatWindowProps {
  messages: MessageType[];
  currentUser: any;
  language: string;
  onSelectCandidate: (messageId: number, newIndex: number) => void;
  isLoading?: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, currentUser, language, onSelectCandidate, isLoading = false }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full pt-16 text-center">
          <div className="w-8 h-8 border-4 border-t-transparent border-green-500 rounded-full animate-spin" />
        </div>
      );
    }
    if (!currentUser) {
      return (
        <div className="flex flex-col items-center justify-center h-full pt-16 text-center">
          <MatchaIcon className="w-16 h-16 text-green-300" />
          <h2 className="mt-4 text-2xl font-bold text-gray-700">おかえりなさい！</h2>
          <p className="mt-2 text-gray-500">{UI_TEXTS[language].welcomeMessage}</p>
        </div>
      );
    }
    if (messages.length > 0) {
      return messages.map((msg) =>
        <Message key={msg.id} message={msg} onSelectCandidate={onSelectCandidate} />
      );
    }
    return null;
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
      <div className="max-w-4xl mx-auto">
        {renderContent()}
        <div ref={messagesEndRef} />
      </div>
    </main>
  );
};

export default ChatWindow;
