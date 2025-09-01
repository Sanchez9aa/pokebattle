import { IconButton } from "@/components/common/Buttons/IconButton";
import {
  extractPokemonSprites,
  extractPokemonStats,
  extractPokemonTypes,
} from "@/features/pokemon/utils/extractors";

const TeamSlot = ({
  pokemon,
  slotIndex,
  onRemove,
  className = "",
  showPosition = true,
  size = "medium",
  dragProps = {},
}) => {
  const isEmpty = !pokemon;

  const sizeClasses = {
    small: {
      container: "w-16 h-20",
      image: "w-12 h-12",
      text: "text-xs",
    },
    medium: {
      container: "w-20 h-24",
      image: "w-16 h-16",
      text: "text-sm",
    },
    large: {
      container: "w-24 h-28",
      image: "w-20 h-20",
      text: "text-base",
    },
  };

  const currentSizeClasses = sizeClasses[size];

  if (isEmpty) {
    return (
      <div
        className={`
        ${currentSizeClasses.container}
        border-2 border-dashed border-gray-300 
        rounded-xl flex flex-col items-center justify-center
        bg-gradient-to-br from-gray-50 to-gray-100 
        hover:from-gray-100 hover:to-gray-200
        hover:border-gray-400 hover:shadow-md
        transition-all duration-300 ease-out
        ${className}
      `}
      >
        <div className="text-gray-400 text-2xl mb-1 transition-colors duration-200 group-hover:text-gray-600">
          +
        </div>
        {showPosition && (
          <div
            className={`text-gray-400 ${currentSizeClasses.text} font-medium transition-colors duration-200 group-hover:text-gray-600`}
          >
            Slot {slotIndex + 1}
          </div>
        )}
      </div>
    );
  }

  const stats = extractPokemonStats(pokemon);
  const sprites = extractPokemonSprites(pokemon);
  const borderColor = "border-gray-300";

  const handleRemove = (e) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(slotIndex);
    }
  };

  return (
    <div
      className={`
      relative ${currentSizeClasses.container}
      border-2 rounded-xl ${borderColor}
      bg-gradient-to-br from-white to-gray-50 
      hover:shadow-xl hover:shadow-gray-300/40
      hover:scale-105 hover:-rotate-1
      transition-all duration-300 ease-out
      group cursor-pointer overflow-hidden
      ${className}
    `}
    >
      <div
        {...dragProps}
        className={`h-full flex flex-col items-center justify-center p-1 ${
          pokemon ? "cursor-grab active:cursor-grabbing" : ""
        }`}
      >
        <img
          src={
            sprites?.official_artwork ||
            sprites?.front_default ||
            "/placeholder-pokemon.png"
          }
          alt={pokemon.name}
          className={`${currentSizeClasses.image} object-contain pointer-events-none`}
          loading="lazy"
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent text-white p-1 transform translate-y-full group-hover:translate-y-0 transition-all duration-300 ease-out backdrop-blur-sm">
        <div
          className={`${currentSizeClasses.text} font-semibold capitalize text-center truncate text-shadow-sm`}
        >
          {pokemon.name}
        </div>
        {size !== "small" && (
          <div className="flex justify-center text-xs opacity-90">
            ATK: {stats?.attack || 0}
          </div>
        )}
      </div>

      {showPosition && (
        <div className="absolute top-1 left-1 bg-gradient-to-br from-black/70 to-black/80 text-white rounded-lg text-xs px-2 py-1 pointer-events-none backdrop-blur-sm font-medium shadow-lg">
          {slotIndex + 1}
        </div>
      )}

      {onRemove && (
        <IconButton
          variant="danger"
          size="small"
          onClick={handleRemove}
          className="absolute top-1 right-1 w-5 h-5 bg-red-500 hover:bg-red-600 !text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-md opacity-100 md:opacity-0  md:group-hover:opacity-100 hover:scale-110 z-30 cursor-pointer"
          title={`Quitar ${pokemon.name}`}
          icon={"x"}
        />
      )}
    </div>
  );
};

export default TeamSlot;
