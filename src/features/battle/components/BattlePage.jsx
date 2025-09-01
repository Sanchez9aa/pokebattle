import { useCallback } from "react";
import { LoaderIcon } from "react-hot-toast";
import BattleResults from "@/features/battle/components/BattleResults/BattleResults";
import BattleSetup from "@/features/battle/components/BattleSetup/BattleSetup";
import { useBattleStore } from "@/features/battle/stores/battleStore";

function BattlePage() {
    const { battle } = useBattleStore();

    const renderBattle = useCallback(() => {
        if (!battle.isActive || battle.status === "idle") {
            return <BattleSetup />;
        }

        if (battle.status === "setup" || battle.status === "fighting") {
            return <LoaderIcon />;
        }

        if (battle.status === "finished") {
            return <BattleResults />;
        }
    }, [battle]);

    return <>{renderBattle()}</>;
}

export default BattlePage;
