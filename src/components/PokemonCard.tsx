import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { PokemonBasic } from '@/lib/pokemon';
import { cn } from '@/lib/utils';

interface PokemonCardProps {
  pokemon: PokemonBasic;
  onClick: () => void;
}

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

export function PokemonCard({ pokemon, onClick }: PokemonCardProps) {
  const { user } = useAuth();
  const { isFavorite, addFavorite, removeFavorite, isLoading } = useFavorites();
  const navigate = useNavigate();
  const favorite = isFavorite(pokemon.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      navigate('/auth');
      return;
    }

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
          <Star className={cn("h-4 w-4", favorite && "fill-current")} />
        </button>
      </div>

      <div className="p-4">
        <div className="relative gameboy-screen rounded-lg p-4 mb-3 aspect-square flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 scanlines opacity-30" />
          <img
            src={pokemon.sprite}
            alt={pokemon.name}
            className="w-full h-full object-contain drop-shadow-lg group-hover:animate-float transition-transform"
            loading="lazy"
          />
        </div>

        <div className="text-center">
          <span className="font-pixel text-[10px] text-muted-foreground">
            #{pokemon.id.toString().padStart(3, '0')}
          </span>
          <h3 className="font-pixel text-xs text-foreground capitalize mt-1 truncate">
            {pokemon.name}
          </h3>
          
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
