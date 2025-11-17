import React from 'react';
import { PencilIcon } from './Icons';

interface SidebarProps {
  history: { id: string; title: string }[];
  activeChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  isOpen: boolean;
  onClose: () => void;
  disabled: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ history, activeChatId, onNewChat, onSelectChat, isOpen, onClose, disabled }) => {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <aside
        className={`absolute sm:relative flex flex-col w-64 bg-green-50 border-r border-gray-200 h-full z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0 sm:flex-shrink-0`}
      >
        <div className="p-4 flex-shrink-0">
          <button
            onClick={onNewChat}
            disabled={disabled}
            className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-left text-green-800 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            チャットを新規作成
            <PencilIcon className="w-4 h-4" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-2">
          <p className="px-4 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">最近のチャット</p>
          <ul className="space-y-1">
            {history.map((chat) => (
              <li key={chat.id}>
                <button
                  onClick={() => onSelectChat(chat.id)}
                  className={`w-full text-left px-4 py-2 text-sm rounded-md truncate transition-colors ${activeChatId === chat.id ? 'bg-green-200 text-green-900 font-semibold' : 'text-gray-700 hover:bg-green-100'}`}
                >
                  {chat.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
