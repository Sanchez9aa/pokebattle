export const extractPokemonStats = (pokemon) => {
    if (!pokemon?.stats) return null;

    return pokemon.stats.reduce((acc, stat) => {
        acc[stat.stat.name] = stat.base_stat;
        return acc;
    }, {});
};

export const extractPokemonTypes = (pokemon) => {
    if (!pokemon?.types) return [];

    return pokemon.types.map((type) => type.type.name);
};

export const extractPokemonSprites = (pokemon) => {
    if (!pokemon?.sprites) return null;

    return {
        front_default: pokemon.sprites.front_default,
        front_shiny: pokemon.sprites.front_shiny,
        back_default: pokemon.sprites.back_default,
        back_shiny: pokemon.sprites.back_shiny,
        official_artwork:
            pokemon.sprites.other?.["official-artwork"]?.front_default,
    };
};
