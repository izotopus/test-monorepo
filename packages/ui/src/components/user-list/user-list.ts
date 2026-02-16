import { html, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { AstroLitElement } from '@shared/ui/base/AstroLitElement';
import { queryClient, getUsersQueryOptions } from '@shared/logic';
import { QueryObserver } from '@tanstack/query-core';

import baseStyles from '@shared/ui/styles/tailwind-base.css?inline';
import styles from './user-list.css?inline';

@customElement('user-list')
export class UserList extends AstroLitElement {
  protected static alpineObservedProps = ['_result'];

  @state() private _result: any = { isIdle: true, data: [] };
  private _observer!: QueryObserver;

  static styles = [
    unsafeCSS(baseStyles),
    unsafeCSS(styles),
  ]

  connectedCallback() {
    super.connectedCallback();
    
    this._observer = new QueryObserver(queryClient, {
      ...getUsersQueryOptions(),
      enabled: false,
    });

    this._observer.subscribe(result => {
      this._result = result;
    });
  }

  fetchUsers() {
    this._observer.refetch();
  }

  render() {
    const { data } = this._result;

    return html`
      <div x-data="{ 
        loaded: false, 
        get host() { return $el.getRootNode().host } 
      }">
        
        <div x-show="!loaded">
          <button
            class="px-6 py-3 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 transition-all shadow-sm active:scale-95"
            @click="host.fetchUsers(); loaded = true"
          >
            Wczytaj listę magią Alpine
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6" x-show="loaded">
          ${data?.map((user: any, index: number) => html`
            <div 
              :class="loaded ? 'animate-fade-in-up' : ''"
              style="animation-delay: ${index * 75}ms"
              class="p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-default opacity-0 translate-y-5 scale-95"
            >
              <div class="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold mb-3">${user.name.charAt(0)}</div>
              <h3 class="font-bold text-gray-800 truncate">${user.name}</h3>
              <p class="text-sm text-gray-500">${user.email}</p>
            </div>
          `)}
        </div>
      </div>
    `
  }
}