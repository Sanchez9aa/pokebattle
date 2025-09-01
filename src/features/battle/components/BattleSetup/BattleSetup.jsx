import { useState } from "react";
import { Button } from "@/components/common/Buttons/Button";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ConfirmModal } from "@/components/common/Modal";
import TeamPreview from "@/features/battle/components/BattleSetup/components/TeamPreview";
import TeamSelector from "@/features/battle/components/BattleSetup/components/TeamSelector";
import { useBattleActions } from "@/features/battle/hooks/useBattleActions";
import { useTeamStore } from "@/features/teams/stores/teamStore";

const BattleSetup = () => {
    const { savedTeams: teams } = useTeamStore();
    const { configureBattle, initiateBattle, confirmModal } =
        useBattleActions();

    const [selectedTeam1, setSelectedTeam1] = useState("");
    const [selectedTeam2, setSelectedTeam2] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    if (!teams) {
        return <div className="text-center p-8">Crea un equipo primero</div>;
    }

    const validTeams = teams?.filter(
        (team) => team.pokemon && team.pokemon.length === 6,
    );

    const handleStartBattle = async () => {
        if (
            !selectedTeam1 ||
            !selectedTeam2 ||
            selectedTeam1 === selectedTeam2
        ) {
            return;
        }

        setIsLoading(true);

        try {
            const setupResult = await configureBattle(
                selectedTeam1,
                selectedTeam2,
            );

            if (!setupResult.success) {
                return;
            }

            await new Promise((resolve) => setTimeout(resolve, 100));
            await initiateBattle();
        } catch (error) {
            console.error("Error al iniciar batalla:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid =
        selectedTeam1 && selectedTeam2 && selectedTeam1 !== selectedTeam2;

    return (
        <div className="max-w-4xl mx-auto p-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-light text-gray-900 mb-3">
                    Arena de Batalla
                </h1>
                <p className="text-gray-500">
                    Selecciona dos equipos para comenzar la batalla
                </p>
            </div>

            {validTeams.length < 2 ? (
                <div className="text-center py-16">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                        Equipos insuficientes
                    </h3>
                    <p className="text-gray-500 mb-6">
                        Necesitas al menos 2 equipos completos para iniciar una
                        batalla
                    </p>
                    <Button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                        Crear Equipos
                    </Button>
                </div>
            ) : (
                <div className="space-y-12">
                    <div className="grid md:grid-cols-2 gap-12 relative">
                        <div>
                            <TeamSelector
                                teamNumber={1}
                                selectedTeam={selectedTeam1}
                                onTeamChange={setSelectedTeam1}
                                validTeams={validTeams}
                                disabledTeamId={selectedTeam2}
                            />
                            {selectedTeam1 && (
                                <TeamPreview
                                    team={validTeams.find(
                                        (t) => t.id === selectedTeam1,
                                    )}
                                />
                            )}
                        </div>

                        <div>
                            <TeamSelector
                                teamNumber={2}
                                selectedTeam={selectedTeam2}
                                onTeamChange={setSelectedTeam2}
                                validTeams={validTeams}
                                disabledTeamId={selectedTeam1}
                            />
                            {selectedTeam2 && (
                                <TeamPreview
                                    team={validTeams.find(
                                        (t) => t.id === selectedTeam2,
                                    )}
                                />
                            )}
                        </div>

                        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block">
                            <div className="flex w-12 h-12 bg-white border-2 border-gray-300 rounded-full items-center justify-center shadow-lg">
                                <span className="text-lg font-bold text-gray-700">
                                    VS
                                </span>
                            </div>
                        </div>
                    </div>

                    {selectedTeam1 &&
                        selectedTeam2 &&
                        selectedTeam1 === selectedTeam2 && (
                            <div className="text-center">
                                <p className="text-red-600">
                                    Los equipos deben ser diferentes
                                </p>
                            </div>
                        )}

                    <div className="text-center pt-8">
                        <Button
                            onClick={handleStartBattle}
                            disabled={!isFormValid || isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center space-x-2">
                                    <LoadingSpinner size="small" />
                                    <span>Iniciando batalla...</span>
                                </div>
                            ) : (
                                "Iniciar Batalla"
                            )}
                        </Button>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={confirmModal.onClose}
                onConfirm={confirmModal.onConfirm}
                message={confirmModal.message}
                title={confirmModal.title}
                type={confirmModal.type}
                confirmText={confirmModal.confirmText}
                cancelText={confirmModal.cancelText}
            />
        </div>
    );
};

export default BattleSetup;
