import { useCallback } from "react";
import {
  battleStore,
  useBattleStore,
} from "@/features/battle/stores/battleStore";
import { useTeamStore } from "@/features/teams/stores/teamStore";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import { useToast } from "@/hooks/useToast";
import { useUIStore } from "@/stores/uiStore";

export const useBattleActions = () => {
  const battleStoreHook = useBattleStore();
  const { startBattle, resetBattle } = battleStoreHook;

  const getBattle = () => battleStoreHook.battle;

  const setupBattleDirectly = (team1, team2) => {
    battleStore.setState({
      battle: {
        isActive: true,
        team1,
        team2,
        fights: [],
        winner: null,
        status: "setup",
      },
    });
  };

  const { showSuccess, showError } = useToast();

  const { confirmModal } = useConfirmModal();

  const { setActiveScreen } = useUIStore();

  const { getTeamById } = useTeamStore();

  const getBattleResults = () => {
    return battleStoreHook.getBattleResults();
  };

  const configureBattle = useCallback(
    async (team1Id, team2Id) => {
      try {
        const team1 = getTeamById(team1Id);
        const team2 = getTeamById(team2Id);

        if (!team1 || !team2) {
          showError("No se pudieron cargar los equipos seleccionados");
          return { success: false, error: "Equipos no encontrados" };
        }

        if (!team1.pokemon || team1.pokemon.length === 0) {
          showError(`El equipo "${team1.name}" no tiene Pokémon`);
          return { success: false, error: "Equipo 1 vacío" };
        }

        if (!team2.pokemon || team2.pokemon.length === 0) {
          showError(`El equipo "${team2.name}" no tiene Pokémon`);
          return { success: false, error: "Equipo 2 vacío" };
        }

        setupBattleDirectly(team1, team2);

        showSuccess(`Batalla configurada: ${team1.name} vs ${team2.name}`);

        return {
          success: true,
          battle: { team1, team2 },
        };
      } catch (error) {
        showError("Error al configurar la batalla");
        return { success: false, error: error.message };
      }
    },
    [getTeamById, showError, showSuccess]
  );

  const initiateBattle = async () => {
    try {
      const freshBattle = getBattle();
      const storeState = battleStore.getState();

      const workingBattle =
        freshBattle.status === "idle" ? storeState.battle : freshBattle;

      if (!workingBattle.team1 || !workingBattle.team2) {
        showError("Debes configurar ambos equipos antes de iniciar");
        return { success: false, error: "Equipos no configurados" };
      }

      if (workingBattle.status !== "setup") {
        showError("La batalla ya ha sido iniciada");
        return { success: false, error: "Batalla ya iniciada" };
      }

      startBattle();

      const results = getBattleResults();

      showSuccess(
        `Batalla completada: Equipo ${
          results.winner === "team1" ? "1" : "2"
        } gana`
      );

      return { success: true, results };
    } catch (error) {
      showError("Error al iniciar la batalla");
      return { success: false, error: error.message };
    }
  };

  const startNewBattle = () => {
    try {
      resetBattle();
      setActiveScreen("battle");
      showSuccess("Listo para nueva batalla");
      return { success: true };
    } catch (error) {
      console.error(error);
      showError(`Error al iniciar nueva batalla: ${errore}`);
      return { success: false, error: error.message };
    }
  };

  return {
    configureBattle,
    initiateBattle,
    startNewBattle,
    getBattleResults,
    battle: getBattle(),
    isActive: getBattle().isActive,
    status: getBattle().status,
    results: getBattleResults(),
    confirmModal,
  };
};
