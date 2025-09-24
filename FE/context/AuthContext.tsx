
import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { User, AuthResponse } from '../types';
import { api, setAuthToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (data: AuthResponse) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('SEM_TOKEN'));
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async (authToken: string) => {
    setAuthToken(authToken);
    try {
      // In a real app, you'd fetch the user profile from a /me endpoint
      // For this hackathon, we'll decode the token or use stored user data
      const storedUser = localStorage.getItem('SEM_USER');
      if(storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
         // Fallback if user data not in localStorage
         logout();
      }
    } catch (error) {
      console.error('Failed to fetch user profile', error);
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchUserProfile(token);
    } else {
      setLoading(false);
    }
  }, [token, fetchUserProfile]);

  const login = (data: AuthResponse) => {
    localStorage.setItem('SEM_TOKEN', data.token);
    localStorage.setItem('SEM_USER', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    setAuthToken(data.token);
  };

  const logout = () => {
    localStorage.removeItem('SEM_TOKEN');
    localStorage.removeItem('SEM_USER');
    setToken(null);
    setUser(null);
    setAuthToken(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
