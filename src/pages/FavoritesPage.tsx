import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { Header } from '@/components/Header';
import { PokemonCard } from '@/components/PokemonCard';
import { PokemonDetailsModal } from '@/components/PokemonDetailsModal';
import { Star } from 'lucide-react';

/**
 * FavoritesPage Component
 * Renders a collection of Pokémon that the user has marked as favorites.
 * Includes protection logic to redirect unauthorized users.
 */
const FavoritesPage = () => {
  // Access auth state and the favorites list from their respective contexts
  const { user, isLoading: authLoading } = useAuth();
  const { favorites } = useFavorites();
  
  // Local state to track which Pokémon is being viewed in the detail modal
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(null);

  /**
   * ROUTE GUARD: Loading State
   * Prevents the page from flashing "Access Denied" or redirecting while
   * the AuthProvider is still checking LocalStorage for an existing session.
   */
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-primary animate-pulse" />
      </div>
    );
  }

  /**
   * ROUTE GUARD: Unauthenticated User
   * If the auth check is finished and no user is found, redirect to the auth page.
   * 'replace' prevents the user from going back to this protected page via the browser back button.
   */
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Persistent site header */}
      <Header />
      
      <main className="container py-6">
        {/* --- PAGE TITLE SECTION --- */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-2">
            <Star className="h-6 w-6 text-secondary fill-current" />
            <h1 className="font-pixel text-2xl md:text-3xl text-primary">
              MY FAVORITES
            </h1>
            <Star className="h-6 w-6 text-secondary fill-current" />
          </div>
          <p className="font-pixel text-[10px] text-muted-foreground">
            {user.username}'s caught Pokémon
          </p>
        </div>

        {/* --- CONTENT SECTION --- */}
        {favorites.length === 0 ? (
          /* EMPTY STATE: Shown when the collection is empty */
          <div className="text-center py-16">
            <div className="gameboy-screen rounded-xl p-8 max-w-sm mx-auto mb-6">
              <div className="text-6xl mb-4">🎯</div>
              <p className="font-pixel text-sm text-foreground mb-2">No favorites yet!</p>
              <p className="font-pixel text-[10px] text-muted-foreground">
                Click the star on any Pokémon to add it to your collection
              </p>
            </div>
          </div>
        ) : (
          /* GRID VIEW: Displays the list of favorited Pokémon cards */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {favorites.map(pokemon => (
              <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                onClick={() => setSelectedPokemonId(pokemon.id)}
              />
            ))}
          </div>
        )}

        {/* --- STATISTICS BADGE --- */}
        {favorites.length > 0 && (
          <div className="mt-8 text-center">
            <div className="inline-block bg-muted rounded-lg p-4 pixel-border">
              <p className="font-pixel text-[10px] text-muted-foreground mb-1">
                Pokémon Collected
              </p>
              <p className="font-pixel text-2xl text-secondary">
                {favorites.length}
              </p>
            </div>
          </div>
        )}
      </main>

      {/* --- SHARED MODAL --- 
          Opens when selectedPokemonId is not null.
      */}
      <PokemonDetailsModal
        pokemonId={selectedPokemonId}
        onClose={() => setSelectedPokemonId(null)}
      />
    </div>
  );
};

export default FavoritesPage;