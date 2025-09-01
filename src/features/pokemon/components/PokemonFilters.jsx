import { Button } from "@/components/common/Buttons/Button";
import { TypeFilterChips } from "@/components/common/FilterChips";
import PokemonAutocomplete from "@/features/pokemon/components/PokemonAutocomplete";

const PokemonFilters = ({
    searchTerm,
    activeTypes,
    sortBy,
    sortOrder,
    hasActiveFilters,
    onSearchChange,
    onTypesChange,
    onSortByChange,
    onSortOrderChange,
    onClearAllFilters,
    allTypes = [],
    isLoadingTypes = false,
    showFilters = true,
    selectedPokemon = [],
    maxSelection = null,
    showTeamActions = true,
    allPokemonCount = 0,
}) => {
    return (
        <div className="pokemon-list-controls flex flex-col gap-2">
            <div className="flex w-full justify-between">
                <PokemonAutocomplete
                    value={searchTerm}
                    onChange={onSearchChange}
                    placeholder="Buscar Pokémon por nombre..."
                    className="w-full max-w-md"
                />
                {showTeamActions && maxSelection && (
                    <div className="py-2 text-sm text-gray-600 flex gap-2">
                        <span>
                            Pokémon seleccionados: {selectedPokemon.length}/
                            {maxSelection}
                        </span>
                        <span>Total: {allPokemonCount} Pokémon</span>
                    </div>
                )}
            </div>

            {showFilters && (
                <div className="flex flex-col gap-2">
                    <div>
                        <span className="text-sm font-medium text-gray-700 mb-2 block">
                            Filtrar por tipo:
                        </span>
                        <TypeFilterChips
                            pokemonTypes={allTypes}
                            activeTypes={activeTypes}
                            onTypesChange={(types) => onTypesChange(types)}
                            loading={isLoadingTypes}
                        />
                    </div>

                    <div className="flex gap-4 items-center">
                        <div className="flex gap-2 items-center">
                            <span className="text-sm font-medium text-gray-700">
                                Ordenar por:
                            </span>
                            <select
                                value={sortBy}
                                onChange={(e) => onSortByChange(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                            >
                                <option value="default">Sin ordenar</option>
                                <option value="id">ID</option>
                                <option value="name">Nombre</option>
                                <option value="hp">HP</option>
                                <option value="attack">Ataque</option>
                            </select>
                            {sortBy !== "default" && (
                                <Button
                                    variant="ghost"
                                    size="small"
                                    onClick={() =>
                                        onSortOrderChange(
                                            sortOrder === "asc"
                                                ? "desc"
                                                : "asc",
                                        )
                                    }
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                                >
                                    {sortOrder === "asc" ? "↑" : "↓"}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {!showFilters && hasActiveFilters && (
                <div className="bg-primary-50 border border-primary-200 rounded-lg px-3 py-1">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-primary-800">
                            <span className="font-medium">
                                Filtros activos:
                            </span>
                            {searchTerm && (
                                <span className="ml-2 bg-primary-200 px-2 py-1 rounded text-xs">
                                    Búsqueda: "{searchTerm}"
                                </span>
                            )}
                            {activeTypes.length > 0 && (
                                <span className="ml-2 bg-primary-200 px-2 py-1 rounded text-xs">
                                    Tipos:{" "}
                                    {activeTypes
                                        .map(
                                            (type) =>
                                                type.charAt(0).toUpperCase() +
                                                type.slice(1),
                                        )
                                        .join(", ")}
                                </span>
                            )}
                            {sortBy !== "default" && (
                                <span className="ml-2 bg-primary-200 px-2 py-1 rounded text-xs">
                                    Orden:{" "}
                                    {sortBy === "id"
                                        ? "ID"
                                        : sortBy === "name"
                                          ? "Nombre"
                                          : sortBy === "hp"
                                            ? "HP"
                                            : "Ataque"}{" "}
                                    ({sortOrder === "asc" ? "↑" : "↓"})
                                </span>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={onClearAllFilters}
                            className="text-primary-600 hover:text-primary-800 text-sm font-medium cursor-pointer hover:underline"
                        >
                            Limpiar todo
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PokemonFilters;
