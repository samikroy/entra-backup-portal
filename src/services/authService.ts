
import { PublicClientApplication, AuthenticationResult, AccountInfo, SilentRequest } from '@azure/msal-browser';

const msalConfig = {
  auth: {
    clientId: 'YOUR_CLIENT_ID', // Replace with your Azure AD app registration client ID
    authority: 'https://login.microsoftonline.com/common', // Multi-tenant auth
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: true
  }
};

// Create a mock for development purpose
const mockAuthResult: AuthenticationResult = {
  authority: msalConfig.auth.authority,
  uniqueId: 'mock-user-id',
  tenantId: 'mock-tenant-id',
  scopes: ['User.Read'],
  account: {
    homeAccountId: 'mock-home-account-id',
    environment: 'login.microsoftonline.com',
    tenantId: 'mock-tenant-id',
    username: 'demo@contoso.onmicrosoft.com',
    localAccountId: 'mock-local-account-id',
    name: 'Demo User',
  },
  idToken: 'mock-id-token',
  idTokenClaims: {},
  accessToken: 'mock-access-token',
  fromCache: false,
  expiresOn: new Date(Date.now() + 3600 * 1000),
  extExpiresOn: new Date(Date.now() + 3600 * 1000),
  state: '',
  familyId: '',
  tokenType: 'Bearer',
  correlationId: 'mock-correlation-id'
};

// Initialize MSAL instance
export const msalInstance = new PublicClientApplication(msalConfig);

// For development without an actual Azure AD tenant
export const isDevelopmentMode = true;

// Login request with desired scopes
const loginRequest = {
  scopes: ['User.Read']
};

// Function to handle login
export const login = async (): Promise<AuthenticationResult> => {
  if (isDevelopmentMode) {
    console.log('Using mock authentication for development');
    return Promise.resolve(mockAuthResult);
  }
  
  try {
    const loginResponse = await msalInstance.loginPopup(loginRequest);
    return loginResponse;
  } catch (err) {
    console.error('Login failed:', err);
    throw err;
  }
};

// Function to get token silently
export const getToken = async (): Promise<string | null> => {
  if (isDevelopmentMode) {
    return mockAuthResult.accessToken;
  }

  const accounts = msalInstance.getAllAccounts();
  if (accounts.length === 0) {
    return null;
  }

  const request: SilentRequest = {
    scopes: loginRequest.scopes,
    account: accounts[0]
  };

  try {
    const response = await msalInstance.acquireTokenSilent(request);
    return response.accessToken;
  } catch (err) {
    console.error('Error acquiring token silently:', err);
    return null;
  }
};

// Function to handle logout
export const logout = (): void => {
  if (isDevelopmentMode) {
    console.log('Mock logout successful');
    return;
  }
  
  msalInstance.logout();
};

// Get current user info
export const getCurrentUser = (): AccountInfo | null => {
  if (isDevelopmentMode) {
    return mockAuthResult.account;
  }
  
  const accounts = msalInstance.getAllAccounts();
  return accounts.length > 0 ? accounts[0] : null;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  if (isDevelopmentMode) {
    return true; // Always authenticated in dev mode
  }
  
  const accounts = msalInstance.getAllAccounts();
  return accounts.length > 0;
};
