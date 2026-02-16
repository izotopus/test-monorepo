import { initAlpineBridge } from './alpine-bridge';

export function bootstrap() {
  initAlpineBridge();

  document.addEventListener('astro:page-load', () => {
    initAlpineBridge();
  });

  document.addEventListener('alpine:init', initAlpineBridge);
}