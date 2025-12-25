// Production environment (GitHub Pages)
export const environment = {
  production: true,
  apiBaseUrl: 'https://prateekkarna-001-site1.qtempurl.com',
  authConfig: {
    issuer: 'https://accounts.google.com',
    clientId: '15011162966-3i4v2jjdg1enmaltljltfkl0jj8hkk1n.apps.googleusercontent.com',
    redirectUri: 'https://prideofmithila.github.io/prayatna-ui/',
    tokenEndpoint: 'https://prateekkarna-001-site1.qtempurl.com/api/Auth/token',
    responseType: 'code',
    scope: 'profile email',  // Removed 'openid' to prevent OIDC userinfo calls
    strictDiscoveryDocumentValidation: false,
    showDebugInformation: false,
    usePkce: true,
    skipIssuerCheck: true,
    oidc: false,  // Disable OIDC validation including userinfo endpoint calls
    skipSubjectCheck: true
  }
};
