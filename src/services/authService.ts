
import { PublicClientApplication, AuthenticationResult, AccountInfo, SilentRequest } from '@azure/msal-browser';

const localDevelopement: boolean = false;
let REDIRECTURI = ""

if (localDevelopement) {
  REDIRECTURI = "http://localhost:8080/login"
} else {
  REDIRECTURI = "https://entra-backup-portal.vercel.app/login"
}

const msalConfig = {
  auth: {
    clientId: '34d33d5b-e282-4269-9512-2dd2a3183796', // Replace with your Azure AD app registration client ID
    authority: 'https://login.microsoftonline.com/common', // Multi-tenant auth
    redirectUri: REDIRECTURI, // Replace with your redirect URI
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: true
  }
};

// Create mock user profiles for development purpose
const mockProfiles = {
  admin: {
    homeAccountId: 'mock-admin-account-id',
    environment: 'login.microsoftonline.com',
    tenantId: 'mock-tenant-id',
    username: 'admin@contoso.onmicrosoft.com',
    localAccountId: 'mock-admin-local-account-id',
    name: 'Admin User',
    roles: ['Admin', 'User'],
  },
  user: {
    homeAccountId: 'mock-user-account-id',
    environment: 'login.microsoftonline.com',
    tenantId: 'mock-tenant-id',
    username: 'demo@contoso.onmicrosoft.com',
    localAccountId: 'mock-user-local-account-id',
    name: 'Demo User',
    roles: ['User'],
  }
};

// Default to admin for development
const defaultMockProfile = mockProfiles.admin;

// Create a mock for development purpose
const createMockAuthResult = (profile = defaultMockProfile): AuthenticationResult => ({
  authority: msalConfig.auth.authority,
  uniqueId: profile.localAccountId,
  tenantId: profile.tenantId,
  scopes: ['User.Read', 'Directory.Read.All'],
  account: profile,
  idToken: 'mock-id-token',
  idTokenClaims: {
    roles: profile.roles
  },
  accessToken: 'mock-access-token',
  fromCache: false,
  expiresOn: new Date(Date.now() + 3600 * 1000),
  extExpiresOn: new Date(Date.now() + 3600 * 1000),
  state: '',
  familyId: '',
  tokenType: 'Bearer',
  correlationId: 'mock-correlation-id'
});

const mockAuthResult = createMockAuthResult();

// Initialize MSAL instance
export const msalInstance = new PublicClientApplication(msalConfig);

// For development without an actual Azure AD tenant
export const isDevelopmentMode = false;

let isInitialized = false;

const initialize = async () => {
  if (!isInitialized) {
    await msalInstance.initialize();
    isInitialized = true;
  }
};
let loginInProgress = false;

// Login request with desired scopes
const loginRequest = {
  scopes: ['User.Read', 'Directory.Read.All']
};

// Function to handle login
export const login = async (isAdmin = true): Promise<AuthenticationResult> => {
  if (isDevelopmentMode) {
    console.log('Using mock authentication for development');
    const profile = isAdmin ? mockProfiles.admin : mockProfiles.user;
    return Promise.resolve(createMockAuthResult(profile));
  }

  try {
    await initialize();
    await msalInstance.handleRedirectPromise();

    if (loginInProgress) {
      console.warn('Login already in progress, please wait');
      return;
    }
    loginInProgress = true;

    const loginResponse = await msalInstance.loginPopup(loginRequest);
    console.log('Login successful:', loginResponse);
    return loginResponse;
  } catch (err) {
    console.error('Login failed:', err);
    throw err;
  } finally {
    loginInProgress = false;
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
export const logout = async (): Promise<void> => {
  if (isDevelopmentMode) {
    console.log('Mock logout successful');
    return;
  }
  await initialize();
  await msalInstance.logout();
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

// Check if user is admin
export const isUserAdmin = (): boolean => {
  if (isDevelopmentMode) {
    return mockAuthResult.account.name?.toLowerCase().includes('admin') || false;
  }

  const accounts = msalInstance.getAllAccounts();
  if (accounts.length === 0) return false;

  // In real implementation, check roles claim
  // return accounts[0].idTokenClaims?.roles?.includes('Admin') || false;
  return accounts[0].username?.toLowerCase().includes('admin') || false;
};
