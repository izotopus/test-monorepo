import { createApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { ApplicationRef } from '@angular/core';
import { type MicroAppManifest, type EventType } from '@shared/types';
import { registerMicroApp, createLogger } from '@shared/logic';

/* if ((import.meta as any).env.DEV) {
  import('./styles.css');
} */

let appInstance: ApplicationRef | null = null;

const logger = createLogger('analytics');

const mount = async (container: HTMLElement, props: any) => {
  container.innerHTML = '<app-root></app-root>';

  try {
    registerMicroApp(manifest);
    const app = await createApplication({
      ...appConfig,
      providers: [
        ...(appConfig.providers || []),
        { provide: 'MICRO_PROPS', useValue: props }
      ]
    });

    app.bootstrap(AppComponent);
    
    appInstance = app; 

    logger.info('Lifecycle', 'Angular Analytics mounted');
  } catch (err) {
    logger.error('Lifecycle', 'Angular mount error:', err);
  }
};

const unmount = () => {
  if (appInstance) {
    logger.info('Lifecycle', 'Angular Analytics unmounted');
    appInstance.destroy();
    appInstance = null;
  }
}

export const manifest: MicroAppManifest = {
  name: 'analytics',
  version: '1.0.0',
  framework: 'angular',
  events: {
    emits: [] as EventType[],
    listens: ['ui:theme-change'] as EventType[]
  },
  mount,
  unmount,
};

const rootElement = document.getElementById('root');
if ((import.meta as any).env?.DEV && rootElement) {
  
  const mockProps = {
    standalone: true,
    user: { id: 'dev-1', name: 'Angular Dev', role: 'admin' },
    theme: 'light',
  };

  mount(rootElement, mockProps).catch(err => {
    console.error('Failed to mount Angular Analytics in Dev Mode', err);
  });
}