import { ApplicationConfig, provideBrowserGlobalErrorListeners, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { OAuthModule, OAuthService, AuthConfig } from 'angular-oauth2-oidc';

import { routes } from './app.routes';

const authConfig: any = {
  issuer: 'https://accounts.google.com',
  clientId: '15011162966-3i4v2jjdg1enmaltljltfkl0jj8hkk1n.apps.googleusercontent.com',
  redirectUri: window.location.origin ,
  responseType: 'code',
  scope: 'openid profile email',
  // proxy token exchange through backend to keep client_secret server-side
  tokenEndpoint: 'https://localhost:7147' + '/api/Auth/token',
  strictDiscoveryDocumentValidation: false,
  showDebugInformation: false,
  // enable PKCE (some versions of the library type don't expose usePkce in AuthConfig)
  usePkce: true,
};

export function initializeAuth(oauthService: OAuthService) {
  return () => {
    oauthService.configure(authConfig);
    // Load discovery first, then override tokenEndpoint before attempting login so
    // the authorization code exchange posts to our backend proxy (not Google's endpoint)
    return oauthService.loadDiscoveryDocument().then(() => {
      oauthService.tokenEndpoint = 'https://localhost:7147' + '/api/Auth/token';
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
