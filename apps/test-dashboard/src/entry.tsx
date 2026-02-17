import { h, render } from 'preact';
import { App } from './App';

if (import.meta.env.DEV) {
  import('./index.css');
}

export const mount = (container: HTMLElement) => {
  render(<App />, container);
};

const root = document.getElementById('app')
if (typeof window !== 'undefined' && !!root) {
  mount(root);
}