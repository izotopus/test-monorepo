import { createLogger, emitGlobal } from '@shared/logic';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'theme-preference'

const logger = createLogger('event-bus');

export const ThemeService = {
  getTheme(): ThemeMode {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  },

  setTheme(theme: ThemeMode, source: string = 'SYSTEM'): void {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    localStorage.setItem(STORAGE_KEY, theme);

    emitGlobal('theme-service', 'ui:theme-change', theme);

    logger.info('THEME_SERVICE', `Theme set to: ${theme} (Source: ${source})`);
  },

  toggleTheme(source: string = 'UI_TOGGLE'): ThemeMode {
    const newTheme = this.getTheme() === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme, source);
    return newTheme;
  },

  init(): void {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = saved || (systemDark ? 'dark' : 'light');
    this.setTheme(initialTheme, 'INIT');
  }
};