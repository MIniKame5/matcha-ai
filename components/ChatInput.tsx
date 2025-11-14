import React, { useState, KeyboardEvent } from 'react';
import { Language } from '../types';
import { UI_TEXTS } from '../constants';

interface ChatInputProps {
  onSendMessage: (input: string) => void;
  isLoading: boolean;
  language: Language;
  disabled: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, language, disabled }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading && !disabled) {
      onSendMessage(input);
      setInput('');
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="p-4 bg-white border-t border-gray-100 flex-shrink-0">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit}>
          <label htmlFor="chat-input" className={`font-medium mb-2 block text-sm ${disabled ? 'text-gray-400' : 'text-gray-600'}`}>
            {UI_TEXTS[language].placeholder}
          </label>
          <textarea
            id="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-green-400 focus:outline-none transition resize-none disabled:bg-gray-200"
            rows={2}
            disabled={isLoading || disabled}
            placeholder={disabled ? "アカウントを作成してチャットを開始…" : ""}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim() || disabled}
            className="w-full mt-3 px-4 py-3 rounded-lg bg-green-500 text-white font-semibold transition-colors duration-200 disabled:bg-green-300 disabled:cursor-not-allowed hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            aria-label={UI_TEXTS[language].button}
          >
            {isLoading ? (
              <div className="w-5 h-5 mx-auto border-2 border-t-transparent border-white rounded-full animate-spin"></div>
            ) : (
              UI_TEXTS[language].button
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;