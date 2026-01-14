import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { POKEMON_TYPES } from '@/lib/pokemon';
import { cn } from '@/lib/utils';

/**
 * Props for the SearchBar component.
 */
interface SearchBarProps {
  onSearch: (query: string) => void;         // Callback triggered on form submission
  onTypeFilter: (type: string | null) => void; // Callback triggered when a type badge is clicked
  selectedType: string | null;               // Currently active type filter
  onClear: () => void;                       // Resets search and filters
}

/**
 * Mapping of Pokémon types to Tailwind CSS classes for background and hover states.
 * Some types include 'text-black' to ensure contrast on lighter backgrounds (like Steel or Ice).
 */
const typeColors: Record<string, string> = {
  normal: 'bg-type-normal hover:bg-type-normal/80',
  fire: 'bg-type-fire hover:bg-type-fire/80',
  water: 'bg-type-water hover:bg-type-water/80',
  electric: 'bg-type-electric hover:bg-type-electric/80 text-black',
  grass: 'bg-type-grass hover:bg-type-grass/80',
  ice: 'bg-type-ice hover:bg-type-ice/80 text-black',
  fighting: 'bg-type-fighting hover:bg-type-fighting/80',
  poison: 'bg-type-poison hover:bg-type-poison/80',
  ground: 'bg-type-ground hover:bg-type-ground/80 text-black',
  flying: 'bg-type-flying hover:bg-type-flying/80',
  psychic: 'bg-type-psychic hover:bg-type-psychic/80',
  bug: 'bg-type-bug hover:bg-type-bug/80',
  rock: 'bg-type-rock hover:bg-type-rock/80',
  ghost: 'bg-type-ghost hover:bg-type-ghost/80',
  dragon: 'bg-type-dragon hover:bg-type-dragon/80',
  dark: 'bg-type-dark hover:bg-type-dark/80',
  steel: 'bg-type-steel hover:bg-type-steel/80 text-black',
  fairy: 'bg-type-fairy hover:bg-type-fairy/80',
};

/**
 * SearchBar Component
 * Combines an input field for name/ID search with a row of type-filtering buttons.
 * Designed with a retro/pixel aesthetic.
 */
export function SearchBar({ onSearch, onTypeFilter, selectedType, onClear }: SearchBarProps) {
  const [query, setQuery] = useState('');

  /**
   * Handles form submission to prevent page reload and trigger search logic.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  /**
   * Resets local state and notifies parent to clear results.
   */
  const handleClear = () => {
    setQuery('');
    onClear();
  };

  return (
    <div className="space-y-4">
      {/* --- TEXT SEARCH FORM --- */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          {/* Magnifying glass icon */}
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name or ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 bg-muted border-2 border-border font-pixel text-xs focus:border-primary"
          />
          {/* Clear button (X) visible only when there is text in the input */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button 
          type="submit" 
          className="bg-primary hover:bg-primary/90 retro-button font-pixel text-[10px]"
        >
          SEARCH
        </Button>
      </form>

      {/* --- TYPE FILTER BADGES --- */}
      <div className="flex flex-wrap gap-2">
        {POKEMON_TYPES.map(type => (
          <button
            key={type}
            /* If the clicked type is already selected, clear the filter (null) */
            onClick={() => onTypeFilter(selectedType === type ? null : type)}
            className={cn(
              "px-3 py-1 rounded text-white text-[10px] font-pixel uppercase transition-all",
              typeColors[type],
              /* Visual feedback for the active filter: adds a ring and scales up */
              selectedType === type
                ? "ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110"
                : "opacity-70 hover:opacity-100"
            )}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
}