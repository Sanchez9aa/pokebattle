import TeamBuilderHeader from "@/features/teams/components/TeamBuilder/components/TeamBuilderHeader";
import TeamBuilderStats from "@/features/teams/components/TeamBuilder/components/TeamBuilderStats";
import TeamSlot from "@/features/teams/components/TeamSlot";
import { useDragAndDrop } from "@/features/teams/hooks/useDragAndDrop";
import { useEditorStore } from "@/features/teams/stores/editorStore";

const TeamBuilder = ({ className = "", showHeader = true, maxSlots = 6 }) => {
    const { currentTeam, removePokemon, swapPokemonPositions, getTeamSlots } =
        useEditorStore();

    const teamSlots = getTeamSlots();
    const filledSlots = currentTeam.pokemon.length;
    const { getDragProps } = useDragAndDrop(
        teamSlots,
        swapPokemonPositions,
        maxSlots,
    );

    const handleRemovePokemon = (slotIndex) => {
        const pokemon = teamSlots[slotIndex];
        if (pokemon) {
            removePokemon(pokemon.tempId);
        }
    };

    return (
        <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
            {showHeader && (
                <TeamBuilderHeader
                    filledSlots={filledSlots}
                    maxSlots={maxSlots}
                />
            )}

            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-6 justify-items-center">
                {Array.from({ length: maxSlots }, (_, index) => {
                    const pokemon = teamSlots[index];
                    const dragProps = getDragProps(index);

                    return (
                        <div key={index} {...dragProps}>
                            <TeamSlot
                                pokemon={pokemon}
                                slotIndex={index}
                                onRemove={pokemon ? handleRemovePokemon : null}
                                showPosition={true}
                                size="large"
                                className={dragProps.slotClassName}
                            />
                        </div>
                    );
                })}
            </div>

            <div>
                <TeamBuilderStats pokemon={currentTeam.pokemon} />
            </div>
        </div>
    );
};

export default TeamBuilder;
