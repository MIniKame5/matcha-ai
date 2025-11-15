import React, { useState } from 'react';
import { Language } from '../types';
import { UI_TEXTS } from '../constants';
import { MatchaIcon } from './Icons';

interface AuthModalProps {
  onAuth: (mode: 'login' | 'signup', email: string, pass: string) => Promise<void>;
  onClose: () => void;
  language: Language;
}

const AuthModal: React.FC<AuthModalProps> = ({ onAuth, onClose, language }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      await onAuth(isLoginMode ? 'login' : 'signup', email, password);
      onClose();
    } catch (err: any) {
      let message = 'エラーが発生しました。もう一度お試しください。';
      if (err.code === 'auth/invalid-email') {
        message = '有効なメールアドレスを入力してください。';
      } else if (err.code === 'auth/weak-password') {
        message = 'パスワードは6文字以上で設定してください。';
      } else if (err.code === 'auth/email-already-in-use') {
        message = 'このメールアドレスは既に使用されています。ログインしてください。';
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found') {
        message = 'メールアドレスまたはパスワードが間違っています。';
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };
  
  const texts = UI_TEXTS[language];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-sm relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center">
          <MatchaIcon className="w-12 h-12 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-green-800">{texts.authModalTitle}</h2>
          <p className="text-gray-500 mt-1 text-sm">会話の履歴をクラウドに保存します</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={texts.authModalEmailPlaceholder}
            className="w-full bg-gray-100 border-2 border-gray-200 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:outline-none transition"
            autoFocus
          />
           <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={texts.authModalPasswordPlaceholder}
            className="w-full mt-3 bg-gray-100 border-2 border-gray-200 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:outline-none transition"
          />
          {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading || !email.trim() || !password.trim()}
            className="w-full mt-4 px-4 py-3 rounded-lg bg-green-500 text-white font-semibold transition-colors duration-200 disabled:bg-green-300 disabled:cursor-not-allowed hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {loading ? <div className="w-5 h-5 mx-auto border-2 border-t-transparent border-white rounded-full animate-spin"></div> : (isLoginMode ? texts.authModalLoginButton : texts.authModalSignUpButton)}
          </button>
        </form>
         <button 
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setError(null);
            }} 
            className="text-center w-full mt-4 text-sm text-green-600 hover:underline"
          >
          {isLoginMode ? texts.authModalToggleToSignUp : texts.authModalToggleToLogin}
        </button>
      </div>
    </div>
  );
};

export default AuthModal;