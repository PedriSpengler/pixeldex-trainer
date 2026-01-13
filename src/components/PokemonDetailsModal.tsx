import { useEffect, useState } from 'react';
import { X, Star, Zap, Shield, Sword, Heart, Wind, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { fetchPokemonDetails, PokemonDetails } from '@/lib/pokemon';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface PokemonDetailsModalProps {
  pokemonId: number | null;
  onClose: () => void;
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

const statIcons: Record<string, React.ReactNode> = {
  hp: <Heart className="h-4 w-4" />,
  attack: <Sword className="h-4 w-4" />,
  defense: <Shield className="h-4 w-4" />,
  specialAttack: <Sparkles className="h-4 w-4" />,
  specialDefense: <Zap className="h-4 w-4" />,
  speed: <Wind className="h-4 w-4" />,
};

const statLabels: Record<string, string> = {
  hp: 'HP',
  attack: 'ATK',
  defense: 'DEF',
  specialAttack: 'SP.ATK',
  specialDefense: 'SP.DEF',
  speed: 'SPD',
};

export function PokemonDetailsModal({ pokemonId, onClose }: PokemonDetailsModalProps) {
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [showShiny, setShowShiny] = useState(false);
  const { user } = useAuth();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const navigate = useNavigate();

  useEffect(() => {
    if (pokemonId) {
      setLoading(true);
      fetchPokemonDetails(pokemonId)
        .then(setPokemon)
        .finally(() => setLoading(false));
    }
  }, [pokemonId]);

  const handleFavoriteClick = () => {
    if (!user) {
      onClose();
      navigate('/auth');
      return;
    }

    if (!pokemon) return;

    if (isFavorite(pokemon.id)) {
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
    <Dialog open={pokemonId !== null} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-4 border-primary pixel-border p-0">
        <DialogTitle className="sr-only">
          {pokemon?.name ? `${pokemon.name} Details` : 'Pokemon Details'}
        </DialogTitle>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-16 h-16 rounded-full bg-primary animate-pulse" />
          </div>
        ) : pokemon ? (
          <div className="relative">
            {/* Header */}
            <div className="bg-primary p-4 relative">
              <button
                onClick={onClose}
                className="absolute top-2 right-2 p-2 rounded-full bg-primary-foreground/20 hover:bg-primary-foreground/30 transition-colors"
              >
                <X className="h-5 w-5 text-primary-foreground" />
              </button>
              
              <div className="flex items-center gap-4">
                <span className="font-pixel text-xl text-primary-foreground">
                  #{pokemon.id.toString().padStart(3, '0')}
                </span>
                <h2 className="font-pixel text-lg text-primary-foreground capitalize">
                  {pokemon.name}
                </h2>
              </div>
              
              <div className="flex gap-2 mt-2">
                {pokemon.types.map(type => (
                  <span
                    key={type}
                    className={cn("type-badge text-white", typeColors[type])}
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>

            {/* Sprite */}
            <div className="p-6">
              <div className="flex justify-center items-center gap-4 mb-6">
                <div className="gameboy-screen rounded-xl p-6 relative w-48 h-48 flex items-center justify-center">
                  <div className="absolute inset-0 scanlines opacity-20 rounded-xl" />
                  <img
                    src={showShiny ? pokemon.spriteShiny : pokemon.sprite}
                    alt={pokemon.name}
                    className="w-full h-full object-contain animate-float"
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleFavoriteClick}
                    className={cn(
                      "p-3 rounded-lg retro-button transition-colors",
                      isFavorite(pokemon.id)
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-secondary/50"
                    )}
                  >
                    <Star className={cn("h-6 w-6", isFavorite(pokemon.id) && "fill-current")} />
                  </button>
                  <button
                    onClick={() => setShowShiny(!showShiny)}
                    className={cn(
                      "p-3 rounded-lg retro-button transition-colors",
                      showShiny
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-secondary/50"
                    )}
                  >
                    <Sparkles className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="grid grid-cols-2 gap-4 mb-6 text-center">
                <div className="bg-muted rounded-lg p-3 pixel-border">
                  <span className="font-pixel text-[10px] text-muted-foreground">Height</span>
                  <p className="font-pixel text-sm text-foreground mt-1">{pokemon.height / 10}m</p>
                </div>
                <div className="bg-muted rounded-lg p-3 pixel-border">
                  <span className="font-pixel text-[10px] text-muted-foreground">Weight</span>
                  <p className="font-pixel text-sm text-foreground mt-1">{pokemon.weight / 10}kg</p>
                </div>
              </div>

              {/* Stats */}
              <div className="mb-6">
                <h3 className="font-pixel text-sm text-primary mb-4">BASE STATS</h3>
                <div className="space-y-3">
                  {Object.entries(pokemon.stats).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-3">
                      <div className="flex items-center gap-2 w-24">
                        <span className="text-secondary">{statIcons[key]}</span>
                        <span className="font-pixel text-[10px] text-muted-foreground">
                          {statLabels[key]}
                        </span>
                      </div>
                      <span className="font-pixel text-xs w-10 text-foreground">{value}</span>
                      <Progress 
                        value={(value / 255) * 100} 
                        className="flex-1 h-3 bg-muted"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Abilities */}
              <div className="mb-6">
                <h3 className="font-pixel text-sm text-primary mb-3">ABILITIES</h3>
                <div className="flex flex-wrap gap-2">
                  {pokemon.abilities.map(ability => (
                    <span
                      key={ability}
                      className="px-3 py-1 bg-muted rounded-lg font-pixel text-[10px] text-foreground capitalize pixel-border"
                    >
                      {ability.replace('-', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              {/* Evolution Chain */}
              {pokemon.evolutionChain.length > 1 && (
                <div>
                  <h3 className="font-pixel text-sm text-primary mb-4">EVOLUTION</h3>
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    {pokemon.evolutionChain.map((evo, index) => (
                      <div key={evo.id} className="flex items-center gap-2">
                        <div className={cn(
                          "gameboy-screen rounded-lg p-2 w-20 h-20 flex items-center justify-center",
                          evo.id === pokemon.id && "ring-2 ring-secondary"
                        )}>
                          <img
                            src={evo.sprite}
                            alt={evo.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        {index < pokemon.evolutionChain.length - 1 && (
                          <span className="font-pixel text-muted-foreground">→</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
