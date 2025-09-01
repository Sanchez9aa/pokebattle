import { useCallback, useEffect, useMemo, useState } from "react";

export const usePokemonFilters = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [searchStartTime, setSearchStartTime] = useState(0);
    const [activeTypes, setActiveTypes] = useState([]);
    const [sortBy, setSortBy] = useState("default");
    const [sortOrder, setSortOrder] = useState("asc");

    useEffect(() => {
        if (searchTerm) {
            setSearchStartTime(Date.now());
        }

        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const hasActiveFilters = useMemo(() => {
        return !!(searchTerm || activeTypes.length > 0 || sortBy !== "default");
    }, [searchTerm, activeTypes.length, sortBy]);

    const clearAllFilters = useCallback(() => {
        setSearchTerm("");
        setActiveTypes([]);
        setSortBy("default");
        setSortOrder("asc");
    }, []);

    const sortAndFilterPokemon = useCallback(
        (pokemonList) => {
            if (!pokemonList.length) return [];

            const filtered = [...pokemonList];

            if (sortBy !== "default") {
                filtered.sort((a, b) => {
                    let aValue, bValue;

                    switch (sortBy) {
                        case "name":
                            aValue = a.name;
                            bValue = b.name;
                            break;
                        case "id":
                            aValue = a.id;
                            bValue = b.id;
                            break;
                        case "hp":
                            aValue =
                                a.stats.find((s) => s.stat.name === "hp")
                                    ?.base_stat || 0;
                            bValue =
                                b.stats.find((s) => s.stat.name === "hp")
                                    ?.base_stat || 0;
                            break;
                        case "attack":
                            aValue =
                                a.stats.find((s) => s.stat.name === "attack")
                                    ?.base_stat || 0;
                            bValue =
                                b.stats.find((s) => s.stat.name === "attack")
                                    ?.base_stat || 0;
                            break;
                        default:
                            return 0;
                    }

                    if (typeof aValue === "string") {
                        return sortOrder === "asc"
                            ? aValue.localeCompare(bValue)
                            : bValue.localeCompare(aValue);
                    }

                    return sortOrder === "asc"
                        ? aValue - bValue
                        : bValue - aValue;
                });
            }

            return filtered;
        },
        [sortBy, sortOrder],
    );

    return {
        searchTerm,
        debouncedSearchTerm,
        searchStartTime,
        activeTypes,
        sortBy,
        sortOrder,
        hasActiveFilters,
        setSearchTerm,
        setActiveTypes,
        setSortBy,
        setSortOrder,
        clearAllFilters,
        sortAndFilterPokemon,
    };
};
