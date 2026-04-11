import { ApplicationConfig } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import { authTokenInterceptor } from './services/user-service/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [ 
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
      }),
    ), provideHttpClient(withInterceptors([authTokenInterceptor]))]
};
