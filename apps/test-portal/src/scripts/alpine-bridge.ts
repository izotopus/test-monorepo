import { isAppBusy, isLoading, registrationPreview, updateRegistrationPreview } from '@shared/logic/signals';
import { effect, type ReadonlySignal, type Signal } from "@preact/signals-core";
import type { Alpine } from 'alpinejs';

export function bindSignal<T>(alpineObj: any, key: string, signal: Signal<T> | ReadonlySignal<T>) {
  effect(() => {
    alpineObj[key] = signal.value;
  });
}

export function initAlpineBridge() {
  const Alpine = (window as any).Alpine as Alpine;
  if (!Alpine || Alpine.store('app')) return;

  // store
  Alpine.store('app', {
    busy: isAppBusy.value,
    registrationPreview: {},
    init() {
      bindSignal(this, 'busy', isAppBusy);
    },
    actions: {
      updatePreview(data: any) {
        updateRegistrationPreview(data);
      },
      getVisibleSlugs(searchTerm: string, items: any[]) {
        const term = searchTerm.toLowerCase().trim();
        if (!term) return items.map(i => i.slug);
        
        return items
          .filter(i => 
            i.name.toLowerCase().includes(term) || 
            i.desc.toLowerCase().includes(term)
          )
          .map(i => i.slug);
      }
      // toggleMenu() { ... },
      // logOut() { ... }
    },
  });

  // data
  Alpine.data('loaderExample', () => ({
    isLoading: isLoading.value,
    init() {
      bindSignal(this, 'isLoading', isLoading);
    },
  }));

  bindSignal(Alpine.store('app'), 'registrationPreview', registrationPreview);
}