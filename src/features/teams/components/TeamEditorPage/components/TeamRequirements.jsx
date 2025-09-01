export default function TeamRequirements({ teamName, pokemonCount, canSave }) {
    const completedRequirements =
        (teamName.trim() ? 1 : 0) + (pokemonCount === 6 ? 1 : 0);
    const progressPercentage = completedRequirements * 50;

    return (
        <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                    {canSave ? (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <svg
                                title="Requisitos completos"
                                className="w-4 h-4 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                    ) : (
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg
                                title="Requisitos incompletos"
                                className="w-4 h-4 text-white"
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
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-gray-900">
                            {canSave
                                ? "¡Equipo listo para guardar!"
                                : "Requisitos para crear equipo"}
                        </h4>
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-white border border-gray-200 text-gray-600">
                            {completedRequirements}/2
                        </span>
                    </div>

                    <div className="mb-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300 ease-out"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <RequirementItem
                            isCompleted={teamName.trim()}
                            text="Nombre del equipo"
                        />
                        <RequirementItem
                            isCompleted={pokemonCount === 6}
                            text="6 Pokémon seleccionados"
                            extraText={`(${pokemonCount}/6)`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function RequirementItem({ isCompleted, text, extraText }) {
    return (
        <div className="flex items-center gap-3 text-sm">
            {isCompleted ? (
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <svg
                        title="Requisito completado"
                        className="w-3 h-3 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            ) : (
                <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full" />
                </div>
            )}
            <span
                className={`font-medium ${isCompleted ? "text-green-700" : "text-gray-600"}`}
            >
                {text}
            </span>
            {extraText && (
                <span className="text-xs text-gray-500 ml-auto">
                    {extraText}
                </span>
            )}
        </div>
    );
}
