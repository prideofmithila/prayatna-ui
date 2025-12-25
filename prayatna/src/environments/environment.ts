// Local development environment
export const environment = {
  production: false,
  apiBaseUrl: 'https://localhost:7147',
  authConfig: {
    issuer: 'https://accounts.google.com',
    clientId: '15011162966-3i4v2jjdg1enmaltljltfkl0jj8hkk1n.apps.googleusercontent.com',
    redirectUri: 'http://localhost:4200',
    tokenEndpoint: 'https://localhost:7147/api/Auth/token',
    responseType: 'code',
    scope: 'profile email',  // Removed 'openid' to prevent OIDC userinfo calls
    strictDiscoveryDocumentValidation: false,
    showDebugInformation: true,
    usePkce: true,
    skipIssuerCheck: true,
    requireHttps: false,
    oidc: false,  // Disable OIDC validation including userinfo endpoint calls
    skipSubjectCheck: true
  }
};
