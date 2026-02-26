import { Component, ViewEncapsulation, Inject, OnInit, Optional, inject, DestroyRef, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { subscribeToGlobalEvents } from '@shared/logic';
import { type GlobalEvent } from '@shared/types' 

@Component({
  selector: 'app-root',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterOutlet],
  template: `
    <h2 class="bg-slate-500 p-4 text-2xl font-black uppercase text-white">
      TEST TAILWINDA w angular 19
    </h2>
    
    <div [class.dark]="theme === 'dark'" 
        class="p-4 border border-slate-300 transition-colors duration-300
                dark:bg-slate-900 dark:border-slate-700 dark:text-white">
      
      <h2 class="mb-8 text-xl font-bold dark:text-blue-400">
        Angular Analytics Module
      </h2>
      
      <p class="mb-4 text-slate-600 dark:text-slate-400">
        Aktualny motyw: <strong class="text-black dark:text-white">{{ theme }}</strong>
      </p>
      
      <p class="mb-0 text-slate-600 dark:text-slate-400">
        Propsy z test-dashboard: 
      </p>
      <pre class="mb-4 text-xs text-indigo-600 dark:text-indigo-200 font-mono">{{ user | json }}</pre>

      <div class="p-4 rounded bg-slate-100 dark:bg-slate-800">
        <router-outlet></router-outlet>
      </div>
    </div>`,
})
export class AppComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  theme: string = 'light';
  user: any = {};

  constructor(@Optional() @Inject('MICRO_PROPS') private props: any) {}

  ngOnInit() {
    if (this.props) {
      this.theme = this.props.theme || 'light';
      this.user = this.props.user || {};
    }

    const unsubscribe = subscribeToGlobalEvents(
      (event: GlobalEvent<string>) => {
        this.theme = event.payload;
        this.cdr.detectChanges();
      },
      { type: 'ui:theme-change' } 
    );

    this.destroyRef.onDestroy(() => unsubscribe());
  }
}