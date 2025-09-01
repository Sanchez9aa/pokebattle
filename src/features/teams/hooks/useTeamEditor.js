import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDraftStore } from "@/features/teams/stores/draftStore";
import { useEditorStore } from "@/features/teams/stores/editorStore";
import { useTeamStore } from "@/features/teams/stores/teamStore";
import { useToast } from "@/hooks/useToast.jsx";

export function useTeamEditor(id) {
    const navigate = useNavigate();
    const { getTeamById } = useTeamStore();
    const { getDraftById } = useDraftStore();
    const { loadTeam, startEditing } = useEditorStore();
    const { showError } = useToast();
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (isInitialized) return;

        if (id) {
            const existingTeam = getTeamById(id);
            const existingDraft = getDraftById(id);

            if (existingTeam) {
                loadTeam(existingTeam);
            } else if (existingDraft) {
                loadTeam(existingDraft);
            } else {
                showError("Equipo no encontrado");
                navigate("/");
                return;
            }
        } else {
            startEditing();
        }

        setIsInitialized(true);
    }, [
        id,
        isInitialized,
        loadTeam,
        getTeamById,
        getDraftById,
        showError,
        navigate,
        startEditing,
    ]);

    return { isInitialized };
}

export function useTeamEditorCleanup() {
    const { hasUnsavedChanges, currentTeam } = useEditorStore();
    const hasUnsavedChangesRef = useRef(false);
    const currentTeamRef = useRef(currentTeam);
    const wasSavedRef = useRef(false);

    useEffect(() => {
        hasUnsavedChangesRef.current = hasUnsavedChanges;
        currentTeamRef.current = currentTeam;
    }, [hasUnsavedChanges, currentTeam]);

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (
                hasUnsavedChanges &&
                currentTeam.pokemon &&
                currentTeam.pokemon.length > 0
            ) {
                const { beforeNavigate } = useEditorStore.getState();
                beforeNavigate();
                event.preventDefault();
                return (event.returnValue =
                    "Tienes cambios no guardados. Se creará un borrador automáticamente.");
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () =>
            window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [hasUnsavedChanges, currentTeam.pokemon]);

    useEffect(() => {
        return () => {
            if (
                hasUnsavedChangesRef.current &&
                !wasSavedRef.current &&
                currentTeamRef.current?.pokemon &&
                currentTeamRef.current.pokemon.length > 0
            ) {
                const { beforeNavigate } = useEditorStore.getState();
                beforeNavigate();
            }

            const { reset } = useEditorStore.getState();
            reset();
        };
    }, []);

    return { wasSavedRef };
}
