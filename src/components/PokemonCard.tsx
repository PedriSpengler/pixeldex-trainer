import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { PokemonBasic } from '@/lib/pokemon';
import { cn } from '@/lib/utils';

/**
 * Props for the PokemonCard component.
 */
interface PokemonCardProps {
  pokemon: PokemonBasic; // Basic data for the Pokémon (id, name, types, sprite)
  onClick: () => void;    // Function to trigger when the card is clicked
}

/**
 * Mapping of Pokémon types to their corresponding CSS background classes.
 * These classes should be defined in your Tailwind config or global CSS.
 */
const typeColors: Record<string, string> = {
  normal: 'bg-type-normal',
  fire: 'bg-type-fire',
  water: 'bg-type-water',
  electric: 'bg-type-electric',
  grass: 'bg-type-grass',
  ice: 'bg-type-ice',
  fighting: 'bg-type-fighting',
  poison: 'bg-type-poison',
  ground: 'bg-type-ground',
  flying: 'bg-type-flying',
  psychic: 'bg-type-psychic',
  bug: 'bg-type-bug',
  rock: 'bg-type-rock',
  ghost: 'bg-type-ghost',
  dragon: 'bg-type-dragon',
  dark: 'bg-type-dark',
  steel: 'bg-type-steel',
  fairy: 'bg-type-fairy',
};

/**
 * PokemonCard Component
 * Displays a summary of a Pokémon in a retro-style card.
 * Includes a "Favorite" toggle and hover animations.
 */
export function PokemonCard({ pokemon, onClick }: PokemonCardProps) {
  const { user } = useAuth();
  const { isFavorite, addFavorite, removeFavorite, isLoading } = useFavorites();
  const navigate = useNavigate();

  // Check if this specific Pokémon is currently in the user's favorites
  const favorite = isFavorite(pokemon.id);

  /**
   * Handles clicks on the Star button.
   * Prevents the click from triggering the card's main onClick (event bubbling).
   */
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stops the card's onClick from firing
    
    // Redirect to login if an unauthenticated user tries to favorite
    if (!user) {
      navigate('/auth');
      return;
    }

    // Toggle favorite status
    if (favorite) {
      removeFavorite(pokemon.id);
    } else {
      addFavorite({
        id: pokemon.id,
        name: pokemon.name,
        types: pokemon.types,
        sprite: pokemon.sprite,
      });
    }
  };

  return (
    <div 
      className="pokemon-card rounded-lg pixel-border cursor-pointer group transition-all duration-300 hover:scale-105 hover:-translate-y-1"
      onClick={onClick}
    >
      {/* --- FAVORITE BUTTON --- */}
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={handleFavoriteClick}
          disabled={isLoading}
          className={cn(
            "p-2 rounded-full transition-all duration-200",
            favorite 
              ? "bg-secondary text-secondary-foreground" 
              : "bg-muted/80 text-muted-foreground hover:bg-secondary/50 hover:text-secondary-foreground"
          )}
        >
          {/* Fills the star icon if the item is a favorite */}
          <Star className={cn("h-4 w-4", favorite && "fill-current")} />
        </button>
      </div>

      <div className="p-4">
        {/* --- VISUAL SECTION: "GAME BOY SCREEN" --- */}
        <div className="relative gameboy-screen rounded-lg p-4 mb-3 aspect-square flex items-center justify-center overflow-hidden">
          {/* Adds a visual CRT/Scanline overlay for retro effect */}
          <div className="absolute inset-0 scanlines opacity-30" />
          <img
            src={pokemon.sprite}
            alt={pokemon.name}
            className="w-full h-full object-contain drop-shadow-lg group-hover:animate-float transition-transform"
            loading="lazy"
          />
        </div>

        {/* --- INFO SECTION --- */}
        <div className="text-center">
          {/* Formats ID to #001 style */}
          <span className="font-pixel text-[10px] text-muted-foreground">
            #{pokemon.id.toString().padStart(3, '0')}
          </span>
          <h3 className="font-pixel text-xs text-foreground capitalize mt-1 truncate">
            {pokemon.name}
          </h3>
          
          {/* TYPE BADGES */}
          <div className="flex justify-center gap-1 mt-2 flex-wrap">
            {pokemon.types.map(type => (
              <span
                key={type}
                className={cn(
                  "type-badge text-white",
                  typeColors[type] || 'bg-muted'
                )}
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}