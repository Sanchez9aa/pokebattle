import { useMemo } from "react";

const FightsSummary = ({ results, battle }) => {
    const fightsList = useMemo(() => {
        return results.fights.map((fight, index) => {
            const pokemon1Team = battle.team1?.name || "Team 1";
            const pokemon2Team = battle.team2?.name || "Team 2";
            const winnerTeam =
                fight.winner === "team1" ? pokemon1Team : pokemon2Team;

            return {
                fight,
                index,
                pokemon1Team,
                pokemon2Team,
                winnerTeam,
            };
        });
    }, [results.fights, battle.team1?.name, battle.team2?.name]);

    if (!fightsList.length) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    Resumen de Combates
                </h3>
                <p className="text-gray-600">No hay combates registrados.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Resumen de Combates
            </h3>
            <div className="grid gap-4">
                {fightsList.map(
                    ({
                        fight,
                        index,
                        pokemon1Team,
                        pokemon2Team,
                        winnerTeam,
                    }) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                            <div className="flex items-center space-x-4">
                                <span className="text-sm font-medium text-gray-500">
                                    Combate {fight.fightNumber}
                                </span>
                                <div className="flex items-center space-x-2">
                                    <img
                                        src={
                                            fight.pokemon1.sprites
                                                ?.front_default ||
                                            "/placeholder-pokemon.png"
                                        }
                                        alt={fight.pokemon1.name}
                                        className="w-8 h-8"
                                    />
                                    <span className="text-sm font-medium capitalize">
                                        {fight.pokemon1.name}

                                        <span className="text-xs text-gray-500 ml-1">
                                            ({pokemon1Team})
                                        </span>
                                    </span>
                                </div>
                                <span className="text-gray-400">vs</span>
                                <div className="flex items-center space-x-2">
                                    <img
                                        src={
                                            fight.pokemon2.sprites
                                                ?.front_default ||
                                            "/placeholder-pokemon.png"
                                        }
                                        alt={fight.pokemon2.name}
                                        className="w-8 h-8"
                                    />
                                    <span className="text-sm font-medium capitalize">
                                        {fight.pokemon2.name}
                                        <span className="text-xs text-gray-500 ml-1">
                                            ({pokemon2Team})
                                        </span>
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">
                                    Ganador:
                                </span>
                                {fight.winner === "draw" ? (
                                    <span className="text-sm font-medium text-yellow-600">
                                        🤝 Empate - Ambos debilitados
                                    </span>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <img
                                            src={
                                                fight.winnerPokemon.sprites
                                                    ?.front_default ||
                                                "/placeholder-pokemon.png"
                                            }
                                            alt={fight.winnerPokemon.name}
                                            className="w-6 h-6"
                                        />
                                        <span className="text-sm font-medium text-green-600 capitalize">
                                            {fight.winnerPokemon.name}
                                            <span className="text-xs text-gray-500 ml-1">
                                                ({winnerTeam})
                                            </span>
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ),
                )}
            </div>
        </div>
    );
};

export default FightsSummary;
