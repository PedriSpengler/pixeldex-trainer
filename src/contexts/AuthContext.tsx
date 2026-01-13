import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

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
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// URL do seu Backend Node.js
const API_URL = 'http://localhost:3001';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ao carregar a página, verifica se já existe usuário salvo
    const storedUser = localStorage.getItem('pokedex_user');
    const storedToken = localStorage.getItem('pokedex_token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      // Configura o token padrão para todas as futuras requisições do axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Chamada REAL ao backend
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });

      const { user, token } = response.data;

      // Salva no LocalStorage e no Estado
      localStorage.setItem('pokedex_user', JSON.stringify(user));
      localStorage.setItem('pokedex_token', token);
      
      setUser(user);
      setToken(token);

      // Atualiza o header do Axios para incluir o token nas próximas chamadas
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return { success: true };

    } catch (error: any) {
      // Captura mensagem de erro do backend (ex: "Invalid email")
      const errorMessage = error.response?.data?.error || 'Falha ao fazer login';
      return { success: false, error: errorMessage };
    }
  };

  const register = async (email: string, password: string, username: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Chamada REAL ao backend
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
      const errorMessage = error.response?.data?.error || 'Falha ao registrar';
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('pokedex_user');
    localStorage.removeItem('pokedex_token');
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};