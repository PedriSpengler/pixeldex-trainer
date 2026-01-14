import axios from 'axios';

/**
 * API Base URL
 */
const BASE_URL = 'https://pokeapi.co/api/v2';

/**
 * Interfaces for Type Safety
 */
export interface PokemonBasic {
  id: number;
  name: string;
  types: string[];
  sprite: string;
}

export interface PokemonDetails {
  id: number;
  name: string;
  types: string[];
  sprite: string;
  spriteShiny: string;
  height: number;
  weight: number;
  stats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
  abilities: string[];
  evolutionChain: EvolutionStage[];
}

export interface EvolutionStage {
  id: number;
  name: string;
  sprite: string;
}

/**
 * Static list of all available Pokémon types for UI filtering.
 */
export const POKEMON_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

/**
 * Fetches a paginated list of Pokémon.
 * Note: The PokeAPI list endpoint only returns names and URLs, 
 * so we perform secondary fetches to get IDs and sprites.
 */
export async function fetchPokemonList(offset: number = 0, limit: number = 20): Promise<{ pokemon: PokemonBasic[]; total: number }> {
  const response = await axios.get(`${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`);
  const total = response.data.count;
  
  const pokemonPromises = response.data.results.map(async (p: { name: string; url: string }) => {
    const details = await axios.get(p.url);
    return {
      id: details.data.id,
      name: details.data.name,
      types: details.data.types.map((t: { type: { name: string } }) => t.type.name),
      sprite: details.data.sprites.other['official-artwork'].front_default || details.data.sprites.front_default,
    };
  });

  const pokemon = await Promise.all(pokemonPromises);
  return { pokemon, total };
}

/**
 * Fetches comprehensive details for a single Pokémon.
 * This function hits three different endpoints: 
 * 1. /pokemon/{id} (stats/types)
 * 2. /pokemon-species/{id} (to find the evolution chain URL)
 * 3. /evolution-chain/{id} (the actual evolution path)
 */
export async function fetchPokemonDetails(idOrName: string | number): Promise<PokemonDetails> {
  const response = await axios.get(`${BASE_URL}/pokemon/${idOrName}`);
  const speciesResponse = await axios.get(response.data.species.url);
  
  let evolutionChain: EvolutionStage[] = [];
  
  try {
    const evolutionResponse = await axios.get(speciesResponse.data.evolution_chain.url);
    evolutionChain = await parseEvolutionChain(evolutionResponse.data.chain);
  } catch (e) {
    console.error('Could not fetch evolution chain', e);
  }

  return {
    id: response.data.id,
    name: response.data.name,
    types: response.data.types.map((t: { type: { name: string } }) => t.type.name),
    sprite: response.data.sprites.other['official-artwork'].front_default || response.data.sprites.front_default,
    spriteShiny: response.data.sprites.other['official-artwork'].front_shiny || response.data.sprites.front_shiny,
    height: response.data.height,
    weight: response.data.weight,
    stats: {
      hp: response.data.stats[0].base_stat,
      attack: response.data.stats[1].base_stat,
      defense: response.data.stats[2].base_stat,
      specialAttack: response.data.stats[3].base_stat,
      specialDefense: response.data.stats[4].base_stat,
      speed: response.data.stats[5].base_stat,
    },
    abilities: response.data.abilities.map((a: { ability: { name: string } }) => a.ability.name),
    evolutionChain,
  };
}

/**
 * Recursively parses the nested evolution chain object from PokeAPI.
 * The API uses a "linked list" style structure (node -> evolves_to -> node).
 */
async function parseEvolutionChain(chain: any): Promise<EvolutionStage[]> {
  const stages: EvolutionStage[] = [];
  
  async function traverse(node: any) {
    const name = node.species.name;
    try {
      const pokemonResponse = await axios.get(`${BASE_URL}/pokemon/${name}`);
      stages.push({
        id: pokemonResponse.data.id,
        name: pokemonResponse.data.name,
        sprite: pokemonResponse.data.sprites.other['official-artwork'].front_default || pokemonResponse.data.sprites.front_default,
      });
    } catch (e) {
      console.log(`Could not fetch ${name}`);
    }
    
    // Recurse through all possible branches of evolution (e.g., Eevee)
    for (const evolution of node.evolves_to) {
      await traverse(evolution);
    }
  }
  
  await traverse(chain);
  return stages;
}

/**
 * Searches for a Pokémon by specific name or ID.
 */
export async function searchPokemon(query: string): Promise<PokemonBasic | null> {
  try {
    const response = await axios.get(`${BASE_URL}/pokemon/${query.toLowerCase().trim()}`);
    return {
      id: response.data.id,
      name: response.data.name,
      types: response.data.types.map((t: { type: { name: string } }) => t.type.name),
      sprite: response.data.sprites.other['official-artwork'].front_default || response.data.sprites.front_default,
    };
  } catch {
    return null; // Return null if not found to handle UI error states
  }
}

/**
 * Fetches up to 40 Pokémon belonging to a specific elemental type.
 */
export async function fetchPokemonByType(type: string): Promise<PokemonBasic[]> {
  const response = await axios.get(`${BASE_URL}/type/${type}`);
  
  // Slice to avoid fetching too many details at once
  const pokemonPromises = response.data.pokemon.slice(0, 40).map(async (p: { pokemon: { name: string; url: string } }) => {
    try {
      const details = await axios.get(p.pokemon.url);
      return {
        id: details.data.id,
        name: details.data.name,
        types: details.data.types.map((t: { type: { name: string } }) => t.type.name),
        sprite: details.data.sprites.other['official-artwork'].front_default || details.data.sprites.front_default,
      };
    } catch {
      return null;
    }
  });

  const pokemon = await Promise.all(pokemonPromises);
  return pokemon.filter(Boolean) as PokemonBasic[]; // Filter out failed requests
}