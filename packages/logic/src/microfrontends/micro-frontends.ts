export type MFType = 'react' | 'angular' | 'vanilla';

export interface MFConfig {
  url: string;
  type: MFType;
  name: string;
}

import { MF_CONFIG, MFKey } from './generated-config';

export const getMFConfig = (key: MFKey) => {
  return MF_CONFIG[key];
};