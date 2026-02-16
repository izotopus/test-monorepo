import './index.css';
import { h, render } from 'preact';
import { App } from './App';

export const mount = (container: HTMLElement) => {
  render(<App />, container);
};

const root = document.getElementById('app')
if (typeof window !== 'undefined' && !!root) {
  mount(root);
}