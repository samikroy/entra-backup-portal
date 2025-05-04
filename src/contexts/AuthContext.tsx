
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AccountInfo, AuthenticationResult } from '@azure/msal-browser';
import { 
  login as msalLogin, 
  logout as msalLogout, 
  getCurrentUser as msalGetCurrentUser,
  isAuthenticated as msalIsAuthenticated,
  isDevelopmentMode
} from '../services/authService';

interface AuthContextType {
  user: AccountInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<AuthenticationResult>;
  logout: () => void;
  isDevelopmentMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AccountInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // On component mount, check if user is already authenticated
    const initializeAuth = async () => {
      try {
        if (msalIsAuthenticated()) {
          const currentUser = msalGetCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Error during authentication initialization:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await msalLogin();
      setUser(result.account);
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    msalLogout();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login: handleLogin,
    logout: handleLogout,
    isDevelopmentMode
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
