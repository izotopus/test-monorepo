export interface MicroAppManifest {
  name: string;
  version: string;
  framework: 'react' | 'preact' | 'angular' | 'vanilla';
  exposedEvents: string[];
  acceptedActions: string[];
  mount: (container: HTMLElement, props: any) => void;
  unmount: () => void;
}

export interface BaseMicroAppProps {
  standalone?: boolean;
  onEvent: (event: Omit<GenericMfEvent, 'source'>) => void;
  subscribe: (callback: (event: GenericMfEvent) => void) => () => void;
}

export interface MicroAppModule {
  mount: (container: HTMLElement, props: BaseMicroAppProps) => void;
  unmount?: () => void;
  manifest?: MicroAppManifest;
  [key: string]: any;
}

export interface MicroAppState {
  app: MicroAppModule | null;
  manifest: MicroAppManifest | null;
  loading: boolean;
  error: Error | null;
}

export interface GenericMfEvent {
  type: string;
  payload?: any;
  source: string;
}
