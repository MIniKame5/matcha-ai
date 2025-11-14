import React, { useState } from 'react';
import { UI_TEXTS } from '../constants';
import { Language } from '../types';

interface Props {
  onAuth: (mode: 'login' | 'signup', email: string, pass: string) => void;
  onClose: () => void;
  language: Language;
}

const AuthModal: React.FC<Props> = ({ onAuth, onClose, language }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoginMode) {
      onAuth('login', username, password);
    } else {
      onAuth('signup', username, password);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        <h2 className="text-2xl font-bold text-center mb-2 text-green-800">{UI_TEXTS[language].authModalTitle}</h2>
        <p className="text-center text-gray-500 mb-6">
            {!isLoginMode && <span className="font-semibold text-gray-700">@account.matcha-kame.com</span>}
        </p>

        <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={UI_TEXTS[language].authModalEmailPlaceholder}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={UI_TEXTS[language].authModalPasswordPlaceholder}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition duration-300">
              {isLoginMode ? UI_TEXTS[language].authModalLoginButton : UI_TEXTS[language].authModalSignUpButton}
            </button>
        </form>
        
        <p className="text-center text-sm text-gray-500 mt-6">
          {isLoginMode ? UI_TEXTS[language].authModalToggleToSignUp : UI_TEXTS[language].authModalToggleToLogin}
          <button onClick={() => setIsLoginMode(!isLoginMode)} className="text-green-600 hover:underline font-semibold ml-1">
            {isLoginMode ? UI_TEXTS[language].authModalSignUpButton : UI_TEXTS[language].authModalLoginButton}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;