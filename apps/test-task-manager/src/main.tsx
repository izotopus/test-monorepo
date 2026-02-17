import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import App from './App';
import { MicroAppManifest } from '@shared/types';

if (import.meta.env.DEV) {
  import('./index.css');
}

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
  root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App {...props} />
    </React.StrictMode>
  );
};

export const unmount = () => {
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
    logger: console,
    subscribe: () => {
      console.log('[Dev Mode] Subscribed to events');
      return () => console.log('[Dev Mode] Unsubscribed');
    },
    onEvent: (event: any) => {
      console.log('[Dev Mode] Event emitted:', event);
    }
  };

  mount(document.getElementById('root')!, mockProps);
}