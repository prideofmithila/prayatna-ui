import { ApplicationConfig, provideBrowserGlobalErrorListeners, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { OAuthModule, OAuthService, AuthConfig } from 'angular-oauth2-oidc';

import { routes } from './app.routes';
import { environment } from '../environments/environment';

export function initializeAuth(oauthService: OAuthService) {
  return () => {
    oauthService.configure(environment.authConfig);
    // Load discovery first, then override tokenEndpoint before attempting login so
    // the authorization code exchange posts to our backend proxy (not Google's endpoint)
    return oauthService.loadDiscoveryDocument().then(() => {
      oauthService.tokenEndpoint = environment.authConfig.tokenEndpoint;
      // automatic silent refresh uses refresh tokens if provider supports it
      oauthService.setupAutomaticSilentRefresh();
      // now attempt login (this will perform code exchange using the tokenEndpoint we set)
      return oauthService.tryLogin();
    });
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    ...(OAuthModule.forRoot().providers || []),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      deps: [OAuthService],
      multi: true,
    }
  ]
};
