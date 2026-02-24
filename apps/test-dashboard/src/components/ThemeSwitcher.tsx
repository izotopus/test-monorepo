import { useState } from 'preact/hooks';
import { ThemeService } from '@shared/logic';
import { useLogger } from '../providers/LoggerProvider';

export const ThemeSwitcher = () => {
  const logger = useLogger();
  const [theme, setThemeState] = useState(ThemeService.getTheme());

  const toggleTheme = () => {
    const newTheme = ThemeService.toggleTheme('DASHBOARD_UI');
    setThemeState(newTheme);

    logger.info('UI', `Theme changed to: ${newTheme}`);
  };

  return (
    <button onClick={toggleTheme} className="p-2 pr-4 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer">
      {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
};