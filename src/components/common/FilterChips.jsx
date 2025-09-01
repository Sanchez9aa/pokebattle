import { Button } from "@/components/common/Buttons/Button";
import { typeColors } from "@/config/constants";

export function TypeFilterChips({
    pokemonTypes = [],
    activeTypes = [],
    onTypesChange,
    loading = false,
    className = "",
}) {
    const formatTypeName = (type) => {
        return type.charAt(0).toUpperCase() + type.slice(1);
    };

    if (loading) {
        return (
            <div className={`type-filter-chips loading ${className}`}>
                Cargando tipos de Pokémon...
            </div>
        );
    }

    return (
        <div className={`flex flex-wrap gap-2 items-center ${className}`}>
            {pokemonTypes.map((type) => {
                const typeName = typeof type === "string" ? type : type.name;
                const isActive = activeTypes.includes(typeName);
                const backgroundColor = typeColors[typeName] || "bg-gray-400";

                return (
                    <div
                        key={typeName}
                        className={`${backgroundColor} relative px-3 py-1.5 rounded-lg text-white text-xs font-medium capitalize cursor-pointer transition-all duration-200 hover:scale-105 ${
                            isActive
                                ? "ring-2 ring-blue-400 ring-offset-1"
                                : "opacity-80 hover:opacity-100"
                        }`}
                        onClick={() => {
                            if (isActive) {
                                onTypesChange(
                                    activeTypes.filter((t) => t !== typeName),
                                );
                            } else {
                                onTypesChange([...activeTypes, typeName]);
                            }
                        }}
                        onKeyUp={(e) => {
                            if (e.key === "Enter") {
                                if (isActive) {
                                    onTypesChange(
                                        activeTypes.filter(
                                            (t) => t !== typeName,
                                        ),
                                    );
                                } else {
                                    onTypesChange([...activeTypes, typeName]);
                                }
                            }
                        }}
                    >
                        {formatTypeName(typeName)}
                        {isActive && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold leading-none">
                                ✕
                            </span>
                        )}
                    </div>
                );
            })}

            {activeTypes.length > 0 && (
                <Button
                    variant="ghost"
                    size="small"
                    onClick={() => onTypesChange([])}
                    className="px-3 py-1.5 bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-medium hover:bg-red-200 transition-colors"
                >
                    ✕ Limpiar ({activeTypes.length})
                </Button>
            )}
        </div>
    );
}
