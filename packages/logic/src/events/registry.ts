import { type MicroAppManifest, SYSTEM_SOURCES } from '@shared/types';

const manifestRegistry = new Map<string, MicroAppManifest>();

export const registerMicroApp = (manifest: MicroAppManifest) => {
  manifestRegistry.set(manifest.name, manifest);
};

export const canAppEmit = (appName: string, eventType: string): boolean => {
  if ((SYSTEM_SOURCES as readonly string[]).includes(appName)) {
    return true;
  }

  const manifest = manifestRegistry.get(appName);
  return manifest?.events.emits.includes(eventType as any) ?? false;
};