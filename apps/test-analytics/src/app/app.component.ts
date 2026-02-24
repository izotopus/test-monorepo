import { Component, ViewEncapsulation, Inject, OnInit, Optional } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterOutlet],
  template: `
    <h2 class="bg-slate-500 p-20 text-5xl font-black uppercase text-white">
      TEST TAILWINDA w angular 19
    </h2>
    <div [class.dark]="theme === 'dark'" style="padding: 20px; border: 1px solid #ccc;">
      <h2 class="mb-16 text-xl font-bold">Angular Analytics Module</h2>
      <p>Current Theme: <strong>{{ theme }}</strong></p>
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent implements OnInit {
  theme: string = 'light';

  constructor(@Optional() @Inject('MICRO_PROPS') private props: any) {}

  ngOnInit() {
    if (this.props) {
      this.theme = this.props.theme || 'light';
      // this.props.logger?.info('Analytics', 'Component initialized with theme: ' + this.theme);

      this.props.subscribe?.((event: any) => {
        if (event.type === 'SET_THEME') {
          this.theme = event.payload;
        }
      });
    }
  }
}