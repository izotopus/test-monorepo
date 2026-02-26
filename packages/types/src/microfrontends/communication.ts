export const SYSTEM_SOURCES = [
  'theme-service',
  'auth-service',
  // ...
] as const;

export type SystemSource = typeof SYSTEM_SOURCES[number];