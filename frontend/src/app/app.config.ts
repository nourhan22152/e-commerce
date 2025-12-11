import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { authInterceptor } from './auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),

    // ✔ Routing
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])   // ⭐ هنا بنضيف الانترسيبتور
    ),

    // ✔ Reactive + Template Forms
    importProvidersFrom(FormsModule, ReactiveFormsModule)
  ]

};
