import { useMemo } from "react";

const TeamStatsSection = ({ team, teamStats, teamKey, isWinner }) => {
    const alivePokemon = useMemo(
        () =>
            team?.pokemon?.filter(
                (pokemon) => !teamStats.defeatedPokemon?.includes(pokemon.name),
            ) || [],
        [team?.pokemon, teamStats.defeatedPokemon],
    );

    const defeatedPokemon = useMemo(
        () =>
            team?.pokemon?.filter((pokemon) =>
                teamStats.defeatedPokemon?.includes(pokemon.name),
            ) || [],
        [team?.pokemon, teamStats.defeatedPokemon],
    );

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {team?.name}
                {isWinner && <span className="ml-2 text-green-600">👑</span>}
            </h3>
            <div className="space-y-4">
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Pokémon vivos:</span>
                        <div className="flex flex-wrap gap-2">
                            {alivePokemon.map((pokemon) => (
                                <img
                                    key={`${teamKey}-alive-${pokemon.id}`}
                                    src={
                                        pokemon.sprites?.front_default ||
                                        "/placeholder-pokemon.png"
                                    }
                                    alt={pokemon.name}
                                    className="w-10 h-10 rounded-full border-2 border-green-500"
                                    title={`${pokemon.name} (vivo)`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">
                            Pokémon debilitados:
                        </span>
                        <div className="flex flex-wrap gap-2">
                            {defeatedPokemon.map((pokemon) => (
                                <img
                                    key={`${teamKey}-defeated-${pokemon.id}`}
                                    src={
                                        pokemon.sprites?.front_default ||
                                        "/placeholder-pokemon.png"
                                    }
                                    alt={pokemon.name}
                                    className="w-10 h-10 rounded-full border-2 border-red-500 grayscale"
                                    title={`${pokemon.name} (debilitado)`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamStatsSection;
