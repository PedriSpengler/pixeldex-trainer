import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface FavoritePokemon {
  id: number;
  name: string;
  types: string[];
  sprite: string;
}

interface FavoritesContextType {
  favorites: FavoritePokemon[];
  addFavorite: (pokemon: FavoritePokemon) => void;
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoritePokemon[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      // Load favorites from localStorage (simulating database)
      const stored = localStorage.getItem(`pokedex_favorites_${user.id}`);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } else {
      setFavorites([]);
    }
  }, [user]);

  const saveFavorites = (newFavorites: FavoritePokemon[]) => {
    if (user) {
      localStorage.setItem(`pokedex_favorites_${user.id}`, JSON.stringify(newFavorites));
    }
  };

  const addFavorite = async (pokemon: FavoritePokemon) => {
    if (!user) return;
    
    setIsLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newFavorites = [...favorites, pokemon];
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
    setIsLoading(false);
  };

  const removeFavorite = async (id: number) => {
    if (!user) return;
    
    setIsLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newFavorites = favorites.filter(p => p.id !== id);
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
    setIsLoading(false);
  };

  const isFavorite = (id: number) => favorites.some(p => p.id === id);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, isLoading }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
