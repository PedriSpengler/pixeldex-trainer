import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, username: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database for frontend demo
const mockUsers: { email: string; password: string; username: string; id: string }[] = [
  { id: '1', email: 'demo@pokedex.com', password: 'demo123', username: 'Ash' }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('pokedex_user');
    const storedToken = localStorage.getItem('pokedex_token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock authentication
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const userData = { id: foundUser.id, email: foundUser.email, username: foundUser.username };
      const mockToken = `mock_jwt_${Date.now()}`;
      
      localStorage.setItem('pokedex_user', JSON.stringify(userData));
      localStorage.setItem('pokedex_token', mockToken);
      setUser(userData);
      
      return { success: true };
    }
    
    return { success: false, error: 'Invalid email or password' };
  };

  const register = async (email: string, password: string, username: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check if user exists
    if (mockUsers.find(u => u.email === email)) {
      return { success: false, error: 'Email already registered' };
    }

    // Create new user
    const newUser = {
      id: String(mockUsers.length + 1),
      email,
      password,
      username
    };
    mockUsers.push(newUser);

    const userData = { id: newUser.id, email: newUser.email, username: newUser.username };
    const mockToken = `mock_jwt_${Date.now()}`;
    
    localStorage.setItem('pokedex_user', JSON.stringify(userData));
    localStorage.setItem('pokedex_token', mockToken);
    setUser(userData);

    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('pokedex_user');
    localStorage.removeItem('pokedex_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
