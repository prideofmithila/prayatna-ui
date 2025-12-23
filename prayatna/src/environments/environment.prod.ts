// Production environment (GitHub Pages)
export const environment = {
  production: true,
  authConfig: {
    issuer: 'https://accounts.google.com',
    clientId: '15011162966-3i4v2jjdg1enmaltljltfkl0jj8hkk1n.apps.googleusercontent.com',
    redirectUri: 'https://prideofmithila.github.io/prayatna-ui/',
    tokenEndpoint: 'https://prateekkarna-001-site1.qtempurl.com/api/Auth/token',
    responseType: 'code',
    scope: 'openid profile email',
    strictDiscoveryDocumentValidation: false,
    showDebugInformation: false,
    usePkce: true,
  }
};
