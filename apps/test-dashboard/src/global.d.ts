import 'preact';

declare module 'preact' {
  namespace JSX {
    interface IntrinsicElements {
      'register-form': HTMLAttributes<HTMLElement> & {
        class?: string;
        'onform-change'?: (e: CustomEvent) => void;
        'onform-submit'?: (e: CustomEvent) => void;
      };
    }
  }
}