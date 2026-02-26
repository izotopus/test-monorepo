import { type GlobalEvent, type EventType, type EventPayload, EventSchema } from '@shared/types';
import { canAppEmit } from '@shared/logic'

const EVENT_KEY = 'global-bus-message';

export const emitGlobal = <T extends EventType>(
  source: string,
  type: T,
  payload: EventPayload<T>
) => {
  if (!canAppEmit(source, type)) {
    console.error(`[Security Violation] MF "${source}" próbuje wysłać niezadeklarowany event: ${type}`);
    return;
  }

  const validation = EventSchema[type].safeParse(payload);
  if (!validation.success) {
    console.error(`[EventBus] Invalid payload for ${type}`, validation.error);
    return;
  }

  const event = new CustomEvent(EVENT_KEY, {
    detail: { type, payload, source, timestamp: Date.now() },
    bubbles: true,
    composed: true,
  });
  window.dispatchEvent(event);
};

export function subscribeToGlobalEvents<T extends EventType>(
  callback: (event: GlobalEvent<EventPayload<T>>) => void,
  filter: { type: T; source?: string }
): () => void;

export function subscribeToGlobalEvents(
  callback: (event: GlobalEvent) => void,
  filter?: { type?: RegExp; source?: string }
): () => void;

export function subscribeToGlobalEvents(
  callback: (event: GlobalEvent) => void,
  filter?: { type?: EventType | RegExp; source?: string }
) {
  const handler = (e: Event) => {
    const event = (e as CustomEvent).detail as GlobalEvent;
    
    if (filter?.type) {
      if (filter.type instanceof RegExp) {
        if (!filter.type.test(event.type)) return;
      } else {
        if (event.type !== filter.type) return;
      }
    }
    
    if (filter?.source && event.source !== filter.source) return;

    callback(event);
  };

  window.addEventListener(EVENT_KEY, handler);
  return () => window.removeEventListener(EVENT_KEY, handler);
}