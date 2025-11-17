import React, { useState } from 'react';
import { UI_TEXTS } from '../constants.js';
import { MatchaIcon } from './Icons.js';

const AuthModal = ({ onAuth, onClose, language }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      await onAuth(isLoginMode ? 'login' : 'signup', email, password);
      onClose();
    } catch (err) {
      let message = 'エラーが発生しました。もう一度お試しください。';
      if (err.code === 'auth/invalid-email') {
        message = '有効なメールアドレスを入力してください。';
      } else if (err.code === 'auth/weak-password') {
        message = 'パスワードは6文字以上で設定してください。';
      } else if (err.code === 'auth/email-already-in-use') {
        message = 'このメールアドレスは既に使用されています。ログインしてください。';
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        message = 'メールアドレスまたはパスワードが間違っています。';
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };
  
  const texts = UI_TEXTS[language];

  return React.createElement('div', { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" },
    React.createElement('div', { className: "bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-sm relative" },
      React.createElement('button', {
        onClick: onClose,
        className: "absolute top-3 right-3 text-gray-400 hover:text-gray-600",
        'aria-label': "Close modal"
      },
        React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
          React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" })
        )
      ),
      React.createElement('div', { className: "text-center" },
        React.createElement(MatchaIcon, { className: "w-12 h-12 mx-auto mb-3" }),
        React.createElement('h2', { className: "text-2xl font-bold text-green-800" }, texts.authModalTitle),
        React.createElement('p', { className: "text-gray-500 mt-1 text-sm" }, "会話の履歴をクラウドに保存します")
      ),
      React.createElement('form', { onSubmit: handleSubmit, className: "mt-6" },
        React.createElement('input', {
          type: "email",
          value: email,
          onChange: (e) => setEmail(e.target.value),
          placeholder: texts.authModalEmailPlaceholder,
          className: "w-full bg-gray-100 border-2 border-gray-200 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:outline-none transition",
          autoFocus: true
        }),
        React.createElement('input', {
          type: "password",
          value: password,
          onChange: (e) => setPassword(e.target.value),
          placeholder: texts.authModalPasswordPlaceholder,
          className: "w-full mt-3 bg-gray-100 border-2 border-gray-200 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:outline-none transition"
        }),
        error && React.createElement('p', { className: "text-red-500 text-xs mt-2 text-center" }, error),
        React.createElement('button', {
          type: "submit",
          disabled: loading || !email.trim() || !password.trim(),
          className: "w-full mt-4 px-4 py-3 rounded-lg bg-green-500 text-white font-semibold transition-colors duration-200 disabled:bg-green-300 disabled:cursor-not-allowed hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        },
          loading ? React.createElement('div', { className: "w-5 h-5 mx-auto border-2 border-t-transparent border-white rounded-full animate-spin" }) : (isLoginMode ? texts.authModalLoginButton : texts.authModalSignUpButton)
        )
      ),
      React.createElement('button', {
        onClick: () => {
          setIsLoginMode(!isLoginMode);
          setError(null);
        },
        className: "text-center w-full mt-4 text-sm text-green-600 hover:underline"
      },
        isLoginMode ? texts.authModalToggleToSignUp : texts.authModalToggleToLogin
      )
    )
  );
};

export default AuthModal;