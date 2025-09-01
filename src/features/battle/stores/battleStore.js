import { create } from "zustand";
import {
  determineWinner,
  simulateBattle,
} from "@/features/battle/utils/battleSimulator";

const battleStore = create((set, get) => ({
  battle: {
    isActive: false,
    team1: null,
    team2: null,
    fights: [],
    winner: null,
    status: "idle",
  },

  setupBattle: (team1, team2) =>
    set({
      battle: {
        isActive: true,
        team1,
        team2,
        fights: [],
        winner: null,
        status: "setup",
      },
    }),

  startBattle: () =>
    set((state) => {
      const { battle } = state;
      if (!battle.team1 || !battle.team2) return state;

      const fights = simulateBattle(battle.team1.pokemon, battle.team2.pokemon);
      const winner = determineWinner(fights);

      return {
        ...state,
        battle: {
          ...battle,
          status: "finished",
          fights,
          winner,
        },
      };
    }),

  endBattle: () =>
    set((state) => ({
      battle: {
        ...state.battle,
        status: "finished",
      },
    })),

  resetBattle: () =>
    set({
      battle: {
        isActive: false,
        team1: null,
        team2: null,
        fights: [],
        winner: null,
        status: "idle",
      },
    }),

  setBattleConfig: (config) =>
    set((state) => ({
      battleConfig: { ...state.battleConfig, ...config },
    })),

  getBattleResults: () => {
    const { battle } = get();
    if (!battle.fights || battle.fights.length === 0) {
      return {
        winner: null,
        fights: [],
        team1Stats: { alive: 0, defeated: 0 },
        team2Stats: { alive: 0, defeated: 0 },
        totalFights: 0,
      };
    }

    const team1DefeatedPokemon = new Set();
    const team2DefeatedPokemon = new Set();

    battle.fights.forEach((fight) => {
      if (fight.winner === "team1") {
        team2DefeatedPokemon.add(fight.pokemon2.name);
      } else if (fight.winner === "team2") {
        team1DefeatedPokemon.add(fight.pokemon1.name);
      } else if (fight.winner === "draw") {
        team1DefeatedPokemon.add(fight.pokemon1.name);
        team2DefeatedPokemon.add(fight.pokemon2.name);
      }
    });

    const team1Total = battle.team1?.pokemon?.length || 0;
    const team2Total = battle.team2?.pokemon?.length || 0;

    const results = {
      winner: battle.winner,
      fights: battle.fights,
      team1Stats: {
        alive: team1Total - team1DefeatedPokemon.size,
        defeated: team1DefeatedPokemon.size,
        total: team1Total,
        defeatedPokemon: Array.from(team1DefeatedPokemon),
      },
      team2Stats: {
        alive: team2Total - team2DefeatedPokemon.size,
        defeated: team2DefeatedPokemon.size,
        total: team2Total,
        defeatedPokemon: Array.from(team2DefeatedPokemon),
      },
      totalFights: battle.fights.length,
      winnerPokemon: battle.fights.map((f) => f.winnerPokemon),
    };

    return results;
  },
}));

export const useBattleStore = battleStore;
export { battleStore };
