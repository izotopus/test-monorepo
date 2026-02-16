import { signal } from '@preact/signals-core';

export const currentLang = signal('pl');

export class I18nManager {
  private static instance: I18nManager;
  private translations = new Map<string, any>();

  private constructor() {}

  static getInstance() {
    if (!I18nManager.instance) {
      I18nManager.instance = new I18nManager();
    }
    return I18nManager.instance;
  }

  register(namespace: string, data: Record<string, any>) {
    this.translations.set(namespace, data);
  }

  t(path: string, fallback?: string): string {
    const [ns, ...keys] = path.split('.');
    const bundle = this.translations.get(ns)?.[currentLang.value];
    
    if (!bundle) return fallback || path;

    const result = keys.reduce((obj, key) => obj?.[key], bundle);
    return result || fallback || path;
  }
}

export const i18n = I18nManager.getInstance();