import { useState, useEffect } from 'react';
import { fetchPokemonList, searchPokemon, fetchPokemonByType, PokemonBasic } from '@/lib/pokemon';
import { Header } from '@/components/Header';
import { PokemonCard } from '@/components/PokemonCard';
import { SearchBar } from '@/components/SearchBar';
import { Pagination } from '@/components/Pagination';
import { PokemonDetailsModal } from '@/components/PokemonDetailsModal';

const ITEMS_PER_PAGE = 20;

const Index = () => {
  const [pokemon, setPokemon] = useState<PokemonBasic[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [searchResult, setSearchResult] = useState<PokemonBasic | null>(null);
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedType && !searchResult) {
      loadPokemon(currentPage);
    }
  }, [currentPage, selectedType, searchResult]);

  const loadPokemon = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const offset = (page - 1) * ITEMS_PER_PAGE;
      const { pokemon: data, total } = await fetchPokemonList(offset, ITEMS_PER_PAGE);
      setPokemon(data);
      setTotalPages(Math.ceil(total / ITEMS_PER_PAGE));
    } catch (err) {
      setError('Failed to load Pokémon');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    setSelectedType(null);
    
    try {
      const result = await searchPokemon(query);
      if (result) {
        setSearchResult(result);
        setPokemon([result]);
        setTotalPages(1);
      } else {
        setError(`No Pokémon found for "${query}"`);
        setPokemon([]);
      }
    } catch (err) {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTypeFilter = async (type: string | null) => {
    setSelectedType(type);
    setSearchResult(null);
    setCurrentPage(1);
    
    if (type) {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPokemonByType(type);
        setPokemon(data);
        setTotalPages(1);
      } catch (err) {
        setError('Failed to filter by type');
      } finally {
        setLoading(false);
      }
    } else {
      loadPokemon(1);
    }
  };

  const handleClear = () => {
    setSearchResult(null);
    setSelectedType(null);
    setCurrentPage(1);
    loadPokemon(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-6">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="font-pixel text-2xl md:text-4xl text-primary mb-2">
            POKÉDEX
          </h1>
          <p className="font-pixel text-[10px] md:text-xs text-muted-foreground">
            Gotta catch 'em all!
          </p>
        </div>

        {/* Search & Filter */}
        <div className="mb-8">
          <SearchBar
            onSearch={handleSearch}
            onTypeFilter={handleTypeFilter}
            selectedType={selectedType}
            onClear={handleClear}
          />
        </div>

        {/* Status Indicators */}
        {(searchResult || selectedType) && (
          <div className="mb-4 flex items-center gap-2">
            <span className="font-pixel text-[10px] text-muted-foreground">
              {searchResult && `Showing result for "${searchResult.name}"`}
              {selectedType && `Filtering by ${selectedType} type`}
            </span>
            <button
              onClick={handleClear}
              className="font-pixel text-[10px] text-primary hover:underline"
            >
              Clear
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
                <div className="relative w-full h-full rounded-full bg-gradient-to-b from-primary to-primary-foreground border-4 border-foreground flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-foreground" />
                </div>
              </div>
              <p className="font-pixel text-xs text-muted-foreground animate-pulse">
                Loading...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-16">
            <p className="font-pixel text-sm text-destructive mb-4">{error}</p>
            <button
              onClick={handleClear}
              className="font-pixel text-xs text-primary hover:underline"
            >
              Go back
            </button>
          </div>
        )}

        {/* Pokemon Grid */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {pokemon.map(p => (
                <PokemonCard
                  key={p.id}
                  pokemon={p}
                  onClick={() => setSelectedPokemonId(p.id)}
                />
              ))}
            </div>

            {/* Pagination */}
            {!searchResult && !selectedType && totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </main>

      {/* Details Modal */}
      <PokemonDetailsModal
        pokemonId={selectedPokemonId}
        onClose={() => setSelectedPokemonId(null)}
      />
    </div>
  );
};

export default Index;
