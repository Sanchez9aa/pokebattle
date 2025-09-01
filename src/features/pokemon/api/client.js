import { API_CONFIG } from "@/config/constants";
import { validateAndSanitizePokemon } from "@/utils/pokemonValidator";

export const fetchFromPokeAPI = async (endpoint) => {
    console.log(API_CONFIG.BASE_URL);
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`);

    if (!response.ok) {
        throw new Error(`PokeAPI error: ${response.status}`);
    }

    const data = await response.json();

    if (endpoint.includes("/pokemon/") && !endpoint.includes("?")) {
        return validateAndSanitizePokemon(data);
    }

    return data;
};
