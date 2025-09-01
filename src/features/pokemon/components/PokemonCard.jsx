import { memo, useCallback } from "react";
import { VerifiedIcon } from "@/assets/icons/VerifiedIcon";
import { IconButton } from "@/components/common/Buttons/IconButton";
import { typeColors } from "@/config/constants";
import {
  extractPokemonSprites,
  extractPokemonStats,
  extractPokemonTypes,
} from "@/features/pokemon/utils/extractors";
import { CloseIcon } from "@/assets/icons/CloseIcon";
import { PlusIcon } from "@/assets/icons/PlusIcon";

const PokemonCard = memo(
  ({ pokemon, isInTeam = false, onToggleTeam, teamCount = 0 }) => {
    const isTeamFull = teamCount >= 6;
    const handleToggleTeam = useCallback(() => {
      if (onToggleTeam && (!isTeamFull || isInTeam)) {
        onToggleTeam(pokemon);
      }
    }, [onToggleTeam, pokemon, isTeamFull, isInTeam]);

    if (!pokemon) return null;

    const stats = extractPokemonStats(pokemon);
    const types = extractPokemonTypes(pokemon);
    const sprites = extractPokemonSprites(pokemon);

    return (
      <article
        className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 overflow-hidden"
        aria-label={`${pokemon.name} pokemon card`}
      >
        <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-6">
          <img
            src={
              sprites?.official_artwork ||
              sprites?.front_default ||
              "/placeholder-pokemon.png"
            }
            alt={`${pokemon.name} sprite`}
            className="w-full h-26 object-contain mx-auto transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />

          {onToggleTeam && !isInTeam && !isTeamFull && (
            <IconButton
              variant="success"
              size="small"
              onClick={handleToggleTeam}
              className="absolute top-2 right-2 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center shadow-lg cursor-pointer"
              title="Agregar al equipo"
              aria-label={`Agregar ${pokemon.name} al equipo`}
              icon={<PlusIcon />}
            />
          )}

          {isInTeam && onToggleTeam && (
            <IconButton
              variant="danger"
              size="small"
              onClick={handleToggleTeam}
              className="absolute top-2 right-2 flex items-center justify-center shadow-lg transition-colors duration-200 cursor-pointer"
              title="Quitar del equipo"
              icon={<CloseIcon />}
            />
          )}

          {isInTeam && !onToggleTeam && (
            <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
              <VerifiedIcon />
            </div>
          )}

          <div className="absolute bottom-2 right-2 flex gap-1">
            {types.map((type) => (
              <span
                key={type}
                className={`px-2 py-1 rounded-full text-white text-xs font-medium capitalize ${
                  typeColors[type] || "bg-gray-400"
                } shadow-sm`}
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        <div className="px-3 py-2">
          <h3 className="text-lg font-semibold text-gray-900 capitalize mb-2 text-center">
            {pokemon.name}
          </h3>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex gap-3 justify-center items-center">
              <span className="text-gray-600 font-medium">HP</span>
              <span className="font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-lg">
                {stats?.hp || 0}
              </span>
            </div>
            <div className="flex gap-3 justify-center items-center">
              <span className="text-gray-600 font-medium">ATK</span>
              <span className="font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg">
                {stats?.attack || 0}
              </span>
            </div>
            <div className="flex gap-3 justify-center items-center">
              <span className="text-gray-600 font-medium">DEF</span>
              <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                {stats?.defense || 0}
              </span>
            </div>
            <div className="flex gap-3 justify-center items-center">
              <span className="text-gray-600 font-medium">SPD</span>
              <span className="font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                {stats?.speed || 0}
              </span>
            </div>
          </div>
        </div>
      </article>
    );
  }
);

PokemonCard.displayName = "PokemonCard";

export default PokemonCard;
