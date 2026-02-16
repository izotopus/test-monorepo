import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('field-error')
export class FieldError extends LitElement {
  @property({ type: String }) message = '';

  static styles = css`
    :host {
      display: block;
    }
    .wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .error-text {
      padding: 0;
      color: #ef4444;
      font-size: 0.75rem;
      min-height: 1.25rem;
      opacity: 0;
      transform: translateY(-5px);
      transition: all 0.2s ease-out;
    }
    .error-text.show {
      opacity: 1;
      transform: translateY(0);
    }
  `;

  render() {
    return html`
      <div class="wrapper">
        <slot></slot> 
        <div class="error-text ${this.message ? 'show' : ''}">
          ${this.message}
        </div>
      </div>
    `;
  }
}