import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Moon, Sun } from 'lucide-react'; // Make sure to install lucide-react

interface Props {
  title: string;
  isVerified?: boolean;
}

export default function HeaderComp({ title, isVerified }: Props) {
  const { toggleLang, locale } = useLanguage();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'light';
    setIsDark(theme === 'dark');
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    const themeStr = next ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', themeStr);
    localStorage.setItem('theme', themeStr);
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-surface/80 backdrop-blur-md sticky top-0 z-40 border-b border-border transition-colors duration-300">
      <button 
        className="p-2 rounded-lg hover:bg-input transition-colors text-text font-bold text-sm"
        onClick={toggleLang}
      >
        {locale === 'en' ? 'MM' : 'EN'}
      </button>

      <div className="flex-1 flex justify-center">
        <div className="flex items-center gap-1.5 font-bold text-lg text-text">
          <span className="truncate max-w-[200px]">{title}</span>
          {isVerified && (
            <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">✓</div>
          )}
        </div>
      </div>

      <button 
        className="p-2 rounded-lg hover:bg-input transition-colors text-text"
        onClick={toggleTheme}
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
    </header>
  );
}