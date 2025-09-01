import { memo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/common/Buttons/Button";

const TeamCard = memo(({ team, isDraft = false, onPromote, onDelete }) => {
    const canFinalize = isDraft && team.pokemon && team.pokemon.length === 6;
    return (
        <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-200">
            <div
                className={`flex items-start ${isDraft ? "flex-col gap-2" : ""}`}
            >
                <div className="flex-1">
                    <h3
                        title={team.name}
                        className="text-xl font-semibold text-gray-900 line-clamp-1"
                    >
                        {team.name}
                    </h3>
                    {isDraft && team.pokemon && team.pokemon.length < 6 && (
                        <p className="text-sm text-amber-600 font-medium">
                            Faltan {6 - team.pokemon.length} Pokémon para
                            completar
                        </p>
                    )}
                </div>
                <div
                    className={`flex gap-2 ${isDraft ? "justify-end w-full mb-2" : ""}`}
                >
                    {isDraft && (
                        <Button
                            variant="secondary"
                            size="small"
                            disabled={!canFinalize}
                            onClick={() => onPromote(team.tempId)}
                            title={
                                canFinalize
                                    ? "Finalizar borrador"
                                    : "Necesitas 6 Pokémon para finalizar"
                            }
                        >
                            Finalizar
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="small"
                        onClick={() =>
                            onDelete(isDraft ? team.tempId : team.id)
                        }
                        className="text-red-600 hover:text-red-800"
                    >
                        Eliminar
                    </Button>
                </div>
            </div>

            <div className="flex -space-x-2 mb-6">
                {team.pokemon.slice(0, 6).map((pokemon, index) => (
                    <div
                        key={`${pokemon.id}-${index}`}
                        className="relative w-14 h-14 rounded-full border-3 border-white bg-gray-50 flex items-center justify-center overflow-hidden shadow-sm"
                        title={`#${pokemon.teamPosition || index + 1} - ${pokemon.name}`}
                    >
                        <img
                            src={
                                pokemon.sprites?.other?.["official-artwork"]
                                    ?.front_default ||
                                pokemon.sprites?.front_default ||
                                "/placeholder-pokemon.png"
                            }
                            alt={pokemon.name}
                            className="w-10 h-10"
                            loading="lazy"
                        />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                            {pokemon.teamPosition || index + 1}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex gap-3 pt-2">
                <Link to="/battle" className="flex-1">
                    <Button variant="primary" fullWidth size="medium">
                        Ir a Combate
                    </Button>
                </Link>
                <Link to={`/team/edit/${isDraft ? team.tempId : team.id}`}>
                    <Button variant="secondary" size="medium">
                        Editar
                    </Button>
                </Link>
            </div>
        </div>
    );
});

TeamCard.displayName = "TeamCard";

export { TeamCard };
