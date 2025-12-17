import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import { routes } from '../app.routes';
import { provideTanStackQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { BASE_PATH } from '../api/generated';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: BASE_PATH,
      useValue: '',
    },
    provideTanStackQuery(new QueryClient()),
  ],
};
