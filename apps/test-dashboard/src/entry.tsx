import { h, render } from 'preact';
import { App } from './App';
import { createLogger } from '@shared/logic';
import { LoggerProvider } from './providers/LoggerProvider';

if (import.meta.env.DEV) {
  import('./index.css');
}

const logger = createLogger('dashboard');
logger.info('Lifecycle', 'App mounted');

export const mount = (container: HTMLElement) => {
  render(<LoggerProvider logger={logger}>
    <App />
  </LoggerProvider>, container);
};

const root = document.getElementById('app')
if (typeof window !== 'undefined' && !!root) {
  mount(root);
}