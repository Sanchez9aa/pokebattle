import { fireEvent, render, screen } from "@testing-library/react";
import PokemonCard from "../PokemonCard";

jest.mock("@/features/pokemon/utils/extractors", () => ({
    extractPokemonStats: jest.fn(() => ({
        hp: 35,
        attack: 55,
        defense: 40,
        speed: 90,
    })),
    extractPokemonTypes: jest.fn(() => ["electric"]),
    extractPokemonSprites: jest.fn(() => ({
        official_artwork: "https://example.com/pikachu.png",
        front_default: "https://example.com/pikachu-front.png",
    })),
}));

jest.mock("@/components/common/Buttons/IconButton", () => ({
    IconButton: ({ onClick, children, icon, title, ...props }) => (
        <button
            onClick={onClick}
            title={title}
            data-testid="icon-button"
            {...props}
        >
            {icon || children}
        </button>
    ),
}));

jest.mock("@/config/constants", () => ({
    typeColors: {
        electric: "bg-yellow-400",
    },
}));

describe("PokemonCard", () => {
    const mockPokemon = {
        id: 25,
        name: "pikachu",
        stats: [
            { stat: { name: "hp" }, base_stat: 35 },
            { stat: { name: "attack" }, base_stat: 55 },
            { stat: { name: "defense" }, base_stat: 40 },
            { stat: { name: "speed" }, base_stat: 90 },
        ],
        types: [{ type: { name: "electric" } }],
        sprites: {
            other: {
                "official-artwork": {
                    front_default: "https://example.com/pikachu.png",
                },
            },
            front_default: "https://example.com/pikachu-front.png",
        },
    };

    it("renders pokemon basic info", () => {
        render(<PokemonCard pokemon={mockPokemon} />);

        expect(screen.getByText("pikachu")).toBeInTheDocument();
        expect(screen.getByAltText("pikachu sprite")).toHaveAttribute(
            "src",
            "https://example.com/pikachu.png",
        );
    });

    it("returns null when no pokemon", () => {
        const { container } = render(<PokemonCard pokemon={null} />);
        expect(container.firstChild).toBeNull();
    });

    it("shows add button when not in team", () => {
        const mockOnToggleTeam = jest.fn();

        render(
            <PokemonCard
                pokemon={mockPokemon}
                isInTeam={false}
                onToggleTeam={mockOnToggleTeam}
                teamCount={3}
            />,
        );

        const button = screen.getByTestId("icon-button");
        expect(button).toHaveAttribute("title", "Agregar al equipo");
    });

    it("shows remove button when in team", () => {
        const mockOnToggleTeam = jest.fn();

        render(
            <PokemonCard
                pokemon={mockPokemon}
                isInTeam={true}
                onToggleTeam={mockOnToggleTeam}
                teamCount={4}
            />,
        );

        expect(screen.getByTestId("icon-button")).toHaveAttribute(
            "title",
            "Quitar del equipo",
        );
    });

    it("calls onToggleTeam when clicked", () => {
        const mockOnToggleTeam = jest.fn();

        render(
            <PokemonCard
                pokemon={mockPokemon}
                isInTeam={false}
                onToggleTeam={mockOnToggleTeam}
                teamCount={3}
            />,
        );

        fireEvent.click(screen.getByTestId("icon-button"));
        expect(mockOnToggleTeam).toHaveBeenCalledWith(mockPokemon);
    });
});
