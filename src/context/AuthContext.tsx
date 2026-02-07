import axios from 'axios';
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

const TOKEN_KEY = "token";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Initialize with the current auth state (same key as authService uses)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    return !!token;
  });
  const navigate = useNavigate();

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setIsAuthenticated(false);
    navigate('/login');
  }, [navigate]);

  const login = (token: string) => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      setIsAuthenticated(true);
    }
  };

  // On 401/403, logout and redirect so we don't stay on pages that need the backend (e.g. Transactions)
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          logout();
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, [logout]);

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const isValid = !!token;
    setIsAuthenticated(isValid);
    return isValid;
  }, []);

  const value = {
    isAuthenticated,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 