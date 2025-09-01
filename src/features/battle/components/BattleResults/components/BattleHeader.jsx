import { useMemo } from "react";

const BattleHeader = ({ battle, results }) => {
    const winnerTeamName = useMemo(() => {
        return battle.winner === "draw"
            ? null
            : battle.winner === "team1"
              ? battle.team1?.name
              : battle.team2?.name;
    }, [battle.winner, battle.team1?.name, battle.team2?.name]);

    return (
        <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Resultados de Batalla
            </h1>
            {battle.status === "finished" && (
                <div
                    className={`border rounded-lg p-6 mt-6 ${
                        battle.winner === "draw"
                            ? "bg-yellow-50 border-yellow-200"
                            : "bg-green-50 border-green-200"
                    }`}
                >
                    <h2
                        className={`text-2xl font-bold ${battle.winner === "draw" ? "text-yellow-800" : "text-green-800"}`}
                    >
                        {battle.winner === "draw"
                            ? "🤝 ¡Empate!"
                            : `🏆 ${winnerTeamName} es el ganador`}
                    </h2>
                    <p
                        className={`mt-2 ${battle.winner === "draw" ? "text-yellow-600" : "text-green-600"}`}
                    >
                        {battle.winner === "draw"
                            ? `Ambos equipos se quedaron sin Pokémon después de ${results.totalFights} combates`
                            : `Batalla completada en ${results.totalFights} combates`}
                    </p>
                </div>
            )}
        </div>
    );
};

export default BattleHeader;
