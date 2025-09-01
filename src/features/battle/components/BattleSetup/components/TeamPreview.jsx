import { memo } from "react";

const TeamPreview = memo(({ team }) => (
    <div className="border border-gray-200 rounded-lg p-4 mt-4">
        <div className="grid grid-cols-6 gap-2">
            {team?.pokemon?.slice(0, 6).map((pokemon) => (
                <div key={pokemon.id} className="text-center">
                    <img
                        src={
                            pokemon.sprites?.front_default ||
                            "/placeholder-pokemon.png"
                        }
                        alt={pokemon.name}
                        className="w-12 h-12 mx-auto"
                    />
                    <span className="text-xs text-gray-500 block mt-1 truncate">
                        {pokemon.name}
                    </span>
                </div>
            ))}
        </div>
    </div>
));

TeamPreview.displayName = "TeamPreview";

export default TeamPreview;
