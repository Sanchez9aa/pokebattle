import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { optimizePokemonData } from "@/features/pokemon/utils/pokemonOptimizer";

export const useTeamStore = create(
    persist(
        (set, get) => ({
            savedTeams: [],
            saveTeam: (team) => {
                try {
                    const { savedTeams, checkStorageQuota } = get();
                    checkStorageQuota();
                    if (!team.pokemon || team.pokemon.length !== 6) {
                        throw new Error("INVALID_TEAM_SIZE");
                    }
                    const existingTeam = savedTeams.find(
                        (t) =>
                            t.name.toLowerCase().trim() ===
                            team.name.toLowerCase().trim(),
                    );

                    if (existingTeam) {
                        throw new Error("DUPLICATE_TEAM_NAME");
                    }

                    const optimizedTeam = {
                        ...team,
                        pokemon: team.pokemon.map((pokemon) =>
                            optimizePokemonData(pokemon),
                        ),
                        id: crypto.randomUUID(),
                        createdAt: new Date().toISOString(),
                    };

                    set((state) => ({
                        savedTeams: [...state.savedTeams, optimizedTeam],
                    }));
                } catch (error) {
                    if (error.name === "QuotaExceededError") {
                        throw new Error("STORAGE_QUOTA_EXCEEDED");
                    }
                    if (error.message === "DUPLICATE_TEAM_NAME") {
                        throw new Error("DUPLICATE_TEAM_NAME");
                    }
                    throw error;
                }
            },

            updateTeam: (teamId, updatedTeam) => {
                try {
                    if (
                        updatedTeam.pokemon &&
                        updatedTeam.pokemon.length !== 6
                    ) {
                        throw new Error("INVALID_TEAM_SIZE");
                    }

                    const optimizedUpdate = updatedTeam.pokemon
                        ? {
                              ...updatedTeam,
                              pokemon: updatedTeam.pokemon.map((pokemon) =>
                                  optimizePokemonData(pokemon),
                              ),
                          }
                        : updatedTeam;

                    set((state) => ({
                        savedTeams: state.savedTeams.map((team) =>
                            team.id === teamId
                                ? { ...team, ...optimizedUpdate }
                                : team,
                        ),
                    }));
                } catch (error) {
                    if (error.name === "QuotaExceededError") {
                        throw new Error("STORAGE_QUOTA_EXCEEDED");
                    }
                    throw error;
                }
            },

            deleteTeam: (teamId) =>
                set((state) => ({
                    savedTeams: state.savedTeams.filter(
                        (team) => team.id !== teamId,
                    ),
                })),

            getTeamById: (teamId) => {
                const { savedTeams } = get();
                return savedTeams.find((team) => team.id === teamId);
            },
            getTeamCount: () => get().savedTeams.length,

            clearAllTeams: () => set({ savedTeams: [] }),
            cleanupOldTeams: (keepCount = 5) => {
                const { savedTeams } = get();
                if (savedTeams.length <= keepCount) return;

                const sortedTeams = [...savedTeams].sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
                );

                set({ savedTeams: sortedTeams.slice(0, keepCount) });
            },
            getStorageSize: () => {
                try {
                    const data = JSON.stringify(get().savedTeams);
                    return new Blob([data]).size;
                } catch {
                    return 0;
                }
            },
            checkStorageQuota: () => {
                try {
                    const currentSize = get().getStorageSize();
                    const MAX_SIZE = 4 * 1024 * 1024; // 4MB limit (conservative)
                    const WARNING_SIZE = MAX_SIZE * 0.8; // 80% warning

                    if (currentSize > WARNING_SIZE) {
                        console.warn(
                            `Storage usage: ${Math.round(currentSize / 1024)}KB (${Math.round((currentSize / MAX_SIZE) * 100)}%)`,
                        );

                        if (currentSize > MAX_SIZE * 0.95) {
                            get().cleanupOldTeams(3);
                            throw new Error("STORAGE_NEAR_LIMIT");
                        }
                    }
                } catch (error) {
                    if (error.message === "STORAGE_NEAR_LIMIT") {
                        throw error;
                    }
                    console.warn("Could not check storage quota:", error);
                }
            },
            getStorageUsage: () => {
                const currentSize = get().getStorageSize();
                const MAX_SIZE = 4 * 1024 * 1024;
                return Math.round((currentSize / MAX_SIZE) * 100);
            },
        }),
        {
            name: "pokemon-teams-storage",
            partialize: (state) => ({ savedTeams: state.savedTeams }),
        },
    ),
);

if (process.env.NODE_ENV === "development") {
    mountStoreDevtool("teamStore", useTeamStore);
}
