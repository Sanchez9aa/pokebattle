import { useCallback, useEffect, useMemo, useState } from "react";
import {
    usePokemonList,
    usePokemonSearch,
    usePokemonTypes,
    usePokemonTypesBatch,
} from "@/features/pokemon/api/pokeApi";

export const usePokemonData = (
    itemsPerPage = 20,
    activeTypes = [],
    debouncedSearchTerm = "",
) => {
    const [allPokemonDetails, setAllPokemonDetails] = useState([]);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [offset, setOffset] = useState(0);
    const [isLoadingDebounced, setIsLoadingDebounced] = useState(false);
    const {
        data: pokemonListData,
        isLoading: isLoadingList,
        error: listError,
    } = usePokemonList(itemsPerPage, offset);

    const { data: allTypesData, isLoading: isLoadingAllTypes } =
        usePokemonTypes();

    const { data: typesData, isLoading: isLoadingTypes } =
        usePokemonTypesBatch(activeTypes);

    const {
        data: searchedPokemon,
        isLoading: isSearching,
        error: searchError,
    } = usePokemonSearch(debouncedSearchTerm);
    const pokemonFromTypes = useMemo(() => {
        if (activeTypes.length === 0 || !typesData) return [];

        const allPokemonFromTypes = [];
        typesData.forEach((typeData) => {
            if (typeData?.pokemon) {
                typeData.pokemon.forEach((pokemonRef) => {
                    const id = parseInt(
                        pokemonRef.pokemon.url.split("/").slice(-2, -1)[0],
                    );
                    if (!allPokemonFromTypes.some((p) => p.id === id)) {
                        allPokemonFromTypes.push({
                            name: pokemonRef.pokemon.name,
                            url: pokemonRef.pokemon.url,
                            id: id,
                        });
                    }
                });
            }
        });

        return allPokemonFromTypes.sort((a, b) => a.id - b.id);
    }, [activeTypes, typesData]);
    const loadMore = useCallback(() => {
        if (!loadingMore && hasMore && !isLoadingDebounced) {
            setIsLoadingDebounced(true);
            setOffset((prev) => prev + itemsPerPage);

            setTimeout(() => {
                setIsLoadingDebounced(false);
            }, 1000);
        }
    }, [loadingMore, hasMore, isLoadingDebounced, itemsPerPage]);
    useEffect(() => {
        const loadPokemonDetails = async () => {
            let pokemonToShow = [];

            if (debouncedSearchTerm && debouncedSearchTerm.trim().length > 0) {
                if (searchedPokemon && searchedPokemon.length > 0) {
                    pokemonToShow = searchedPokemon;
                }
                setAllPokemonDetails(pokemonToShow);
                setHasMore(false);
                return;
            }

            if (activeTypes.length > 0) {
                if (pokemonFromTypes.length > 0) {
                    const pokemonToLoad = pokemonFromTypes.slice(
                        0,
                        itemsPerPage,
                    );

                    setAllPokemonDetails([]);
                    setLoadingMore(true);
                    setOffset(0);

                    try {
                        const promises = pokemonToLoad.map(async (pokemon) => {
                            const response = await fetch(pokemon.url);
                            return response.json();
                        });
                        const newDetails = await Promise.all(promises);

                        setAllPokemonDetails(newDetails);
                        setHasMore(pokemonFromTypes.length > itemsPerPage);
                    } catch (error) {
                        console.error("Error loading Pokemon details:", error);
                    } finally {
                        setLoadingMore(false);
                    }
                }
                return;
            }
            if (
                pokemonListData?.results &&
                pokemonListData.results.length > 0
            ) {
                setLoadingMore(true);

                try {
                    const promises = pokemonListData.results.map(
                        async (pokemon) => {
                            const response = await fetch(pokemon.url);
                            return response.json();
                        },
                    );
                    const newDetails = await Promise.all(promises);

                    if (offset === 0) {
                        setAllPokemonDetails(newDetails);
                    } else {
                        setAllPokemonDetails((prev) => [
                            ...prev,
                            ...newDetails,
                        ]);
                    }

                    setHasMore(!!pokemonListData.next);
                } catch (error) {
                    console.error("Error loading Pokemon details:", error);
                } finally {
                    setLoadingMore(false);
                }
            }
        };

        loadPokemonDetails();
    }, [
        pokemonListData,
        pokemonFromTypes,
        activeTypes,
        debouncedSearchTerm,
        searchedPokemon,
        itemsPerPage,
    ]);
    useEffect(() => {
        if (offset === 0) return;

        const loadMorePokemon = async () => {
            if (activeTypes.length > 0 && pokemonFromTypes.length > 0) {
                const pokemonToLoad = pokemonFromTypes.slice(
                    offset,
                    offset + itemsPerPage,
                );

                if (pokemonToLoad.length === 0) {
                    setHasMore(false);
                    return;
                }

                setLoadingMore(true);

                try {
                    const promises = pokemonToLoad.map(async (pokemon) => {
                        const response = await fetch(pokemon.url);
                        return response.json();
                    });
                    const newDetails = await Promise.all(promises);

                    setAllPokemonDetails((prev) => [...prev, ...newDetails]);
                    setHasMore(pokemonFromTypes.length > offset + itemsPerPage);
                } catch (error) {
                    console.error("Error loading more Pokemon:", error);
                } finally {
                    setLoadingMore(false);
                }
            }
        };

        loadMorePokemon();
    }, [
        offset,
        activeTypes,
        pokemonFromTypes,
        debouncedSearchTerm,
        itemsPerPage,
    ]);
    useEffect(() => {
        setOffset(0);
        if (!debouncedSearchTerm || activeTypes.length > 0) {
            setAllPokemonDetails([]);
        }
        setHasMore(true);
    }, [activeTypes, debouncedSearchTerm]);

    return {
        allPokemonDetails,
        allTypesData,
        isLoadingList,
        isLoadingTypes,
        isLoadingAllTypes,
        isSearching,
        loadingMore,
        hasMore,
        listError,
        searchError,
        loadMore,
    };
};
