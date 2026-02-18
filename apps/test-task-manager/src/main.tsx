import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import App from './App';
import { MicroAppManifest } from '@shared/types';
import { createLogger } from '@shared/logic';
import { LoggerProvider } from './providers/LoggerProvider';

if (import.meta.env.DEV) {
  import('./index.css');
}

const logger = createLogger('task-manager');

let root: Root | null = null;

export const manifest: MicroAppManifest = {
  name: 'task-manager',
  version: '1.0.0',
  framework: 'react',
  exposedEvents: ['TASK_CREATED', 'TASK_DELETED'],
  acceptedActions: ['SET_THEME', 'REFRESH_TASKS'],
  mount: (el, props) => { },
  unmount: () => { }
};

export const mount = (container: HTMLElement, props: any) => {
  logger.info('Lifecycle', 'App mounted');
  root = createRoot(container);
  root.render(
    <React.StrictMode>
      <LoggerProvider logger={props.logger || logger}>
        <App {...props} />
      </LoggerProvider>
    </React.StrictMode>
  );
};

export const unmount = () => {
  logger.info('Lifecycle', 'App unmounted');
  if (root) {
    root.unmount();
    root = null;
  }
};

if (import.meta.env.DEV && document.getElementById('root')) {
  const mockProps = {
    standalone: true,
    user: { id: 'dev-1', name: 'Developer', role: 'admin' },
    theme: 'light',
    logger,
    subscribe: () => {
      logger.info('Event', '[Dev Mode] Subscribed to events');
      return () => logger.info('Event', '[Dev Mode] Unsubscribed');
    },
    onEvent: (event: any) => {
      logger.info('Event', '[Dev Mode] Event emitted:', event);
    }
  };

  mount(document.getElementById('root')!, mockProps);
}