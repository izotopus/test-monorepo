import { useEffect } from 'preact/hooks';
import { subscribeToGlobalEvents } from '@shared/logic';
import { createLogger } from '@shared/logic';

export const GlobalEventListener = () => {
  const eventLogger = createLogger('event-bus');

  useEffect(() => {
    const unsubscribe = subscribeToGlobalEvents((event) => {
      const { type, payload, source } = event;

      switch (type) {
        case 'TASK_CREATED':
          eventLogger.debug('Event', `[GlobalHandler] MF ${source} stworzył zadanie: ${payload.title}`);
          
          alert(`Nowe zadanie od ${source}: ${payload.title}`);
          break;

        case 'NAVIGATE':
          eventLogger.debug('Event', `[GlobalHandler] Prośba o nawigację do: ${payload.path}`);
          
          break;

        default:
          eventLogger.debug('Event', `[GlobalHandler] Otrzymano nieobsłużony event ${type} od ${source}`);
      }
    });

    return unsubscribe;
  }, []);

  return null;
};