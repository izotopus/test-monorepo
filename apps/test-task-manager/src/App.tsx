import React, { useEffect, useState } from 'react';
import { TM_MicroAppProps } from '@shared/types';
import { useLogger } from './providers/LoggerProvider';
// import { subscribeToGlobalEvents } from '@shared/logic';
import { emitTaskEvent, useGlobalEvent } from './helpers/events';

const App = ({
  standalone = false,
  theme: initialTheme,
  user,
}: TM_MicroAppProps) => {
  const logger = useLogger();
  const [currentTheme, setCurrentTheme] = useState(initialTheme);

  useGlobalEvent('ui:theme-change', (theme) => {
    logger.info('Event', `Zmieniam motyw na: ${theme}`);
    setCurrentTheme(theme);
  });

  /* useEffect(() => {
    const unsubscribe = subscribeToGlobalEvents(
      (event) => {
        logger.info('Event', `Zmieniam motyw na: ${event.payload}`);
        setCurrentTheme(event.payload);
      },
      { type: 'ui:theme-change' }
      // { type: /^ui:theme-change/ }
    );
    return unsubscribe;
  }, []); */
  
  const handleCreateTask = () => {
    emitTaskEvent('tasks:created', { title: 'Nowe zadanie' });
    /* emitGlobal('task-manager', 'tasks:created', {
      title: 'Nowe zadanie'
    }) */
  }

  const handleDeleteTask = () => {
    emitTaskEvent('tasks:deleted', { id: 1234 });
  }

  return (
    <div className={`p-4 transition-colors duration-300 dark:bg-slate-900 dark:text-white bg-white text-slate-900`}>

      <h2 className="text-xl font-bold">
        <span className="text-2xl">🚀</span>
        {' '}Task Manager{' '}
        <span className="text-cyan-400">Micro-frontend</span>
      </h2>

      <p className="text-slate-400 mb-6">
        Jestem komponentem napisanym w <strong className={`transition-colors duration-300 text-black dark:text-slate-200`}>React</strong>, 
        działającym wewnątrz dashboardu.
      </p>

      {standalone && (
        <div className="inline-block px-3 py-1 mb-6 text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full">
          Mode: Standalone
        </div>
      )}

      <p>Aktualny motyw: <span className="font-mono">{currentTheme}</span></p>
      
      <div className="mb-4 flex items-center gap-4">
        <button 
          onClick={handleCreateTask}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded shadow cursor-pointer"
        >
          Dodaj zadanie
        </button>

        <button 
          onClick={handleDeleteTask}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded shadow cursor-pointer"
        >
          Usuń zadanie
        </button>
      </div>

      <p className="mb-0 text-slate-600 dark:text-slate-400">
        Propsy z test-dashboard: 
      </p>
      <pre className="mb-4 text-xs text-indigo-600 dark:text-indigo-200 font-mono">{JSON.stringify(user, null, 2)}</pre>

    </div>
  );
};

export default App;