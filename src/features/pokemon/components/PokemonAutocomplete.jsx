import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/common/Buttons/Button";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { usePokemonNames } from "@/features/pokemon/api/pokeApi";

const PokemonAutocomplete = ({
    value = "",
    onChange,
    placeholder = "Buscar Pokémon por nombre...",
    className = "",
    disabled = false,
}) => {
    const [inputValue, setInputValue] = useState(value);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef(null);
    const listRef = useRef(null);

    const { data: pokemonNames, isLoading } = usePokemonNames();

    const filteredPokemon = useMemo(() => {
        if (!pokemonNames || !inputValue) return [];

        const searchTerm = inputValue.toLowerCase().trim();
        if (searchTerm.length < 2) return [];

        const results = pokemonNames
            .filter((pokemon) =>
                pokemon.name.toLowerCase().includes(searchTerm),
            )
            .slice(0, 8); 

        return results;
    }, [pokemonNames, inputValue]);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const handleInputChange = (event) => {
        const newValue = event.target.value;
        setInputValue(newValue);
        setSelectedIndex(-1);
        setIsOpen(newValue.length >= 2 && filteredPokemon.length > 0);

        if (!newValue && onChange) {
            onChange("");
        }
    };

    const handleItemClick = (pokemon) => {
        const pokemonName = pokemon.name;
        setInputValue(pokemonName);
        setIsOpen(false);
        setSelectedIndex(-1);

        if (onChange) {
            onChange(pokemonName);
        }
        inputRef.current?.blur();
    };

    const handleKeyDown = (event) => {
        if (!isOpen || filteredPokemon.length === 0) {
            if (event.key === "Enter") {
                if (inputValue && onChange) {
                    onChange(inputValue.toLowerCase());
                }
            }
            return;
        }

        switch (event.key) {
            case "ArrowDown":
                event.preventDefault();
                setSelectedIndex((prev) =>
                    prev < filteredPokemon.length - 1 ? prev + 1 : prev,
                );
                break;

            case "ArrowUp":
                event.preventDefault();
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
                break;

            case "Enter":
                event.preventDefault();
                if (selectedIndex >= 0) {
                    handleItemClick(filteredPokemon[selectedIndex]);
                } else if (inputValue && onChange) {
                    onChange(inputValue.toLowerCase());
                    setIsOpen(false);
                }
                break;

            case "Escape":
                setIsOpen(false);
                setSelectedIndex(-1);
                inputRef.current?.blur();
                break;

            default:
                break;
        }
    };

    const handleBlur = (event) => {
        if (listRef.current && listRef.current.contains(event.relatedTarget)) {
            return;
        }
        setTimeout(() => setIsOpen(false), 150);
    };

    const handleFocus = () => {
        if (inputValue.length >= 2 && filteredPokemon.length > 0) {
            setIsOpen(true);
        }
    };

    const formatPokemonName = (name) => {
        return name.charAt(0).toUpperCase() + name.slice(1);
    };

    return (
        <div className={`relative ${className}`}>
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                        className="w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>

                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    placeholder={placeholder}
                    disabled={disabled || isLoading}
                    className={`
            w-full pl-10 pr-10 py-1.5 h-8 border border-gray-300 rounded-lg text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            placeholder-gray-400 transition-colors duration-200
            hover:border-gray-400 focus:hover:border-blue-500
          `}
                />

                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    {isLoading && (
                        <LoadingSpinner size="small" showText={false} />
                    )}

                    {!isLoading && inputValue && (
                        <button
                            type="button"
                            onClick={() => {
                                setInputValue("");
                                setIsOpen(false);
                                if (onChange) onChange("");
                                inputRef.current?.focus();
                            }}
                            disabled={disabled}
                            className="p-0.5 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
                            aria-label="Limpiar búsqueda"
                        >
                            <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {isOpen && filteredPokemon.length > 0 && (
                <div
                    ref={listRef}
                    className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-auto"
                >
                    {filteredPokemon.map((pokemon, index) => {
                        const isSelected = index === selectedIndex;

                        return (
                            <Button
                                key={pokemon.id}
                                type="button"
                                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-gray-100 last:border-b-0 cursor-pointer ${
                                    isSelected
                                        ? "bg-blue-50 text-blue-700"
                                        : "hover:bg-gray-50 text-gray-700"
                                }`}
                                onClick={() => handleItemClick(pokemon)}
                                onMouseEnter={() => setSelectedIndex(index)}
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm truncate">
                                        {formatPokemonName(pokemon.name)}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        #
                                        {pokemon.id.toString().padStart(3, "0")}
                                    </div>
                                </div>
                                {isSelected && (
                                    <svg
                                        className="w-4 h-4 text-blue-500 flex-shrink-0"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                )}
                            </Button>
                        );
                    })}
                </div>
            )}

            {inputValue && inputValue.length < 2 && (
                <div className="absolute z-40 w-full mt-1 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
                    <div className="flex items-center gap-2">
                        <svg
                            className="w-4 h-4 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <span>
                            Escribe al menos 2 caracteres para ver sugerencias
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PokemonAutocomplete;
