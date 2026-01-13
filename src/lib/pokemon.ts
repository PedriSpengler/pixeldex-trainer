import axios from 'axios';

const BASE_URL = 'https://pokeapi.co/api/v2';

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

export const POKEMON_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

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

export async function fetchPokemonDetails(idOrName: string | number): Promise<PokemonDetails> {
  const response = await axios.get(`${BASE_URL}/pokemon/${idOrName}`);
  const speciesResponse = await axios.get(response.data.species.url);
  
  let evolutionChain: EvolutionStage[] = [];
  
  try {
    const evolutionResponse = await axios.get(speciesResponse.data.evolution_chain.url);
    evolutionChain = await parseEvolutionChain(evolutionResponse.data.chain);
  } catch (e) {
    console.log('Could not fetch evolution chain');
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
    
    for (const evolution of node.evolves_to) {
      await traverse(evolution);
    }
  }
  
  await traverse(chain);
  return stages;
}

export async function searchPokemon(query: string): Promise<PokemonBasic | null> {
  try {
    const response = await axios.get(`${BASE_URL}/pokemon/${query.toLowerCase()}`);
    return {
      id: response.data.id,
      name: response.data.name,
      types: response.data.types.map((t: { type: { name: string } }) => t.type.name),
      sprite: response.data.sprites.other['official-artwork'].front_default || response.data.sprites.front_default,
    };
  } catch {
    return null;
  }
}

export async function fetchPokemonByType(type: string): Promise<PokemonBasic[]> {
  const response = await axios.get(`${BASE_URL}/type/${type}`);
  
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
  return pokemon.filter(Boolean) as PokemonBasic[];
}
