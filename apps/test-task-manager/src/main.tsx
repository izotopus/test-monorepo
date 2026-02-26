import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import App from './App';
import { type MicroAppManifest, type EventType, type EventPayload } from '@shared/types';
import { registerMicroApp, emitGlobal, createLogger } from '@shared/logic';
import { LoggerProvider } from './providers/LoggerProvider';

if (import.meta.env.DEV) {
  import('./index.css');
}

const logger = createLogger('task-manager');

let root: Root | null = null;

const mount = (container: HTMLElement, props: any) => {
  logger.info('Lifecycle', 'App mounted');
  registerMicroApp(manifest);
  root = createRoot(container);
  root.render(
    <React.StrictMode>
      <LoggerProvider logger={props.logger || logger}>
        <App {...props} />
      </LoggerProvider>
    </React.StrictMode>
  );
};

const unmount = () => {
  logger.info('Lifecycle', 'App unmounted');
  if (root) {
    root.unmount();
    root = null;
  }
};

export const manifest: MicroAppManifest = {
  name: 'task-manager',
  version: '1.0.0',
  framework: 'react',
  events: {
    emits: ['tasks:created', 'tasks:deleted'] as EventType[],
    listens: ['ui:theme-change'] as EventType[]
  },
  mount,
  unmount,
};

if (import.meta.env.DEV && document.getElementById('root')) {
  const mockProps = {
    standalone: true,
    user: { id: 'dev-1', name: 'Developer', role: 'admin' },
    theme: 'dark',
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