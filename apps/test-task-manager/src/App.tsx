import React, { useEffect, useState } from 'react';
import { TM_MicroAppProps, GenericMfEvent } from '@shared/types';
import { useLogger } from './providers/LoggerProvider';

const App = ({
  standalone = false,
  theme: initialTheme,
  user,
  subscribe,
  // logger,
  onEvent,
}: TM_MicroAppProps) => {
  const logger = useLogger();
  const [currentTheme, setCurrentTheme] = useState(initialTheme);

  useEffect(() => {
    if (typeof subscribe !== 'function') {
      logger.error('', 'Running without communication bridge (standalone?)');
      return;
    }
    
    const unsubscribe = subscribe((event: GenericMfEvent) => {
      
      if (event.type === 'SET_THEME') {
        logger.info('Event', `Zmieniam motyw na: ${event.payload}`);
        setCurrentTheme(event.payload);
      }

      if (event.type === 'GLOBAL_REFRESH') {
        
      }
    });

    return () => {
      logger.info('Event', 'Czyszczenie subskrypcji');
      unsubscribe();
    };
  }, [subscribe, logger]);

  return (
    <div className={`p-4 transition-colors duration-300 ${currentTheme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>

      <h2 className="text-xl font-bold">
        <span className="text-2xl">🚀</span>
        {' '}Task Manager{' '}
        <span className="text-cyan-400">Micro-frontend</span>
      </h2>

      <p className="text-slate-400 mb-6">
        Jestem komponentem napisanym w <strong className={`transition-colors duration-300 ${currentTheme === 'dark' ? 'text-slate-200' : 'text-black'}`}>React</strong>, 
        działającym wewnątrz dashboardu.
      </p>

      {standalone && (
        <div className="inline-block px-3 py-1 mb-6 text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full">
          Mode: Standalone
        </div>
      )}

      <p>Aktualny motyw: <span className="font-mono">{currentTheme}</span></p>
      
      <button 
        onClick={() => onEvent({ type: 'TASK_CREATED', payload: { title: 'Nowe zadanie' } })}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded shadow"
      >
        Dodaj zadanie
      </button>

      <hr className="my-8" />

      <p>Propsy z test-dashboard: {JSON.stringify(user, null, 2)}</p>
    </div>
  );
};

export default App;