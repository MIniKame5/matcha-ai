
import React from 'react';
import { ChatMessage } from '../types';
import { MatchaIcon } from './Icons';

interface MessageProps {
  message: ChatMessage;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isModel = message.role === 'model';
  const TypingCursor = () => <span className="animate-pulse">▍</span>;

  return (
    <div className={`flex items-start gap-3 my-4 ${isModel ? 'justify-start' : 'justify-end'}`}>
      {isModel && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center border-2 border-green-200">
          <MatchaIcon className="w-6 h-6" />
        </div>
      )}
      <div
        className={`max-w-md md:max-w-lg px-4 py-3 rounded-2xl shadow-sm whitespace-pre-wrap text-gray-800 ${
          isModel
            ? 'bg-green-100 rounded-tl-none'
            : 'bg-sky-100 rounded-tr-none'
        }`}
      >
        {message.content || <TypingCursor />}
      </div>
    </div>
  );
};

export default Message;