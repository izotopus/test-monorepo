import { z } from 'zod';
import { TaskManagerEvents } from './task-manager';
import { AnalyticsEvents } from './analytics';

export const EventSchema = {
  ...TaskManagerEvents,
  ...AnalyticsEvents,
  'ui:theme-change': z.enum(['light', 'dark']),
  'nav:go-to': z.object({ path: z.string() })
} as const;

export type EventRegistry = typeof EventSchema;
export type EventType = keyof EventRegistry;

export type EventPayload<T extends EventType> = z.infer<EventRegistry[T]>;

export interface GlobalEvent<T = any> {
  type: EventType;
  payload: T;
  source: string;
  timestamp: number;
}
