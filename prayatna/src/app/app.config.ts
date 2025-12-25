import { ApplicationConfig, provideBrowserGlobalErrorListeners, APP_INITIALIZER } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { OAuthModule, OAuthService, AuthConfig } from 'angular-oauth2-oidc';

import { routes } from './app.routes';
import { environment } from '../environments/environment';

export function initializeAuth(oauthService: OAuthService, router: Router) {
  return () => {
    oauthService.configure(environment.authConfig);
    return oauthService.loadDiscoveryDocument().then(() => {
      // Override tokenEndpoint to use backend proxy instead of Google's token endpoint
      oauthService.tokenEndpoint = environment.authConfig.tokenEndpoint;
      // Disable automatic userinfo loading
      oauthService.setupAutomaticSilentRefresh();
      return oauthService.tryLogin({
        // Disable userinfo endpoint call during login
        disableOAuth2StateCheck: false,
        preventClearHashAfterLogin: false,
        onTokenReceived: () => {
          // Token received, skip userinfo call
        }
      }).then(() => {
        const hasToken = oauthService.hasValidAccessToken();
        if (hasToken) {
          try {
            const returnUrl = sessionStorage.getItem('returnUrl');
            if (returnUrl) {
              sessionStorage.removeItem('returnUrl');
              router.navigateByUrl(returnUrl);
            }
          } catch {}
        }
      });
    });
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    ...(OAuthModule.forRoot().providers || []),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      deps: [OAuthService, Router],
      multi: true,
    }
  ]
};
