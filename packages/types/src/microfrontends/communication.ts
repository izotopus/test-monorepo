import { BaseMicroAppProps } from '@shared/types';

export interface TM_MicroAppProps extends BaseMicroAppProps {
  logger?: any;
  user: { 
    id: string; 
    name: string;
    role: string;
  };
  theme: 'light' | 'dark';
}