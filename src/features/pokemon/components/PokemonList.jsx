import { memo, useCallback } from "react";
import { SearchIcon } from "@/assets/icons/SearchIcon";
import { Button } from "@/components/common/Buttons/Button";
import PokemonCard from "@/features/pokemon/components/PokemonCard";
import PokemonFilters from "@/features/pokemon/components/PokemonFilters";
import PokemonSkeleton from "@/features/pokemon/components/PokemonSkeleton";
import { useInfiniteScroll } from "@/features/pokemon/hooks/useInfiniteScroll";
import { usePokemonData } from "@/features/pokemon/hooks/usePokemonData";
import { usePokemonFilters } from "@/features/pokemon/hooks/usePokemonFilters";

const PokemonList = memo(
    ({
        onPokemonSelect,
        selectedPokemon = [],
        maxSelection = null,
        showTeamActions = true,
        showFilters = true,
        itemsPerPage = 20,
        className = "",
    }) => {
        const {
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
        } = usePokemonFilters();

        const {
            allPokemonDetails,
            allTypesData,
            isLoadingList,
            isLoadingTypes,
            isLoadingAllTypes,
            isSearching,
            loadingMore,
            hasMore,
            listError,
            loadMore,
        } = usePokemonData(itemsPerPage, activeTypes, debouncedSearchTerm);
        const filteredAndSortedPokemon =
            sortAndFilterPokemon(allPokemonDetails);
        useInfiniteScroll(loadMore, hasMore, loadingMore, false);
        const handlePokemonToggle = useCallback(
            (pokemon) => {
                if (!onPokemonSelect) return;
                onPokemonSelect(pokemon);
            },
            [onPokemonSelect],
        );
        const renderPokemonCards = () => {
            return filteredAndSortedPokemon.map((pokemon) => {
                const isSelected = selectedPokemon.some(
                    (p) => p.id === pokemon.id,
                );

                return (
                    <PokemonCard
                        key={pokemon.id}
                        pokemon={pokemon}
                        isInTeam={isSelected}
                        onToggleTeam={
                            showTeamActions ? handlePokemonToggle : undefined
                        }
                        teamCount={selectedPokemon.length}
                    />
                );
            });
        };

        if (listError) {
            return (
                <div className="text-center py-8">
                    <p className="text-red-600">
                        Error al cargar la lista de Pokémon
                    </p>
                    <Button
                        onClick={() => window.location.reload()}
                        className="mt-4"
                    >
                        Reintentar
                    </Button>
                </div>
            );
        }

        return (
            <div className={`pokemon-list flex flex-col gap-3 ${className}`}>
                <PokemonFilters
                    searchTerm={searchTerm}
                    activeTypes={activeTypes}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    hasActiveFilters={hasActiveFilters}
                    onSearchChange={setSearchTerm}
                    onTypesChange={setActiveTypes}
                    onSortByChange={setSortBy}
                    onSortOrderChange={setSortOrder}
                    onClearAllFilters={clearAllFilters}
                    allTypes={allTypesData?.results || []}
                    isLoadingTypes={isLoadingAllTypes}
                    showFilters={showFilters}
                    selectedPokemon={selectedPokemon}
                    maxSelection={maxSelection}
                    showTeamActions={showTeamActions}
                    allPokemonCount={filteredAndSortedPokemon.length}
                />

                <div
                    className={`pokemon-list-container overflow-y-auto ${
                        showFilters
                            ? "max-h-[calc(100dvh-445px)]"
                            : hasActiveFilters
                              ? "max-h-[calc(100dvh-337px)]"
                              : "max-h-[calc(100dvh-300px)]"
                    }`}
                >
                    {((isLoadingList || isLoadingTypes || isSearching) &&
                        allPokemonDetails.length === 0) ||
                    (searchTerm !== debouncedSearchTerm &&
                        searchTerm.length > 0) ? (
                        <div
                            className={
                                "grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                            }
                        >
                            <PokemonSkeleton count={itemsPerPage} />
                        </div>
                    ) : filteredAndSortedPokemon.length === 0 &&
                      !isLoadingList &&
                      !isLoadingTypes &&
                      !isSearching &&
                      !loadingMore &&

                      (debouncedSearchTerm === "" ||
                          Date.now() - searchStartTime > 500) ? (
                        <div className="text-center py-8 text-gray-500">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <SearchIcon />
                            </div>
                            <p className="text-lg font-medium text-gray-900 mb-2">
                                {debouncedSearchTerm
                                    ? `No se encontró "${debouncedSearchTerm}"`
                                    : "No se encontraron Pokémon"}
                            </p>
                            <p className="text-gray-500">
                                {debouncedSearchTerm
                                    ? "Verifica que el nombre esté escrito correctamente"
                                    : "Intenta ajustar tus filtros de búsqueda"}
                            </p>
                        </div>
                    ) : (
                        <div>
                            <div
                                className={
                                    "grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                                }
                            >
                                {renderPokemonCards()}
                            </div>

                            {loadingMore && (
                                <div className="flex justify-center py-8">
                                    <div className="flex items-center space-x-2">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
                                        <span className="text-gray-600">
                                            Cargando más Pokémon...
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    },
);

PokemonList.displayName = "PokemonList";

export default PokemonList;
