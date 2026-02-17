export type MFType = 'react' | 'angular' | 'vanilla';

export interface MFConfig {
  url: string;
  type: MFType;
  name: string;
}

const MF_SETTINGS = {
  TASK_MANAGER: {
    dev: 'http://localhost:3002/src/main.tsx',
    prod: '/modules/task-manager/main.js',
    type: 'react' as MFType,
    forceUrl: null // Tu możesz wpisać stringa, żeby wymusić konkretny URL
  },
  ANALYTICS: {
    dev: 'http://localhost:3003/src/main.tsx',
    prod: '/modules/analytics/main.js',
    type: 'angular' as MFType,
    forceUrl: null
  }
} as const;

export const getMFConfig = (name: keyof typeof MF_SETTINGS) => {
  const settings = MF_SETTINGS[name];
  const isDev = (import.meta as any).env?.DEV;

  const baseUrl = ((import.meta as any).env?.BASE_URL || '/') as string;

  let prodPath: string = settings.prod;
  if (baseUrl !== '/' && prodPath.startsWith('/')) {
    prodPath = `${baseUrl.replace(/\/$/, '')}${prodPath}`;
  }

  return {
    url: settings.forceUrl || (isDev ? settings.dev : prodPath),
    type: settings.type,
    name: name
  };
};
