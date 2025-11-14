import React, { useState } from 'react';
import type { User } from 'firebase/auth';
import { MatchaIcon, UserIcon, LogoutIcon } from './Icons';
import LanguageSwitcher from './LanguageSwitcher';
import { Language } from '../types';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  currentUser: User | null;
  onLogout: () => void;
  onLoginClick: () => void;
  isAuthDisabled?: boolean;
}

const Header: React.FC<HeaderProps> = ({ language, onLanguageChange, currentUser, onLogout, onLoginClick, isAuthDisabled = false }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="p-4 border-b border-gray-100 flex justify-between items-center flex-shrink-0">
      <div className="flex items-center gap-3">
        <MatchaIcon className="w-8 h-8" />
        <h1 className="text-xl font-bold text-green-800 tracking-wider">
          のちのち！かめAI
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <LanguageSwitcher currentLanguage={language} onChange={onLanguageChange} />
        <div className="relative">
          {currentUser ? (
            <div 
              className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setShowMenu(!showMenu)}
              onBlur={() => setTimeout(() => setShowMenu(false), 200)}
              tabIndex={0}
            >
              <UserIcon className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-700 text-sm hidden sm:inline">{currentUser.email}</span>
            </div>
          ) : (
            <button 
              onClick={onLoginClick}
              disabled={isAuthDisabled}
              className="px-3 py-2 text-sm rounded-lg text-white bg-green-500 font-semibold shadow-sm hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isAuthDisabled ? '設定エラー' : 'ログイン / 作成'}
            </button>
          )}
          {currentUser && showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
              <button 
                onClick={() => {
                  onLogout();
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <LogoutIcon className="w-4 h-4" />
                ログアウト
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;