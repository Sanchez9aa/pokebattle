export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_POKEAPI_BASE_URL,
    ENDPOINTS: {
        POKEMON: "/pokemon",
        POKEMON_SPECIES: "/pokemon-species",
        TYPE: "/type",
    },
};

export const POKEMON_TYPES = [
    "normal",
    "fighting",
    "flying",
    "poison",
    "ground",
    "rock",
    "bug",
    "ghost",
    "steel",
    "fire",
    "water",
    "grass",
    "electric",
    "psychic",
    "ice",
    "dragon",
    "dark",
    "fairy",
    "unknown",
];

export const statsConfig = {
    hp: {
        name: "HP",
        color: "#FF5959",
        min: 1,
        max: 255,
    },
    attack: {
        name: "Ataque",
        color: "#F5AC78",
        min: 5,
        max: 190,
    },
    defense: {
        name: "Defensa",
        color: "#FAE078",
        min: 5,
        max: 250,
    },
    speed: {
        name: "Velocidad",
        color: "#FA92B2",
        min: 5,
        max: 200,
    },
    "special-attack": {
        name: "At. Especial",
        color: "#9DB7F5",
        min: 10,
        max: 194,
    },
    "special-defense": {
        name: "Def. Especial",
        color: "#A7DB8D",
        min: 20,
        max: 250,
    },
};

export const typeColors = {
    normal: "bg-gray-400",
    fire: "bg-red-500",
    water: "bg-blue-500",
    electric: "bg-yellow-400",
    grass: "bg-green-500",
    ice: "bg-blue-200",
    fighting: "bg-red-700",
    poison: "bg-purple-500",
    ground: "bg-yellow-600",
    flying: "bg-indigo-400",
    psychic: "bg-pink-500",
    bug: "bg-green-400",
    rock: "bg-yellow-800",
    ghost: "bg-purple-700",
    dragon: "bg-indigo-700",
    steel: "bg-gray-500",
    fairy: "bg-pink-300",
    dark: "bg-gray-800",
    stellar: "bg-blue-900",
    unknown: "bg-gray-500",
};

const storagePrefix = import.meta.env.VITE_STORAGE_PREFIX;

export const STORAGE_KEYS = {
    TEAMS: `${storagePrefix}_teams`,
    DRAFTS: `${storagePrefix}_drafts`,
    SETTINGS: `${storagePrefix}_settings`,
};
