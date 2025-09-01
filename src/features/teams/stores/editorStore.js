import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";
import { useDraftStore } from "@/features/teams/stores/draftStore";

export const useEditorStore = create((set, get) => ({
    currentTeam: {
        name: "",
        pokemon: [], // Máximo 6
        description: "",
        isEditing: false,
        editingId: null, // ID del equipo si se está editando uno existente
    },
    history: [],
    historyIndex: -1,
    hasUnsavedChanges: false,
    setTeamName: (name) =>
        set((state) => ({
            currentTeam: { ...state.currentTeam, name },
            hasUnsavedChanges: true,
        })),

    setTeamDescription: (description) =>
        set((state) => ({
            currentTeam: { ...state.currentTeam, description },
            hasUnsavedChanges: true,
        })),

    addPokemon: (pokemon) =>
        set((state) => {
            if (state.currentTeam.pokemon.length >= 6) {
                return state; // No se puede agregar más de 6 Pokémon
            }

            const newPokemon = {
                ...pokemon,
                tempId: crypto.randomUUID(),
                position: state.currentTeam.pokemon.length,
            };

            return {
                currentTeam: {
                    ...state.currentTeam,
                    pokemon: [...state.currentTeam.pokemon, newPokemon],
                },
                hasUnsavedChanges: true,
            };
        }),

    removePokemon: (pokemonId) =>
        set((state) => ({
            currentTeam: {
                ...state.currentTeam,
                pokemon: state.currentTeam.pokemon
                    .filter((p) => p.tempId !== pokemonId)
                    .map((p, index) => ({ ...p, position: index })), // Re-indexar posiciones
            },
            hasUnsavedChanges: true,
        })),

    reorderPokemon: (fromIndex, toIndex) =>
        set((state) => {
            const pokemon = [...state.currentTeam.pokemon];
            const [movedPokemon] = pokemon.splice(fromIndex, 1);
            pokemon.splice(toIndex, 0, movedPokemon);
            const reorderedPokemon = pokemon.map((p, index) => ({
                ...p,
                position: index,
            }));

            return {
                currentTeam: {
                    ...state.currentTeam,
                    pokemon: reorderedPokemon,
                },
                hasUnsavedChanges: true,
            };
        }),

    swapPokemonPositions: (fromPosition, toPosition) =>
        set((state) => {
            const updatedPokemon = state.currentTeam.pokemon.map((p) => {
                if (p.position === fromPosition) {
                    return { ...p, position: toPosition };
                } else if (p.position === toPosition) {
                    return { ...p, position: fromPosition };
                }
                return p;
            });

            return {
                currentTeam: { ...state.currentTeam, pokemon: updatedPokemon },
                hasUnsavedChanges: true,
            };
        }),
    shuffleTeam: () =>
        set((state) => {
            const shuffled = [...state.currentTeam.pokemon];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }

            const reindexed = shuffled.map((p, index) => ({
                ...p,
                position: index,
            }));

            return {
                currentTeam: { ...state.currentTeam, pokemon: reindexed },
                hasUnsavedChanges: true,
            };
        }),

    sortByAttack: () =>
        set((state) => {
            const sorted = [...state.currentTeam.pokemon].sort((a, b) => {
                const attackA =
                    a.stats?.find((s) => s.stat.name === "attack")?.base_stat ||
                    0;
                const attackB =
                    b.stats?.find((s) => s.stat.name === "attack")?.base_stat ||
                    0;
                return attackB - attackA; // Descendente
            });

            const reindexed = sorted.map((p, index) => ({
                ...p,
                position: index,
            }));

            return {
                currentTeam: { ...state.currentTeam, pokemon: reindexed },
                hasUnsavedChanges: true,
            };
        }),
    startEditing: (team = null) =>
        set({
            currentTeam: team
                ? {
                      ...team,
                      isEditing: true,
                      editingId: team.id,
                  }
                : {
                      name: "",
                      pokemon: [],
                      description: "",
                      isEditing: true,
                      editingId: null,
                  },
            hasUnsavedChanges: false,
        }),

    stopEditing: (shouldSaveDraft = true) => {
        const { currentTeam, hasUnsavedChanges } = get();
        if (
            shouldSaveDraft &&
            hasUnsavedChanges &&
            currentTeam.pokemon &&
            currentTeam.pokemon.length > 0
        ) {
            try {
                const { saveAutoDraft } = useDraftStore.getState();
                saveAutoDraft(currentTeam);
            } catch (error) {
                console.error("Error saving auto-draft:", error);
            }
        }

        set({
            currentTeam: {
                name: "",
                pokemon: [],
                description: "",
                isEditing: false,
                editingId: null,
            },
            hasUnsavedChanges: false,
        });
    },

    loadTeam: (team) =>
        set((state) => {
            if (state.currentTeam.editingId === (team.id || team.tempId)) {
                return state;
            }

            return {
                currentTeam: {
                    name: team.name || "",
                    pokemon:
                        team.pokemon?.map((pokemon, index) => ({
                            ...pokemon,
                            tempId:
                                pokemon.tempId ||
                                `${pokemon.id}_${index}_${Date.now()}`,
                            position: pokemon.position ?? index,
                        })) || [],
                    description: team.description || "",
                    isEditing: true,
                    editingId: team.id || team.tempId,
                },
                hasUnsavedChanges: false,
            };
        }),
    canSave: () => {
        const { currentTeam } = get();
        return (
            currentTeam.name.trim() !== "" && currentTeam.pokemon.length === 6
        );
    },

    getTeamSlots: () => {
        const { currentTeam } = get();
        return Array.from(
            { length: 6 },
            (_, index) =>
                currentTeam.pokemon.find((p) => p.position === index) || null,
        );
    },
    beforeNavigate: () => {
        const { currentTeam, hasUnsavedChanges } = get();

        if (
            hasUnsavedChanges &&
            currentTeam.pokemon &&
            currentTeam.pokemon.length > 0
        ) {
            try {
                const { saveAutoDraft } = useDraftStore.getState();
                const savedDraft = saveAutoDraft(currentTeam);
                return savedDraft;
            } catch (error) {
                console.error(
                    "Error saving auto-draft before navigate:",
                    error,
                );
                return null;
            }
        }
        return null;
    },
    reset: () =>
        set({
            currentTeam: {
                name: "",
                pokemon: [],
                description: "",
                isEditing: false,
                editingId: null,
            },
            history: [],
            historyIndex: -1,
            hasUnsavedChanges: false,
        }),
}));

if (process.env.NODE_ENV === "development") {
    mountStoreDevtool("editorStore", useEditorStore);
}
