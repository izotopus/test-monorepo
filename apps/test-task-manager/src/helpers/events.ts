
import { useEffect } from 'react';
import { manifest } from '../main';

import { type GlobalEvent, type EventType, type EventPayload } from '@shared/types';
import { emitGlobal, subscribeToGlobalEvents } from '@shared/logic';

export const emitTaskEvent = <T extends EventType>(
  type: T, 
  payload: EventPayload<T>
) => {
  emitGlobal(manifest.name, type, payload);
};

export const useGlobalEvent = <T extends EventType>(
  type: T,
  callback: (payload: EventPayload<T>, fullEvent: GlobalEvent<EventPayload<T>>) => void
) => {
  useEffect(() => {
    const unsubscribe = subscribeToGlobalEvents(
      (event) => {
        callback(event.payload, event);
      },
      { type }
    );

    return unsubscribe;
  }, [type, callback]);
}