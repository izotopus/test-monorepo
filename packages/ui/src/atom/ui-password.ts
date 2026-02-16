import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('ui-password')
export class UiPassword extends LitElement {
  @property({ type: String }) value = '';
  @property({ type: String }) name = '';
  @property({ type: Boolean }) error = false;
  @state() private strength = 0;

  private updateStrength(val: string) {
    let s = 0;
    if (val.length > 6) s++;
    if (/[A-Z]/.test(val)) s++;
    if (/[0-9]/.test(val)) s++;
    this.strength = s;
  }

  static styles = css`
    :host {
      display: block;
    }
    .meter { height: 4px; background: #eee; margin-top: 4px; border-radius: 2px; }
    .bar { height: 100%; transition: all 0.3s; border-radius: 2px; }
    .s-0 { width: 0%; }
    .s-1 { width: 33%; background: red; }
    .s-2 { width: 66%; background: orange; }
    .s-3 { width: 100%; background: green; }
  `;

  render() {
    return html`
      <ui-input 
        label="Hasło"
        type="password"
        name="${this.name}" 
        .value="${this.value}"
        .error="${this.error}"
        @ui-change="${(e: CustomEvent) => { 
          this.value = e.detail; 
          this.updateStrength(e.detail);
          this.dispatchEvent(new CustomEvent('ui-change', { detail: e.detail }));
        }}"
      />
      <div class="meter">
        <div class="bar s-${this.strength}"></div>
      </div>
    `;
  }
}