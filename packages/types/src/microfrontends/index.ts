import { type EventType } from '@shared/types';
export interface MicroAppManifest {
  name: string;
  version: string;
  framework: 'react' | 'preact' | 'angular' | 'vanilla';
  events: {
    emits: EventType[],
    listens: EventType[]
  }
  mount: (container: HTMLElement, props: any) => void;
  unmount: () => void;
}

export interface GenericMfEvent {
  type: string;
  payload?: any;
  source: string;
}

export interface BaseMicroAppProps {
  standalone?: boolean;
}

export interface MicroAppModule {
  manifest?: MicroAppManifest;
  [key: string]: any;
}

export interface MicroAppState {
  app: MicroAppModule | null;
  manifest: MicroAppManifest | null;
  loading: boolean;
  error: Error | null;
}
