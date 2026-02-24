import { initAlpineBridge } from './alpine-bridge';
import { ThemeService } from '@shared/logic';

export function bootstrap() {
  ThemeService.init();
  initAlpineBridge();

  document.addEventListener('astro:page-load', () => {
    initAlpineBridge();
  });

  document.addEventListener('alpine:init', initAlpineBridge);
}