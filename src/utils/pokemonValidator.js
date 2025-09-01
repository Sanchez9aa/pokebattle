export const validatePokemon = (pokemon) => {
    if (!pokemon || typeof pokemon !== "object") {
        throw new Error("Invalid pokemon data: not an object");
    }

    const required = ["id", "name", "stats"];
    for (const field of required) {
        if (!(field in pokemon)) {
            throw new Error(`Invalid pokemon data: missing ${field}`);
        }
    }

    if (!Number.isInteger(pokemon.id) || pokemon.id <= 0) {
        throw new Error("Invalid pokemon data: id must be positive integer");
    }

    if (typeof pokemon.name !== "string" || pokemon.name.length === 0) {
        throw new Error("Invalid pokemon data: name must be non-empty string");
    }

    if (!Array.isArray(pokemon.stats)) {
        throw new Error("Invalid pokemon data: stats must be array");
    }

    const requiredStats = ["hp", "attack", "defense", "speed"];
    const statNames = pokemon.stats.map((s) => s.stat?.name).filter(Boolean);

    for (const requiredStat of requiredStats) {
        if (!statNames.includes(requiredStat)) {
            throw new Error(
                `Invalid pokemon data: missing ${requiredStat} stat`,
            );
        }
    }

    pokemon.stats.forEach((stat) => {
        if (!stat.stat?.name || typeof stat.base_stat !== "number") {
            throw new Error("Invalid pokemon data: malformed stat");
        }

        if (stat.base_stat < 0 || stat.base_stat > 300) {
            throw new Error(
                `Invalid pokemon data: stat ${stat.stat.name} out of range`,
            );
        }
    });

    return pokemon;
};

export const createFallbackPokemon = (id) => {
    return {
        id: id || 0,
        name: "unknown",
        stats: [
            { stat: { name: "hp" }, base_stat: 50 },
            { stat: { name: "attack" }, base_stat: 50 },
            { stat: { name: "defense" }, base_stat: 50 },
            { stat: { name: "speed" }, base_stat: 50 },
            { stat: { name: "special-attack" }, base_stat: 50 },
            { stat: { name: "special-defense" }, base_stat: 50 },
        ],
        sprites: {
            front_default: null,
            other: {
                "official-artwork": {
                    front_default: null,
                },
            },
        },
        types: [{ type: { name: "unknown" } }],
        height: 10,
        weight: 100,
    };
};

export const validateAndSanitizePokemon = (pokemon) => {
    try {
        return validatePokemon(pokemon);
    } catch (error) {
        console.warn(
            "Pokemon validation failed, using fallback:",
            error.message,
            pokemon,
        );
        return createFallbackPokemon(pokemon?.id);
    }
};
