import React from 'react';
import { PencilIcon } from './Icons.js';

const Sidebar = ({ history, activeChatId, onNewChat, onSelectChat, isOpen, onClose, disabled }) => {
  return React.createElement(React.Fragment, null,
    React.createElement('div', {
      className: `fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`,
      onClick: onClose
    }),
    React.createElement('aside', {
      className: `absolute sm:relative flex flex-col w-64 bg-green-50 border-r border-gray-200 h-full z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0 sm:flex-shrink-0`
    },
      React.createElement('div', { className: "p-4 flex-shrink-0" },
        React.createElement('button', {
          onClick: onNewChat,
          disabled: disabled,
          className: "w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-left text-green-800 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        },
          'チャットを新規作成',
          React.createElement(PencilIcon, { className: "w-4 h-4" })
        )
      ),
      React.createElement('nav', { className: "flex-1 overflow-y-auto px-2" },
        React.createElement('p', { className: "px-4 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider" }, "最近のチャット"),
        React.createElement('ul', { className: "space-y-1" },
          history.map((chat) =>
            React.createElement('li', { key: chat.id },
              React.createElement('button', {
                onClick: () => onSelectChat(chat.id),
                className: `w-full text-left px-4 py-2 text-sm rounded-md truncate transition-colors ${activeChatId === chat.id ? 'bg-green-200 text-green-900 font-semibold' : 'text-gray-700 hover:bg-green-100'}`
              },
                chat.title
              )
            )
          )
        )
      )
    )
  );
};

export default Sidebar;