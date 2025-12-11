import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

// import { authInterceptor } from './app/interceptors/auth.interceptor';

// provideHttpClient(
  // withInterceptors([authInterceptor])
// ),


bootstrapApplication(App, {
  providers: [
    provideHttpClient(),
    ...appConfig.providers,
  ]
})
.catch(err => console.error(err));
