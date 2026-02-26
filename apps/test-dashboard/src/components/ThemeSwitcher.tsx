import { useState } from 'preact/hooks';
import { ThemeService } from '@shared/logic';
import { useLogger } from '../providers/LoggerProvider';

export const ThemeSwitcher = () => {
  const logger = useLogger();
  const [theme, setThemeState] = useState(ThemeService.getTheme());

  const toggleTheme = () => {
    const newTheme = ThemeService.toggleTheme('DASHBOARD_UI');
    setThemeState(newTheme);

    logger.info('UI', `Button click, theme changed to: ${newTheme}`);
  };

  return (
    <button
      onClick={toggleTheme}
      className="group relative flex items-center gap-2 p-2 pr-4 rounded-lg
                bg-slate-200 text-slate-900 
                dark:bg-slate-800 dark:text-white 
                transition-all duration-300 ease-in-out overflow-hidden cursor-pointer"
      >
      {/* {theme === 'dark' ? '🌙 Dark' : '☀️ Light'} */}
      <div className="relative h-6 w-6">
        <span className={`absolute inset-0 transition-all duration-500 ${
          theme === 'dark' ? 'translate-y-8 opacity-0' : 'translate-y-0 opacity-100'
        }`}>☀️</span>
        
        <span className={`absolute inset-0 transition-all duration-500 ${
          theme === 'dark' ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
        }`}>🌙</span>
      </div>

      <span className="font-medium">
        {theme === 'dark' ? 'Dark' : 'Light'}
      </span>
    </button>
  );
};