import React, { useState, useRef } from 'react';
import { UI_TEXTS } from '../constants.js';
import { PhotoIcon, XCircleIcon } from './Icons.js';

const ChatInput = ({ onSendMessage, isLoading, language, disabled }) => {
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((input.trim() || selectedImage) && !isLoading && !disabled) {
      onSendMessage(input, selectedImage || undefined);
      setInput('');
      clearImage();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const canSend = (input.trim() || selectedImage) && !isLoading && !disabled;

  return React.createElement('div', { className: "p-4 bg-white border-t border-gray-100 flex-shrink-0" },
    React.createElement('div', { className: "max-w-4xl mx-auto" },
      React.createElement('form', { onSubmit: handleSubmit },
        selectedImage && React.createElement('div', { className: "relative mb-3 p-2 bg-gray-100 rounded-lg border border-gray-200" },
          React.createElement('img', {
            src: `data:${selectedImage.mimeType};base64,${selectedImage.base64}`,
            alt: "Selected preview",
            className: "max-h-32 w-auto rounded-md mx-auto"
          }),
          React.createElement('button', {
            type: "button",
            onClick: clearImage,
            className: "absolute top-1 right-1 text-gray-500 hover:text-gray-700 p-1 bg-white rounded-full shadow-sm",
            'aria-label': "Clear selected image"
          },
            React.createElement(XCircleIcon, { className: "w-5 h-5" })
          )
        ),
        React.createElement('div', { className: "flex items-end gap-2" },
          React.createElement('textarea', {
            id: "chat-input",
            value: input,
            onChange: (e) => setInput(e.target.value),
            onKeyDown: handleKeyDown,
            className: "flex-1 bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-green-400 focus:outline-none transition resize-none disabled:bg-gray-200",
            rows: 2,
            disabled: isLoading || disabled,
            placeholder: disabled ? UI_TEXTS[language].welcomeMessage : UI_TEXTS[language].placeholder
          }),
          React.createElement('input', {
            type: "file",
            accept: "image/*",
            ref: fileInputRef,
            onChange: handleFileChange,
            className: "hidden",
            disabled: isLoading || disabled
          }),
          React.createElement('button', {
            type: "button",
            onClick: () => fileInputRef.current?.click(),
            disabled: isLoading || disabled,
            className: "p-3 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed",
            'aria-label': "Upload Image"
          },
            React.createElement(PhotoIcon, { className: "w-6 h-6" })
          ),
          React.createElement('button', {
            type: "submit",
            disabled: !canSend,
            className: "px-4 py-3 rounded-lg bg-green-500 text-white font-semibold transition-colors duration-200 disabled:bg-green-300 disabled:cursor-not-allowed hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500",
            'aria-label': UI_TEXTS[language].button
          },
            isLoading ? React.createElement('div', { className: "w-5 h-5 mx-auto border-2 border-t-transparent border-white rounded-full animate-spin" }) : UI_TEXTS[language].button
          )
        )
      )
    )
  );
};

export default ChatInput;