import { useState } from 'preact/hooks';
import { emitGlobalEvent } from '@shared/logic';
import { useLogger } from '../providers/LoggerProvider';

export const ThemeSwitcher = () => {
  const logger = useLogger();
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  const toggleTheme = () => {
    const newTheme = !isDark ? 'dark' : 'light';
    setIsDark(!isDark);

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    emitGlobalEvent({
      type: 'SET_THEME',
      payload: newTheme,
      source: 'DASHBOARD_UI'
    });

    logger.info('UI', `Theme changed to: ${newTheme}`);
  };

  return (
    <button onClick={toggleTheme} className="p-2 pr-4 bg-slate-200 dark:bg-slate-800 rounded-lg">
      {isDark ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
};