import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

/**
 * Interface representing the authenticated user data.
 */
interface User {
  id: string;
  email: string;
  username: string;
}

/**
 * Interface defining the methods and state provided by the Auth Context.
 */
interface AuthContextType {
  user: User | null;         // Current user object or null if not logged in
  isLoading: boolean;        // Tracks if the session is being restored from storage
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, username: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  token: string | null;      // JWT authentication token
}

// Create the context with an undefined default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Base URL for the Node.js Backend API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * AuthProvider Component
 * Wraps the application to provide authentication state to all components.
 * Manages JWT persistence and Axios authorization headers.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Effect: On initial mount, check for existing session data in LocalStorage.
   */
  useEffect(() => {
    const storedUser = localStorage.getItem('pokedex_user');
    const storedToken = localStorage.getItem('pokedex_token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      
      // Set the default Authorization header for all future Axios requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    setIsLoading(false);
  }, []);

  /**
   * Login Logic: Authenticates user and saves session data.
   */
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });

      const { user, token } = response.data;

      // Persistence: Save data to LocalStorage
      localStorage.setItem('pokedex_user', JSON.stringify(user));
      localStorage.setItem('pokedex_token', token);
      
      // Update local state
      setUser(user);
      setToken(token);

      // Inject JWT token into Axios global config
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return { success: true };

    } catch (error: any) {
      // Extract backend error message or use a fallback
      const errorMessage = error.response?.data?.error || 'Failed to login';
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Register Logic: Creates a new account and automatically logs the user in.
   */
  const register = async (email: string, password: string, username: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        email,
        password,
        username
      });

      const { user, token } = response.data;

      localStorage.setItem('pokedex_user', JSON.stringify(user));
      localStorage.setItem('pokedex_token', token);
      
      setUser(user);
      setToken(token);

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return { success: true };

    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to register';
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Logout Logic: Clears all session data from state, storage, and headers.
   */
  const logout = () => {
    localStorage.removeItem('pokedex_user');
    localStorage.removeItem('pokedex_token');
    // Remove the Authorization header to stop sending the token
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom Hook: useAuth
 * Provides an easy way for components to access the authentication context.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};