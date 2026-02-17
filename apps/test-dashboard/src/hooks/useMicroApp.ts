import { useState, useEffect } from 'preact/hooks';
import { createMicroAppLoader } from '@shared/logic';
import type { MicroAppState } from '@shared/types';

export const useMicroApp = (config: any) => {
  const [state, setState] = useState<MicroAppState>({
    app: null,
    manifest: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const loader = createMicroAppLoader(config, (newState) => {
      setState(newState);
    });

    return () => loader.destroy();
  }, [config.url]);

  return state;
};