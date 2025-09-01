import { useMemo } from "react";

export default function TeamBuilderStats({ pokemon }) {
    const stats = useMemo(() => {
        if (!pokemon.length) return null;

        const calculateAverage = (statName) => {
            return Math.round(
                pokemon.reduce((sum, p) => {
                    const stat = p.stats?.find((s) => s.stat.name === statName);
                    return sum + (stat?.base_stat || 0);
                }, 0) / pokemon.length,
            );
        };

        return [
            {
                name: "HP",
                value: calculateAverage("hp"),
                color: "text-red-600",
            },
            {
                name: "ATK",
                value: calculateAverage("attack"),
                color: "text-orange-600",
            },
            {
                name: "DEF",
                value: calculateAverage("defense"),
                color: "text-blue-600",
            },
            {
                name: "SPD",
                value: calculateAverage("speed"),
                color: "text-green-600",
            },
        ];
    }, [pokemon]);

    if (!stats) return null;

    return (
        <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2 text-center">
                Estadísticas del equipo (Promedio)
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {stats.map(({ name, value, color }) => (
                    <div key={name} className="text-center">
                        <div className={`text-lg font-bold ${color}`}>
                            {value}
                        </div>
                        <div className="text-gray-600">{name}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
