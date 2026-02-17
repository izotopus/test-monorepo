import { GenericMfEvent, MicroAppManifest, TM_MicroAppProps } from '@shared/types';
import { logger } from '@shared/logic';

// Globalna szyna zdarzeń (prosty Pub/Sub wewnątrz Dashboardu)
const globalListeners = new Set<(event: GenericMfEvent) => void>();

export const emitGlobalEvent = (event: GenericMfEvent) => {
  globalListeners.forEach(listener => listener(event));
};

export const createCommunicationBridge = (
  manifest: MicroAppManifest,
  currentUser: { id: string; name: string; role: string },
  currentTheme: 'light' | 'dark',
): TM_MicroAppProps => {
  
  return {
    user: currentUser,
    theme: currentTheme,
    logger,

    onEvent: (event) => {
      if (!manifest.exposedEvents.includes(event.type)) {
        logger.warn(`[Bridge] MF ${manifest.name} wysłał nieudokumentowany event: ${event.type}`);
      }

      emitGlobalEvent({
        ...event,
        source: manifest.name
      });
    },

    subscribe: (callback) => {
      globalListeners.add(callback);
      return () => globalListeners.delete(callback);
    }
  };
};

export const subscribeToGlobalEvents = (callback: (event: GenericMfEvent) => void) => {
  globalListeners.add(callback);
  return () => globalListeners.delete(callback);
};