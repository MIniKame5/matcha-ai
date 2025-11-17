import React, { useState } from 'react';
import { LanguageSwitcher } from './LanguageSwitcher.js';
import { MatchaIcon, UserIcon, LogoutIcon, MenuIcon } from './Icons.js';

const Header = ({
  language,
  onLanguageChange,
  currentUser,
  onLogout,
  onLoginClick,
  isAuthDisabled = false,
  onToggleSidebar
}) => {
  const [showMenu, setShowMenu] = useState(false);

  return React.createElement('header', { className: "p-4 border-b border-gray-100 flex justify-between items-center flex-shrink-0" },
    React.createElement('div', { className: "flex items-center gap-3" },
      React.createElement('button', { onClick: onToggleSidebar, className: "sm:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full" },
        React.createElement(MenuIcon, { className: "w-6 h-6" })
      ),
      React.createElement(MatchaIcon, { className: "w-8 h-8 hidden sm:block" }),
      React.createElement('h1', { className: "text-xl font-bold text-green-800 tracking-wider" }, "まっちゃAI")
    ),
    React.createElement('div', { className: "flex items-center gap-2" },
      React.createElement(LanguageSwitcher, { currentLanguage: language, onChange: onLanguageChange }),
      React.createElement('div', { className: "relative" },
        currentUser ?
          React.createElement('div', {
            className: "flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100",
            onClick: () => setShowMenu(!showMenu),
            onBlur: () => setTimeout(() => setShowMenu(false), 200),
            tabIndex: 0
          },
            React.createElement(UserIcon, { className: "w-5 h-5 text-gray-600" }),
            React.createElement('span', { className: "font-semibold text-gray-700 text-sm hidden sm:inline" }, currentUser.email)
          ) :
          React.createElement('button', {
            onClick: onLoginClick,
            disabled: isAuthDisabled,
            className: "px-3 py-2 text-sm rounded-lg text-white bg-green-500 font-semibold shadow-sm hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          }, isAuthDisabled ? '設定エラー' : 'ログイン / 作成'),
        currentUser && showMenu &&
          React.createElement('div', { className: "absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200" },
            React.createElement('button', {
              onClick: () => {
                onLogout();
                setShowMenu(false);
              },
              className: "w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
            },
              React.createElement(LogoutIcon, { className: "w-4 h-4" }),
              'ログアウト'
            )
          )
      )
    )
  );
};

export default Header;