import { ApplicationConfig, provideZoneChangeDetection, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app.routes';
import { APP_BASE_HREF } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(), 
    // provideZoneChangeDetection({ eventCoalescing: true }), 
    // provideRouter(routes, withHashLocation()),
    provideRouter(routes),
    { provide: APP_BASE_HREF, useValue: '/dashboard/' }
  ]
};