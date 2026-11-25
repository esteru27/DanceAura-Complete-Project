import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authAPI } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateProfile: (data: any) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('dance_aura_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshProfile = async () => {
    try {
      const storedToken = localStorage.getItem('dance_aura_token');
      if (!storedToken) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const res = await authAPI.getProfile();
      if (res.success && res.user) {
        setUser(res.user);
      } else {
        logout();
      }
    } catch (error) {
      console.warn('[AuthContext] Session expired or invalid');
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const res = await authAPI.login(credentials);
    if (res.token && res.user) {
      localStorage.setItem('dance_aura_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
  };

  const register = async (userData: any) => {
    const res = await authAPI.register(userData);
    if (res.token && res.user) {
      localStorage.setItem('dance_aura_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
  };

  const updateProfile = async (data: any) => {
    const res = await authAPI.updateProfile(data);
    if (res.success && res.user) {
      setUser(res.user);
    }
  };

  const logout = () => {
    localStorage.removeItem('dance_aura_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
