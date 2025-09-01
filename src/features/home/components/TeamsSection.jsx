import { memo } from "react";
import { Link } from "react-router-dom";
import { PlusIcon } from "@/assets/icons/PlusIcon";
import { Button } from "@/components/common/Buttons/Button";
import { TeamCard } from "@/features/teams/components/TeamCard";

const TeamsSection = memo(
    ({
        title,
        teams,
        isDraft = false,
        onPromoteTeam,
        onDeleteTeam,
        showNewTeamButton = true,
    }) => {
        if (teams.length === 0) return null;

        return (
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            {title} ({teams.length})
                        </h2>
                    </div>
                    {showNewTeamButton && (
                        <Link to="/team/new">
                            <Button variant="primary" icon={<PlusIcon />}>
                                Nuevo Equipo
                            </Button>
                        </Link>
                    )}
                </div>

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {teams.map((team) => (
                        <TeamCard
                            key={isDraft ? team.tempId : team.id}
                            team={team}
                            isDraft={isDraft}
                            onPromote={onPromoteTeam}
                            onDelete={onDeleteTeam}
                        />
                    ))}
                </div>
            </div>
        );
    },
);

TeamsSection.displayName = "TeamsSection";

export { TeamsSection };
