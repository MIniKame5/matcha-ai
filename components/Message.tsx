import React from 'react';
import { MatchaIcon, ChevronLeftIcon, ChevronRightIcon } from './Icons';
import { Message as MessageType } from '../types';

interface MessageProps {
  message: MessageType;
  onSelectCandidate: (messageId: number, newIndex: number) => void;
}

const TypingCursor = () => <span className="animate-pulse">▍</span>;

export const Message: React.FC<MessageProps> = ({ message, onSelectCandidate }) => {
  const isModel = message.role === 'model';
  const hasCandidates = message.role === 'model' && message.candidates && message.candidates.length > 1;
  const currentIndex = message.selectedCandidateIndex ?? 0;
  const totalCandidates = message.candidates?.length ?? 0;

  return (
    <div className={`flex items-start gap-3 my-4 ${isModel ? 'justify-start' : 'justify-end'}`}>
      {isModel && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center border-2 border-green-200">
          <MatchaIcon className="w-6 h-6" />
        </div>
      )}
      <div className="flex flex-col items-start">
        <div className={`max-w-md md:max-w-lg px-4 py-3 rounded-2xl shadow-sm whitespace-pre-wrap text-gray-800 ${isModel ? 'bg-green-100 rounded-tl-none' : 'bg-sky-100 rounded-tr-none'}`}>
          {message.image && (
            <img
              src={`data:${message.image.mimeType};base64,${message.image.base64}`}
              alt="Uploaded content"
              className="rounded-lg mb-2 max-w-full h-auto"
              style={{ maxWidth: '200px', maxHeight: '200px' }}
            />
          )}
          {message.content || (isModel && !message.image ? <TypingCursor /> : null)}
        </div>
        {hasCandidates && (
          <div className="flex items-center gap-2 mt-2 px-2 py-1 rounded-full bg-gray-100 border border-gray-200">
            <button
              onClick={() => onSelectCandidate(message.id, currentIndex - 1)}
              disabled={currentIndex === 0}
              className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous response"
            >
              <ChevronLeftIcon className="w-4 h-4 text-gray-600" />
            </button>
            <span className="text-xs font-mono text-gray-500 tabular-nums">{`${currentIndex + 1} / ${totalCandidates}`}</span>
            <button
              onClick={() => onSelectCandidate(message.id, currentIndex + 1)}
              disabled={currentIndex >= totalCandidates - 1}
              className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Next response"
            >
              <ChevronRightIcon className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
