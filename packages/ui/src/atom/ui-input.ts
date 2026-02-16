import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('ui-input')
export class UiInput extends LitElement {
  @property({ type: String }) type = 'text';
  @property({ type: String }) label = '';
  @property({ type: String }) value = '';
  @property({ type: String }) name = '';
  @property({ type: String }) placeholder = '';
  @property({ type: Boolean }) error = false;

  static styles = css`
    :host { display: block; }
    input { 
      width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;
      box-sizing: border-box;
      transition: border-color 0.2s;
      outline: none;
    }
    input.has-error { border-color: #ef4444; background: #fffafb; }
    label { display: block; font-size: 0.8rem; margin-bottom: 4px; font-weight: bold; }
  `;

  render() {
    return html`
      <label>${this.label}</label>
      <input 
        class="${this.error ? 'has-error' : ''}"
        .value="${this.value}" 
        placeholder="${this.placeholder}"
        name="${this.name}"
        type="${this.type}"
        @input="${(e: any) => { this.value = e.target.value; this.dispatchEvent(new CustomEvent('ui-change', { detail: this.value })); }}"
      />
    `;
  }
}