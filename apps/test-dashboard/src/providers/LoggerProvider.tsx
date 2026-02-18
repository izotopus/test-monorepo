import { createContext } from 'preact';
import { useContext } from 'preact/hooks';

type LoggerType = ReturnType<typeof import('@shared/logic').createLogger>;

const LoggerContext = createContext<LoggerType | null>(null);

export function LoggerProvider({ logger, children }: { logger: LoggerType, children: any }) {
  return (
    <LoggerContext.Provider value={logger}>
      {children}
    </LoggerContext.Provider>
  );
}

export const useLogger = () => {
  const context = useContext(LoggerContext);
  if (!context) {
    console.warn('LoggerContext not found! Using fallback console.');
    return console; 
  }
  return context;
};