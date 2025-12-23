// Local development environment
export const environment = {
  production: false,
  authConfig: {
    issuer: 'https://accounts.google.com',
    clientId: '15011162966-3i4v2jjdg1enmaltljltfkl0jj8hkk1n.apps.googleusercontent.com',
    redirectUri: 'http://localhost:4200',
    tokenEndpoint: 'https://localhost:7147/api/Auth/token',
    responseType: 'code',
    scope: 'openid profile email',
    strictDiscoveryDocumentValidation: false,
    showDebugInformation: true,
    usePkce: true,
  }
};
