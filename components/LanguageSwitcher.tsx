
import React from 'react';
import { Language } from '../types';

interface LanguageSwitcherProps {
  currentLanguage: Language;
  onChange: (lang: Language) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ currentLanguage, onChange }) => {
  const inactiveClass = 'px-3 py-1 text-sm rounded-md text-gray-600 bg-gray-200 hover:bg-gray-300 transition-colors';
  const activeClass = 'px-3 py-1 text-sm rounded-md text-white bg-green-500 font-semibold shadow-sm';

  return (
    <div className="flex items-center p-1 bg-gray-100 rounded-lg space-x-1">
      <button
        onClick={() => onChange('jp')}
        className={currentLanguage === 'jp' ? activeClass : inactiveClass}
      >
        日本語
      </button>
      <button
        onClick={() => onChange('en')}
        className={currentLanguage === 'en' ? activeClass : inactiveClass}
      >
        English
      </button>
    </div>
  );
};

export default LanguageSwitcher;