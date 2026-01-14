import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

/**
 * Interface representing the structure of a Pokémon saved in favorites.
 */
export interface FavoritePokemon {
  id: number;
  name: string;
  types: string[];
  sprite: string;
}

/**
 * Interface defining the properties and methods available in the Favorites Context.
 */
interface FavoritesContextType {
  favorites: FavoritePokemon[];            // List of favorited Pokémon
  addFavorite: (pokemon: FavoritePokemon) => void; // Function to add a Pokémon
  removeFavorite: (id: number) => void;     // Function to remove a Pokémon by ID
  isFavorite: (id: number) => boolean;      // Helper to check if a Pokémon is favorited
  isLoading: boolean;                      // State to track async operations
}

// Initialize the context
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

/**
 * FavoritesProvider Component
 * Manages the favorites list, ensuring it persists in LocalStorage and 
 * remains synced with the currently authenticated user.
 */
export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth(); // Access current user to separate storage keys
  const [favorites, setFavorites] = useState<FavoritePokemon[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Effect: Loads user-specific favorites whenever the user changes.
   * If the user logs out, the favorites list is cleared.
   */
  useEffect(() => {
    if (user) {
      // Fetch favorites from localStorage using a user-unique key
      const stored = localStorage.getItem(`pokedex_favorites_${user.id}`);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } else {
      // Clear state when no user is logged in
      setFavorites([]);
    }
  }, [user]);

  /**
   * Internal helper to persist the current favorites list to LocalStorage.
   */
  const saveFavorites = (newFavorites: FavoritePokemon[]) => {
    if (user) {
      localStorage.setItem(`pokedex_favorites_${user.id}`, JSON.stringify(newFavorites));
    }
  };

  /**
   * Adds a Pokémon to the favorites list.
   * Includes a simulated API delay for UI testing (loading states).
   */
  const addFavorite = async (pokemon: FavoritePokemon) => {
    if (!user) return;
    
    setIsLoading(true);
    // Artificial delay to simulate network latency
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newFavorites = [...favorites, pokemon];
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
    setIsLoading(false);
  };

  /**
   * Removes a Pokémon from the favorites list by filtering out the given ID.
   */
  const removeFavorite = async (id: number) => {
    if (!user) return;
    
    setIsLoading(true);
    // Artificial delay to simulate network latency
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newFavorites = favorites.filter(p => p.id !== id);
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
    setIsLoading(false);
  };

  /**
   * Utility function to check if a specific ID exists in the current favorites.
   */
  const isFavorite = (id: number) => favorites.some(p => p.id === id);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, isLoading }}>
      {children}
    </FavoritesContext.Provider>
  );
};

/**
 * Custom Hook: useFavorites
 * Allows components to consume favorite data and methods easily.
 */
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};