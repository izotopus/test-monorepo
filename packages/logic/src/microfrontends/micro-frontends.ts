export type MFType = 'react' | 'angular' | 'vanilla';

export interface MFConfig {
  url: string;
  type: MFType;
  name: string;
}

import { MF_CONFIG as DEV_CONFIG } from './generated-config.dev';
import { MF_CONFIG as PROD_CONFIG } from './generated-config.prod';

export const MF_CONFIG = (import.meta as any).env.DEV ? DEV_CONFIG : PROD_CONFIG;

export type MFKey = keyof typeof MF_CONFIG;

export const getMFConfig = (key: MFKey) => {
  return MF_CONFIG[key];
};