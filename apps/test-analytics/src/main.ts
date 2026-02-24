import { createApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { ApplicationRef } from '@angular/core';
import { MicroAppManifest } from '@shared/types';
import { createLogger } from '@shared/logic';

/* if ((import.meta as any).env.DEV) {
  import('./styles.css');
} */

let appInstance: ApplicationRef | null = null;

const logger = createLogger('analytics');

const mount = async (container: HTMLElement, props: any) => {
  container.innerHTML = '<app-root></app-root>';

  try {
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
  exposedEvents: ['ANALYTICS_LOADED'],
  acceptedActions: ['SET_THEME'],
  mount,
  unmount,
};

const rootElement = document.getElementById('root');
if ((import.meta as any).env?.DEV && rootElement) {
  
  const mockProps = {
    standalone: true,
    user: { id: 'dev-1', name: 'Angular Dev', role: 'admin' },
    theme: 'light',
    subscribe: (callback: any) => {
      // logger.info?.('Event', '[Dev Mode] Subscribed to events');
      // setTimeout(() => {
      //   logger.info?.('Event', '[Dev Mode] Simulating Theme Change to Dark');
      //   callback({ type: 'SET_THEME', payload: 'dark' });
      // }, 5000);
      
      // return () => logger.info?.('Event', '[Dev Mode] Unsubscribed');
    },
    onEvent: (event: any) => {
      logger.info?.('Event', '[Dev Mode] Event emitted:', event);
    }
  };

  mount(rootElement, mockProps).catch(err => {
    console.error('Failed to mount Angular Analytics in Dev Mode', err);
  });
}