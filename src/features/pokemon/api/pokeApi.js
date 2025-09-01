import { useQuery } from "@tanstack/react-query";
import { fetchFromPokeAPI } from "./client";

export const usePokemon = (nameOrId) => {
    return useQuery({
        queryKey: ["pokemon", nameOrId],
        queryFn: () => fetchFromPokeAPI(`/pokemon/${nameOrId}`),
        enabled: !!nameOrId,
    });
};

export const usePokemonList = (limit = 20, offset = 0) => {
    return useQuery({
        queryKey: ["pokemonList", limit, offset],
        queryFn: () =>
            fetchFromPokeAPI(`/pokemon?limit=${limit}&offset=${offset}`),
    });
};

export const usePokemonSpecies = (nameOrId) => {
    return useQuery({
        queryKey: ["pokemonSpecies", nameOrId],
        queryFn: () => fetchFromPokeAPI(`/pokemon-species/${nameOrId}`),
        enabled: !!nameOrId,
    });
};

export const usePokemonTypes = () => {
    return useQuery({
        queryKey: ["pokemonTypes"],
        queryFn: () => fetchFromPokeAPI("/type"),
    });
};

export const usePokemonType = (typeName) => {
    return useQuery({
        queryKey: ["pokemonType", typeName],
        queryFn: () => fetchFromPokeAPI(`/type/${typeName}`),
        enabled: !!typeName,
    });
};

export const usePokemonTypesBatch = (typeNames) => {
    return useQuery({
        queryKey: ["pokemonTypesBatch", typeNames],
        queryFn: async () => {
            if (!typeNames || typeNames.length === 0) return [];

            const promises = typeNames.map((typeName) =>
                fetchFromPokeAPI(`/type/${typeName}`),
            );
            return Promise.all(promises);
        },
        enabled: Array.isArray(typeNames) && typeNames.length > 0,
    });
};

export const usePokemonNames = () => {
    return useQuery({
        queryKey: ["pokemonNames"],
        queryFn: async () => {
            const data = await fetchFromPokeAPI("/pokemon?limit=2000");
            return data.results
                .map((pokemon) => ({
                    name: pokemon.name,
                    url: pokemon.url,
                    id: parseInt(pokemon.url.split("/").slice(-2, -1)[0], 10),
                }))
                .sort((a, b) => a.name.localeCompare(b.name));
        },
        staleTime: 1000 * 60 * 60 * 24, // Cache por 24 horas
        cacheTime: 1000 * 60 * 60 * 24 * 7, // Mantener en cache por 1 semana
    });
};

export const usePokemonSearch = (searchTerm) => {
    return useQuery({
        queryKey: ["pokemonSearch", searchTerm?.toLowerCase()?.trim()],
        queryFn: async () => {
            if (!searchTerm || searchTerm.trim().length === 0) return null;

            try {
                const pokemon = await fetchFromPokeAPI(
                    `/pokemon/${searchTerm.toLowerCase().trim()}`,
                );
                return [pokemon];
            } catch (_error) {
                return [];
            }
        },
        enabled: !!searchTerm && searchTerm.trim().length > 0,
        retry: false, 
        refetchOnWindowFocus: false,
        refetchOnMount: true,
    });
};

export const usePokemonBatch = (pokemonList) => {
    return useQuery({
        queryKey: ["pokemonBatch", pokemonList],
        queryFn: async () => {
            const promises = pokemonList.map((nameOrId) =>
                fetchFromPokeAPI(`/pokemon/${nameOrId}`),
            );
            return Promise.all(promises);
        },
        enabled: Array.isArray(pokemonList) && pokemonList.length > 0,
    });
};
