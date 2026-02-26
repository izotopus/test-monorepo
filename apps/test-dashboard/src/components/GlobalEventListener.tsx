import { useEffect } from 'preact/hooks';
import { subscribeToGlobalEvents } from '@shared/logic';
import { createLogger } from '@shared/logic';

export const GlobalEventListener = () => {
  const eventLogger = createLogger('event-bus');

  useEffect(() => {
    const unsubscribe = subscribeToGlobalEvents(
      (event) => {
        const { type, payload, source } = event;

        if (type === 'tasks:created') {

          eventLogger.debug('Event', `[GlobalHandler] MF ${source} stworzył zadanie: ${payload.title}`);
          alert(`Nowe zadanie od ${source}: ${payload.title}`);

        } else if (type === 'tasks:deleted') {

          eventLogger.debug('Event', `[GlobalHandler] MF ${source} usunął zadanie o id: ${payload.id}`);
          alert(`Usunięcie zadania od ${source}: ${payload.id}`);

        }

      },
      { type: /^tasks:/ }
      // { type: /^tasks:created/ }
    );

    return unsubscribe;
  }, []);
  
  return null;
};