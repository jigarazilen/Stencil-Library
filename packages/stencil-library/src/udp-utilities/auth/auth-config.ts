import { Configuration } from '@azure/msal-browser';

export const signInAuthority: string = '...';
export const tenantSubdomain: string = '...';
export const applicationID: string = '...';
export const reactRedirectUri: string = '...';
export const PUBLIC_URL: string = '...';

export const apiAccessScope: string = `https://${tenantSubdomain}.b2clogin.com/...`; // Define your apiAccessScope here

export const tokenRequest = { scopes: [apiAccessScope] };  // Token Request
export const loginRequest = { scopes: ['openid', 'offline_access'] }; // Login Request

export const signInConfig: Configuration = {
  auth: {
    authority: signInAuthority,
    knownAuthorities: [`${tenantSubdomain}.b2clogin.com`],
    clientId: applicationID,
    redirectUri: reactRedirectUri,
    postLogoutRedirectUri: PUBLIC_URL + '/',
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    allowRedirectInIframe: false,
  },
};
