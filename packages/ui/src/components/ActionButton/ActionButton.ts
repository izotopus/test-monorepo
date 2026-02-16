import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { toggleLoader, toggleIsLoading } from '@shared/logic/signals';

import baseStyles from '@shared/ui/styles/tailwind-base.css?inline';

@customElement('action-button')
export class ActionButton extends LitElement {
  @property({ type: String }) action = '';

  static styles = [unsafeCSS(baseStyles)];

  private _handleClick() {
    if (this.action === 'simulate-loading') {
      toggleLoader(true);
      setTimeout(() => toggleLoader(false), 4000);
    } else if (this.action === 'simulate-loading-2') {
      toggleIsLoading(true);
      setTimeout(() => toggleIsLoading(false), 4000);
    }
  }

  render() {
    return html`
      <button
        @click="${this._handleClick}"
        class="px-6 py-3 bg-orange-500 text-white font-bold rounded-lg shadow-md transition-all active:scale-95 cursor-pointer border-none hover:bg-orange-600 hover:shadow-lg"
      >
        <slot></slot>
      </button>
    `;
  }
}