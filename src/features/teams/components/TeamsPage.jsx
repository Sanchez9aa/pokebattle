import { useCallback, useMemo } from "react";
import { EmptyState } from "@/components/common/EmptyState";
import { FeatureCard } from "@/components/common/FeatureCard";
import { ConfirmModal } from "@/components/common/Modal";
import { HeroSection } from "@/features/home/components/HeroSection";
import { TeamsSection } from "@/features/home/components/TeamsSection";
import { useDraftStore } from "@/features/teams/stores/draftStore";
import { useTeamStore } from "@/features/teams/stores/teamStore";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import { useToast } from "@/hooks/useToast.jsx";

function TeamsPage() {
    const { savedTeams, deleteTeam } = useTeamStore();
    const { drafts, deleteDraft, promoteDraft, getDraftById } = useDraftStore();
    const { showSuccess, showError } = useToast();
    const { showConfirmation, confirmModal } = useConfirmModal();

    const handleDeleteTeam = useCallback(
        (teamId) => {
            showConfirmation(
                "¿Estás seguro de que quieres eliminar este equipo?",
                () => {
                    deleteTeam(teamId);
                    showSuccess("Equipo eliminado exitosamente");
                },
                null,
                {
                    type: "danger",
                    title: "Eliminar equipo",
                    confirmText: "Eliminar",
                    cancelText: "Cancelar",
                },
            );
        },
        [deleteTeam, showConfirmation, showSuccess],
    );

    const handleDeleteDraft = useCallback(
        (draftId) => {
            showConfirmation(
                "¿Estás seguro de que quieres eliminar este borrador?",
                () => {
                    deleteDraft(draftId);
                    showSuccess("Borrador eliminado exitosamente");
                },
                null,
                {
                    type: "danger",
                    title: "Eliminar borrador",
                    confirmText: "Eliminar",
                    cancelText: "Cancelar",
                },
            );
        },
        [deleteDraft, showConfirmation, showSuccess],
    );

    const handlePromoteDraft = useCallback(
        (draftId) => {
            const draft = getDraftById(draftId);
            if (!draft) {
                showError("Borrador no encontrado");
                return;
            }
            if (!draft.pokemon || draft.pokemon.length !== 6) {
                showError(
                    "El borrador debe tener exactamente 6 Pokémon para poder finalizarse",
                );
                return;
            }

            showConfirmation(
                `¿Estás seguro de que quieres finalizar el borrador "${draft.name}"?`,
                () => {
                    try {
                        const { saveTeam } = useTeamStore.getState();
                        saveTeam({
                            name: draft.name,
                            pokemon: draft.pokemon,
                            battleOrder: draft.battleOrder,
                        });
                        promoteDraft(draftId);
                        showSuccess("Borrador promovido a equipo exitosamente");
                    } catch (error) {
                        console.error("Error promoting draft:", error);
                        if (error.message === "INVALID_TEAM_SIZE") {
                            showError(
                                "El borrador debe tener exactamente 6 Pokémon para poder finalizarse",
                            );
                        } else if (error.message === "DUPLICATE_TEAM_NAME") {
                            showError("Ya existe un equipo con ese nombre");
                        } else {
                            showError("Error al finalizar el borrador");
                        }
                    }
                },
                null,
                {
                    type: "warning",
                    title: "Finalizar borrador",
                    confirmText: "Finalizar",
                    cancelText: "Cancelar",
                },
            );
        },
        [promoteDraft, getDraftById, showSuccess, showError, showConfirmation],
    );
    const features = useMemo(
        () => [
            {
                title: "Forma tu Equipo",
                description:
                    "Elige hasta 6 Pokémon y crea la combinación perfecta",
                iconBgColor: "bg-primary-100",
                iconColor: "text-primary-600",
                icon: (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                    </svg>
                ),
            },
            {
                title: "Combates Épicos",
                description:
                    "Enfrentate a otros equipos en combates automáticos basados en estadísticas",
                iconBgColor: "bg-red-100",
                iconColor: "text-red-600",
                icon: (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                    </svg>
                ),
            },
            {
                title: "Estrategia",
                description:
                    "Analiza estadísticas, tipos y habilidades para crear la estrategia ganadora",
                iconBgColor: "bg-green-100",
                iconColor: "text-green-600",
                icon: (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                    </svg>
                ),
            },
        ],
        [],
    );

    const hasTeams = savedTeams.length > 0 || drafts.length > 0;
    const emptyStateProps = useMemo(
        () => ({
            title: "Aún no tienes equipos",
            description:
                "Crea tu primer equipo para comenzar a batallar contra otros entrenadores",
            buttonText: "Crear mi primer equipo",
            buttonLink: "/team/new",
            icon: (
                <svg
                    className="w-10 h-10 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                </svg>
            ),
            buttonIcon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                </svg>
            ),
        }),
        [],
    );

    return (
        <main className="max-w-6xl mx-auto flex flex-col gap-4 py-3">
            <HeroSection />

            <section
                className="grid md:grid-cols-3 gap-8"
                aria-label="Características principales"
            >
                {features.map((feature, index) => (
                    <FeatureCard
                        key={index}
                        title={feature.title}
                        description={feature.description}
                        icon={feature.icon}
                        iconBgColor={feature.iconBgColor}
                        iconColor={feature.iconColor}
                    />
                ))}
            </section>

            <section className="space-y-8" aria-label="Sección de equipos">
                <TeamsSection
                    title="Mis Equipos"
                    teams={savedTeams}
                    isDraft={false}
                    onPromoteTeam={handlePromoteDraft}
                    onDeleteTeam={handleDeleteTeam}
                    showNewTeamButton={true}
                />

                <TeamsSection
                    title="Borradores"
                    teams={drafts}
                    isDraft={true}
                    onPromoteTeam={handlePromoteDraft}
                    onDeleteTeam={handleDeleteDraft}
                    showNewTeamButton={false}
                />

                {!hasTeams && <EmptyState {...emptyStateProps} />}
            </section>

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={confirmModal.onClose}
                onConfirm={confirmModal.onConfirm}
                message={confirmModal.message}
                title={confirmModal.title}
                type={confirmModal.type}
                confirmText={confirmModal.confirmText}
                cancelText={confirmModal.cancelText}
            />
        </main>
    );
}

export default TeamsPage;
