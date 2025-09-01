import { useMemo } from "react";
import { Button } from "@/components/common/Buttons/Button";
import BattleHeader from "@/features/battle/components/BattleResults/components/BattleHeader";
import FightsSummary from "@/features/battle/components/BattleResults/components/FightsSummary";
import TeamStatsSection from "@/features/battle/components/BattleResults/components/TeamStatsSection";
import { useBattleActions } from "@/features/battle/hooks/useBattleActions";
import { useBattleStore } from "@/features/battle/stores/battleStore";
import { useUIStore } from "@/stores/uiStore";

const BattleResults = () => {
    const { battle } = useBattleStore();

    const { getBattleResults, startNewBattle } = useBattleActions();
    const { setActiveScreen } = useUIStore();
    const results = useMemo(() => getBattleResults(), [getBattleResults]);

    if (!battle.isActive || battle.status === "idle") {
        return (
            <div className="max-w-4xl mx-auto p-6 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    No hay batalla activa
                </h1>
                <Button onClick={() => setActiveScreen("battle")}>
                    Ir a Arena de Combate
                </Button>
            </div>
        );
    }

    const handleNewBattle = () => {
        startNewBattle();
    };

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            <div className="sticky top-4 z-10 mb-6">
                <div className="flex justify-center">
                    <Button onClick={handleNewBattle}>Nueva Batalla</Button>
                </div>
            </div>

            <BattleHeader battle={battle} results={results} />

            <div className="grid md:grid-cols-2 gap-6">
                <TeamStatsSection
                    team={battle.team1}
                    teamStats={results.team1Stats}
                    teamKey="team1"
                    isWinner={battle.winner === "team1"}
                />
                <TeamStatsSection
                    team={battle.team2}
                    teamStats={results.team2Stats}
                    teamKey="team2"
                    isWinner={battle.winner === "team2"}
                />
            </div>

            <FightsSummary results={results} battle={battle} />
        </div>
    );
};

export default BattleResults;
