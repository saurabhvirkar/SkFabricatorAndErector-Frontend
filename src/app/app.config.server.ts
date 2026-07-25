import { mergeApplicationConfig, ApplicationConfig, ENVIRONMENT_INITIALIZER, PLATFORM_ID } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { APP_BASE_HREF, isPlatformBrowser } from '@angular/common';
import { environment } from '../environments/environment';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    { provide: APP_BASE_HREF, useValue: '/' },
    {
      provide: ENVIRONMENT_INITIALIZER,
      useFactory: (platformId: object) => {
        return () => {
          if (isPlatformBrowser(platformId)) {
            environment.apiUrl = 'https://sk-fabricator-api.onrender.com/api';
          } else {
            environment.apiUrl = '';
          }
        };
      },
      deps: [PLATFORM_ID],
      multi: true,
    },
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
