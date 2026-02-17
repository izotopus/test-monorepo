import { useEffect } from 'preact/hooks';
import { subscribeToGlobalEvents } from '@shared/logic';
import { logger } from '@shared/logic';

export const GlobalEventListener = () => {
  useEffect(() => {
    const unsubscribe = subscribeToGlobalEvents((event) => {
      const { type, payload, source } = event;

      switch (type) {
        case 'TASK_CREATED':
          logger.log(`[GlobalHandler] MF ${source} stworzył zadanie: ${payload.title}`);
          
          alert(`Nowe zadanie od ${source}: ${payload.title}`);
          break;

        case 'NAVIGATE':
          logger.log(`[GlobalHandler] Prośba o nawigację do: ${payload.path}`);
          
          break;

        default:
          logger.log(`[GlobalHandler] Otrzymano nieobsłużony event ${type} od ${source}`);
      }
    });

    return unsubscribe;
  }, []);

  return null;
};