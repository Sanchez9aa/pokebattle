import { lazy, Suspense, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/common/Buttons/Button";
import PokemonListSkeleton from "@/features/teams/components/PokemonListSkeleton";
import TeamBuilder from "@/features/teams/components/TeamBuilder/TeamBuilder";
import TeamHeader from "@/features/teams/components/TeamEditorPage/components/TeamHeader";
import TeamRequirements from "@/features/teams/components/TeamEditorPage/components/TeamRequirements";
import {
    useTeamEditor,
    useTeamEditorCleanup,
} from "@/features/teams/hooks/useTeamEditor";
import { useTeamSave } from "@/features/teams/hooks/useTeamSave";
import { useEditorStore } from "@/features/teams/stores/editorStore";

const PokemonList = lazy(
    () => import("@/features/pokemon/components/PokemonList"),
);

function TeamEditorPage() {
    const { id } = useParams();
    const { currentTeam, setTeamName, addPokemon, removePokemon, canSave } =
        useEditorStore();
    useTeamEditor(id);
    const { wasSavedRef } = useTeamEditorCleanup();
    const { handleSaveTeam, isSaving } = useTeamSave(id);
    const [showFilters, setShowFilters] = useState(false);
    const canSaveTeam = canSave();

    const handlePokemonSelect = useCallback(
        (pokemon) => {
            const isInTeam = currentTeam.pokemon.find(
                (p) => p.id === pokemon.id,
            );

            if (isInTeam) {
                removePokemon(isInTeam.tempId);
            } else if (currentTeam.pokemon.length < 6) {
                addPokemon(pokemon);
            }
        },
        [currentTeam.pokemon, removePokemon, addPokemon],
    );

    const handleSave = async () => {
        const success = await handleSaveTeam();
        if (success) {
            wasSavedRef.current = true;
        }
    };

    return (
        <div className="max-w-7xl flex flex-col gap-4 mx-auto">
            <TeamHeader id={id} teamName={currentTeam.name} />

            <div className="bg-white rounded-xl shadow-sm">
                <div className="p-2 px-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Seleccionar Pokémon
                        </h2>
                        <Button
                            variant="ghost"
                            size="small"
                            onClick={() => setShowFilters(!showFilters)}
                            className="inline-flex items-center gap-2"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707v4.586l-4-2V9.414a1 1 0 00-.293-.707L3.293 4.293A1 1 0 013 4z"
                                />
                            </svg>
                            {showFilters ? "Ocultar" : "Mostrar"} Filtros
                        </Button>
                    </div>
                </div>

                <div className="p-6">
                    <Suspense fallback={<PokemonListSkeleton />}>
                        <PokemonList
                            onPokemonSelect={handlePokemonSelect}
                            selectedPokemon={currentTeam.pokemon}
                            maxSelection={6}
                            showTeamActions={true}
                            showFilters={showFilters}
                            compactMode={true}
                        />
                    </Suspense>
                </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
                <TeamRequirements
                    teamName={currentTeam.name}
                    pokemonCount={currentTeam.pokemon.length}
                    canSave={canSaveTeam}
                />

                <div className="flex flex-col sm:flex-row gap-4 items-end">
                    <div className="flex-1">
                        <label
                            htmlFor="teamName"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Nombre del equipo
                        </label>
                        <input
                            type="text"
                            id="teamName"
                            value={currentTeam.name}
                            onChange={(e) => setTeamName(e.target.value)}
                            placeholder="Mi equipo épico"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="primary"
                            disabled={!canSaveTeam || isSaving}
                            onClick={handleSave}
                            title={
                                !canSaveTeam
                                    ? "Completa los requisitos para guardar el equipo"
                                    : ""
                            }
                        >
                            {isSaving
                                ? "Guardando..."
                                : id
                                  ? "Actualizar Equipo"
                                  : "Guardar Equipo"}
                        </Button>
                    </div>
                </div>
            </div>

            <TeamBuilder className="mb-4" />
        </div>
    );
}

export default TeamEditorPage;
