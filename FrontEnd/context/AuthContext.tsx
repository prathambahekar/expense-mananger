import React, { createContext, useState, useEffect, useMemo, useContext, PropsWithChildren } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  isPreloading: boolean;
  login: () => void;
  logout: () => void;
  finishPreloading: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// FIX: Use PropsWithChildren for robust typing of components with children, resolving potential inference issues.
type AuthProviderProps = PropsWithChildren<{}>;

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPreloading, setIsPreloading] = useState(false);

  useEffect(() => {
    try {
      const storedAuth = sessionStorage.getItem('isLoggedIn');
      if (storedAuth === 'true') {
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Could not access session storage:", error);
    } finally {
        setIsLoading(false);
    }
  }, []);

  const login = () => {
    setIsLoggedIn(true);
    sessionStorage.setItem('isLoggedIn', 'true');
    setIsPreloading(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('isLoggedIn');
  };

  const finishPreloading = () => {
    setIsPreloading(false);
  };

  const value = useMemo(() => ({ isLoggedIn, isLoading, isPreloading, login, logout, finishPreloading }), [isLoggedIn, isLoading, isPreloading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
