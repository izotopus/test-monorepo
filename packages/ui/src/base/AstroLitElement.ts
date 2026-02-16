import { LitElement } from 'lit';

export class AstroLitElement extends LitElement {
  protected static alpineObservedProps: string[] = [];

  protected updated(changedProperties: Map<string, any>) {
    super.updated(changedProperties);

    const observed = (this.constructor as typeof AstroLitElement).alpineObservedProps;

    const shouldRefreshAlpine = observed.some(prop => changedProperties.has(prop));

    if (shouldRefreshAlpine) {
      this._refreshAlpine();
    }
  }

  private _refreshAlpine() {
    const Alpine = (window as any).Alpine;
    if (Alpine) {
      Alpine.initTree(this.renderRoot);
    }
  }

  async firstUpdated(changedProperties: Map<string, any>) {
    super.firstUpdated(changedProperties);
    this._setupAlpine();
  }

  private _setupAlpine() {
    const init = () => {
      const Alpine = (window as any).Alpine;
      if (Alpine && !((this.renderRoot as any)._x_dataStack)) {
        Alpine.initTree(this.renderRoot);
      }
    };

    if ((window as any).Alpine) {
      init();
    } else {
      window.addEventListener('alpine:init', init, { once: true });
    }
  }

  get alpineData() {
    const root = this.renderRoot.querySelector('[x-data]') as any;
    return root?._x_dataStack?.[0] || {};
  }
}