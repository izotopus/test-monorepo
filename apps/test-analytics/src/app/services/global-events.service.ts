import { Injectable, signal, DestroyRef, inject } from '@angular/core';
import { subscribeToGlobalEvents, emitGlobal } from '@shared/logic';
import { type EventType, type EventPayload } from '@shared/types';
import { manifest } from '../../main';

@Injectable({ providedIn: 'root' })
export class GlobalEventsService {
  private destroyRef = inject(DestroyRef);

  useEventSignal<T extends EventType>(type: T, initialValue: EventPayload<T>) {
    const eventData = signal<EventPayload<T>>(initialValue);

    const unsubscribe = subscribeToGlobalEvents((event) => {
      eventData.set(event.payload as EventPayload<T>);
    }, { type });

    this.destroyRef.onDestroy(() => unsubscribe());
    return eventData;
  }

  emitAnalyticsEvent<T extends EventType>(
    type: T,
    payload: EventPayload<T>
  ) {
    emitGlobal(manifest.name, type, payload);
  };
}