import { memo } from "react";

const TeamSelector = memo(
    ({
        teamNumber,
        selectedTeam,
        onTeamChange,
        validTeams,
        disabledTeamId,
    }) => (
        <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                        {teamNumber}
                    </span>
                </div>
                <h2 className="text-xl font-medium text-gray-900">
                    Equipo {teamNumber === 1 ? "Uno" : "Dos"}
                </h2>
            </div>

            <select
                value={selectedTeam}
                onChange={(e) => onTeamChange(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
                <option value="">Elegir equipo...</option>
                {validTeams.map((team) => (
                    <option
                        key={team.id}
                        value={team.id}
                        disabled={team.id === disabledTeamId}
                    >
                        {team.name}
                    </option>
                ))}
            </select>
        </div>
    ),
);

TeamSelector.displayName = "TeamSelector";

export default TeamSelector;
