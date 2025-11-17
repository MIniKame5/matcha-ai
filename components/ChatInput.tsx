import React, { useState, useRef } from 'react';
import { UI_TEXTS } from '../constants';
import { PhotoIcon, XCircleIcon } from './Icons';

interface ChatInputProps {
  onSendMessage: (input: string, image: { base64: string; mimeType: string } | null) => void;
  isLoading: boolean;
  language: string;
  disabled: boolean;
}

type SelectedImage = {
  base64: string;
  mimeType: string;
};

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, language, disabled }) => {
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result?.toString().split(',')[1];
        if (base64String) {
          setSelectedImage({ base64: base64String, mimeType: file.type });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((input.trim() || selectedImage) && !isLoading && !disabled) {
      onSendMessage(input, selectedImage || null);
      setInput('');
      clearImage();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const canSend = (input.trim() || selectedImage) && !isLoading && !disabled;

  return (
    <div className="p-4 bg-white border-t border-gray-100 flex-shrink-0">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit}>
          {selectedImage && (
            <div className="relative mb-3 p-2 bg-gray-100 rounded-lg border border-gray-200">
              <img
                src={`data:${selectedImage.mimeType};base64,${selectedImage.base64}`}
                alt="Selected preview"
                className="max-h-32 w-auto rounded-md mx-auto"
              />
              <button
                type="button"
                onClick={clearImage}
                className="absolute top-1 right-1 text-gray-500 hover:text-gray-700 p-1 bg-white rounded-full shadow-sm"
                aria-label="Clear selected image"
              >
                <XCircleIcon className="w-5 h-5" />
              </button>
            </div>
          )}
          <div className="flex items-end gap-2">
            <textarea
              id="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-green-400 focus:outline-none transition resize-none disabled:bg-gray-200"
              rows={2}
              disabled={isLoading || disabled}
              placeholder={disabled ? UI_TEXTS[language].welcomeMessage : UI_TEXTS[language].placeholder}
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              disabled={isLoading || disabled}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading || disabled}
              className="p-3 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
              aria-label="Upload Image"
            >
              <PhotoIcon className="w-6 h-6" />
            </button>
            <button
              type="submit"
              disabled={!canSend}
              className="px-4 py-3 rounded-lg bg-green-500 text-white font-semibold transition-colors duration-200 disabled:bg-green-300 disabled:cursor-not-allowed hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              aria-label={UI_TEXTS[language].button}
            >
              {isLoading ? <div className="w-5 h-5 mx-auto border-2 border-t-transparent border-white rounded-full animate-spin" /> : UI_TEXTS[language].button}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;
