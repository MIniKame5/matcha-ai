import React, { useEffect, useRef } from 'react';
import { Message } from './Message.js';
import { MatchaIcon } from './Icons.js';
import { UI_TEXTS } from '../constants.js';

const ChatWindow = ({ messages, currentUser, language, onSelectCandidate, isLoading = false }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const renderContent = () => {
    if (isLoading) {
      return React.createElement('div', { className: "flex flex-col items-center justify-center h-full pt-16 text-center" },
        React.createElement('div', { className: "w-8 h-8 border-4 border-t-transparent border-green-500 rounded-full animate-spin" })
      );
    }
    if (!currentUser) {
      return React.createElement('div', { className: "flex flex-col items-center justify-center h-full pt-16 text-center" },
        React.createElement(MatchaIcon, { className: "w-16 h-16 text-green-300" }),
        React.createElement('h2', { className: "mt-4 text-2xl font-bold text-gray-700" }, "おかえりなさい！"),
        React.createElement('p', { className: "mt-2 text-gray-500" }, UI_TEXTS[language].welcomeMessage)
      );
    }
    if (messages.length > 0) {
      return messages.map((msg) =>
        React.createElement(Message, { key: msg.id, message: msg, onSelectCandidate: onSelectCandidate })
      );
    }
    return null;
  };

  return React.createElement('main', { className: "flex-1 overflow-y-auto p-4 md:p-6 space-y-6" },
    React.createElement('div', { className: "max-w-4xl mx-auto" },
      renderContent(),
      React.createElement('div', { ref: messagesEndRef })
    )
  );
};

export default ChatWindow;