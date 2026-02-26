import { Component, ViewEncapsulation,inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GlobalEventsService } from './services/global-events.service' 
import { MICRO_PROPS } from '../main' 

@Component({
  selector: 'app-root',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterOutlet],
  template: `
    <h2 class="bg-slate-500 p-4 text-2xl font-black uppercase text-white">
      TEST TAILWINDA w angular 19
    </h2>
    
    <div [class.dark]="theme() === 'dark'" 
        class="p-4 border border-slate-300 transition-colors duration-300
                dark:bg-slate-900 dark:border-slate-700 dark:text-white">
      
      <h2 class="mb-8 text-xl font-bold dark:text-blue-400">
        Angular Analytics Module
      </h2>
      
      <p class="mb-4 text-slate-600 dark:text-slate-400">
        Aktualny motyw: <strong class="text-black dark:text-white">{{ theme() }}</strong>
      </p>
      
      <p class="mb-0 text-slate-600 dark:text-slate-400">
        Propsy z test-dashboard: 
      </p>
      <pre class="mb-4 text-xs text-indigo-600 dark:text-indigo-200 font-mono">{{ user | json }}</pre>

      <p class="mb-4">
        <button (click)="testEmit()" class="p-2 bg-blue-500 text-white rounded cursor-pointer">
          Navigate to demo page
        </button>
      </p>

      <div class="p-4 rounded bg-slate-100 dark:bg-slate-800">
        <router-outlet></router-outlet>
      </div>
    </div>`,
})
export class AppComponent {
  private eventsService = inject(GlobalEventsService);
  private props = inject<any>(MICRO_PROPS, { optional: true });

  protected theme = this.eventsService.useEventSignal(
    'ui:theme-change',
    this.props?.theme || 'light'
  );
  
  protected user = this.props?.user || {};

  testEmit() {
    this.eventsService.emitAnalyticsEvent('nav:go-to', { path: '/demo' });
  }
}
