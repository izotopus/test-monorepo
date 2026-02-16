import 'preact';

declare module 'preact' {
  namespace JSX {
    interface IntrinsicElements {
      'register-form': HTMLAttributes<HTMLElement> & {
        // Atrybuty (stringi)
        class?: string;
        // Eventy (w Preact muszą zaczynać się od 'on')
        'onform-change'?: (e: CustomEvent) => void;
        'onform-submit'?: (e: CustomEvent) => void;
      };
    }
  }
}