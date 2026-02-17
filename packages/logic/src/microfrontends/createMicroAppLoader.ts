import { signal, effect } from "@preact/signals-core";
import type { MicroAppManifest } from '@shared/types';
import { MFConfig } from '@shared/logic';

const ensureReactPreamble = (url: string): Promise<void> => {
  if (!(url.includes('.tsx') || url.includes('.ts')) || (window as any).__vite_plugin_react_preamble_installed__) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const origin = new URL(url).origin;
    const script = document.createElement('script');
    script.type = 'module';
    script.innerHTML = `
      import RefreshRuntime from "${origin}/@react-refresh"
      RefreshRuntime.injectIntoGlobalHook(window)
      window.$RefreshReg$ = () => {}
      window.$RefreshSig$ = () => (type) => type
      window.__vite_plugin_react_preamble_installed__ = true
    `;
    script.onload = () => resolve();
    document.head.appendChild(script);
    setTimeout(resolve, 50);
  });
};

export const createMicroAppLoader = (config: MFConfig, onStateChange: (state: any) => void) => {
  const { url, type } = config;

  const app = signal<any>(null);
  const loading = signal(true);
  const error = signal<Error | null>(null);

  const disposer = effect(() => {
    onStateChange({
      app: app.value,
      manifest: app.value?.manifest || (app.value as unknown as MicroAppManifest) || null,
      loading: loading.value,
      error: error.value
    });
  });

  const load = async () => {
    try {
      if (type === 'react') await ensureReactPreamble(url);
      const module = await import(/* @vite-ignore */ url);
      app.value = module;
      loading.value = false;
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Import failed');
      loading.value = false;
    }
  };

  load();

  return {
    destroy: () => {
      disposer();
      if (app.value?.unmount) app.value.unmount();
    }
  };
};
