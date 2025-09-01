import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { optimizePokemonData } from "@/features/pokemon/utils/pokemonOptimizer";

export const useDraftStore = create(
    persist(
        (set, get) => ({
            drafts: [],
            generateDraftName: () => {
                const { drafts } = get();
                const baseName = "#Borrador";
                const draftNames = drafts
                    .map((d) => d.name)
                    .filter((name) => name.startsWith(baseName));

                if (draftNames.length === 0) {
                    return baseName;
                }
                let maxNumber = 0;
                draftNames.forEach((name) => {
                    if (name === baseName) {
                        maxNumber = Math.max(maxNumber, 1);
                    } else {
                        const match = name.match(
                            new RegExp(`^${baseName}\\s+(\\d+)$`),
                        );
                        if (match) {
                            maxNumber = Math.max(maxNumber, parseInt(match[1]));
                        }
                    }
                });

                return maxNumber === 0
                    ? baseName
                    : `${baseName} ${maxNumber + 1}`;
            },
            saveAutoDraft: (currentTeam) => {
                const {  generateDraftName } = get();
                if (!currentTeam.pokemon || currentTeam.pokemon.length === 0) {
                    return null;
                }

                const draftName = generateDraftName();
                const autoDraft = {
                    name: draftName,
                    pokemon: currentTeam.pokemon.map((pokemon, index) =>
                        optimizePokemonData(pokemon, index),
                    ),
                    battleOrder: currentTeam.pokemon.map(
                        (_, index) => index + 1,
                    ),
                    tempId: crypto.randomUUID(),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    isAutoDraft: true,
                };

                set((state) => ({
                    drafts: [...state.drafts, autoDraft],
                }));

                return autoDraft;
            },
            saveDraft: (draft) =>
                set((state) => {
                    const existingDraftIndex = state.drafts.findIndex(
                        (d) => d.tempId === draft.tempId,
                    );

                    if (existingDraftIndex >= 0) {
                        const updatedDrafts = [...state.drafts];
                        updatedDrafts[existingDraftIndex] = {
                            ...draft,
                            updatedAt: new Date().toISOString(),
                        };
                        return { drafts: updatedDrafts };
                    } else {
                        return {
                            drafts: [
                                ...state.drafts,
                                {
                                    ...draft,
                                    tempId: draft.tempId || crypto.randomUUID(),
                                    createdAt: new Date().toISOString(),
                                    updatedAt: new Date().toISOString(),
                                },
                            ],
                        };
                    }
                }),

            updateDraft: (draftId, updatedDraft) =>
                set((state) => ({
                    drafts: state.drafts.map((draft) =>
                        draft.tempId === draftId
                            ? {
                                  ...draft,
                                  ...updatedDraft,
                                  updatedAt: new Date().toISOString(),
                              }
                            : draft,
                    ),
                })),

            deleteDraft: (draftId) =>
                set((state) => ({
                    drafts: state.drafts.filter(
                        (draft) => draft.tempId !== draftId,
                    ),
                })),

            getDraftById: (draftId) => {
                const { drafts } = get();
                return drafts.find((draft) => draft.tempId === draftId);
            },
            promoteDraft: (draftId) => {
                const { drafts } = get();
                const draft = drafts.find((d) => d.tempId === draftId);
                if (draft) {
                    set((state) => ({
                        drafts: state.drafts.filter(
                            (d) => d.tempId !== draftId,
                        ),
                    }));
                    return draft;
                }
                return null;
            },
            getDraftCount: () => get().drafts.length,

            clearAllDrafts: () => set({ drafts: [] }),
            cleanOldDrafts: () =>
                set((state) => {
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

                    return {
                        drafts: state.drafts.filter(
                            (draft) =>
                                new Date(draft.updatedAt) > thirtyDaysAgo,
                        ),
                    };
                }),
        }),
        {
            name: "pokemon-drafts-storage",
            partialize: (state) => ({ drafts: state.drafts }),
        },
    ),
);

if (process.env.NODE_ENV === "development") {
    mountStoreDevtool("draftStore", useDraftStore);
}
