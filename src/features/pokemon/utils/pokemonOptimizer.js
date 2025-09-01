export const optimizePokemonData = (pokemon, index = 0) => ({
    id: pokemon.id,
    name: pokemon.name,
    teamPosition: pokemon.teamPosition || pokemon.position + 1 || index + 1,
    sprites: {
        front_default: pokemon.sprites?.front_default,
        other: {
            "official-artwork": {
                front_default:
                    pokemon.sprites?.other?.["official-artwork"]?.front_default,
            },
        },
    },
    stats: pokemon.stats?.map((stat) => ({
        base_stat: stat.base_stat,
        stat: { name: stat.stat.name },
    })),
});
