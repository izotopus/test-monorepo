import { z } from 'zod';

export const TaskManagerEvents = {
  'tasks:created': z.object({ id: z.number().optional(), title: z.string() }),
  'tasks:deleted': z.object({ id: z.number() }),
} as const;