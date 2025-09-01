import { useNavigate } from "react-router-dom";
import { useDraftStore } from "@/features/teams/stores/draftStore";
import { useEditorStore } from "@/features/teams/stores/editorStore";
import { useTeamStore } from "@/features/teams/stores/teamStore";
import { useToast } from "@/hooks/useToast.jsx";
import { useUIStore } from "@/stores/uiStore";

export function useTeamSave(id) {
    const navigate = useNavigate();
    const { saveTeam, getTeamById, updateTeam } = useTeamStore();
    const { getDraftById } = useDraftStore();
    const { currentTeam, canSave } = useEditorStore();
    const { addNotification, setComponentLoading, getComponentLoading } =
        useUIStore();
    const { showSuccess, showError } = useToast();

    const isSaving = getComponentLoading("teamSave");

    const handleSaveTeam = async () => {
        if (!canSave()) return;

        setComponentLoading("teamSave", true);
        try {
            const sortedPokemon = [...currentTeam.pokemon].sort(
                (a, b) => a.position - b.position,
            );
            const pokemonWithOrder = sortedPokemon.map((pokemon) => ({
                ...pokemon,
                teamPosition: pokemon.position + 1,
                addedAt: new Date().toISOString(),
            }));

            const team = {
                name: currentTeam.name,
                pokemon: pokemonWithOrder,
                battleOrder: pokemonWithOrder.map((p) => p.id),
            };

            if (id) {
                const existingTeam = getTeamById(id);
                if (existingTeam) {
                    updateTeam(id, team);
                    showSuccess("Equipo actualizado exitosamente");
                } else {
                    const existingDraft = getDraftById(id);
                    if (existingDraft) {
                        saveTeam(team);
                        const { deleteDraft } = useDraftStore.getState();
                        deleteDraft(id);
                        showSuccess(
                            "Borrador promocionado a equipo exitosamente",
                        );
                    } else {
                        saveTeam(team);
                        showSuccess("Equipo guardado exitosamente");
                    }
                }
            } else {
                saveTeam(team);
                showSuccess("Equipo guardado exitosamente");
            }

            addNotification({
                type: "success",
                title: id ? "Equipo actualizado" : "Equipo guardado",
                message: "Orden de batalla preservado",
            });

            navigate("/");
            return true;
        } catch (error) {
            console.error("Error saving team:", error);
            handleSaveError(error);
            return false;
        } finally {
            setComponentLoading("teamSave", false);
        }
    };

    const handleSaveError = (error) => {
        let errorMessage = "No se pudo guardar el equipo";
        let errorTitle = "Error al guardar";

        if (
            error.message === "STORAGE_QUOTA_EXCEEDED" ||
            error.name === "QuotaExceededError"
        ) {
            errorTitle = "Almacenamiento lleno";
            errorMessage =
                "Has alcanzado el límite de almacenamiento. Elimina algunos equipos antiguos para continuar.";
            showError(errorMessage);
        } else if (error.message === "DUPLICATE_TEAM_NAME") {
            errorTitle = "Nombre duplicado";
            errorMessage =
                "Ya tienes un equipo con ese nombre. Elige un nombre diferente.";
            showError("Ya existe un equipo con ese nombre");
        } else if (error.message === "INVALID_TEAM_SIZE") {
            errorTitle = "Equipo incompleto";
            errorMessage =
                "Un equipo debe tener exactamente 6 Pokémon para poder guardarse.";
            showError("Necesitas 6 Pokémon para crear un equipo");
        } else {
            showError(errorMessage);
        }

        addNotification({
            type: "error",
            title: errorTitle,
            message: errorMessage,
        });
    };

    return { handleSaveTeam, isSaving };
}
