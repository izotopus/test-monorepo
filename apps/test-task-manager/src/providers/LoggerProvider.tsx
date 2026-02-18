import React, { createContext, useContext } from 'react';

type LoggerType = ReturnType<typeof import('@shared/logic').createLogger>;

const LoggerContext = createContext<LoggerType | null>(null);

export const LoggerProvider: React.FC<{ logger: LoggerType, children: React.ReactNode }> = ({ logger, children }) => (
  <LoggerContext.Provider value={logger}>
    {children}
  </LoggerContext.Provider>
);

export const useLogger = () => {
  const context = useContext(LoggerContext);
  if (!context) throw new Error('useLogger must be used within LoggerProvider');
  return context;
};