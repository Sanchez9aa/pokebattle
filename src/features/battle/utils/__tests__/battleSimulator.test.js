import { determineWinner, simulateBattle } from "../battleSimulator";

describe("Battle Simulator - Functional Logic", () => {
    const createMockPokemon = (id, name, stats) => ({
        id,
        name,
        stats: [
            { stat: { name: "hp" }, base_stat: stats.hp },
            { stat: { name: "attack" }, base_stat: stats.attack },
            { stat: { name: "defense" }, base_stat: stats.defense },
            { stat: { name: "speed" }, base_stat: stats.speed },
        ],
    });

    const pikachu = createMockPokemon(25, "pikachu", {
        hp: 35,
        attack: 55,
        defense: 40,
        speed: 90,
    });

    const charizard = createMockPokemon(6, "charizard", {
        hp: 78,
        attack: 84,
        defense: 78,
        speed: 100,
    });

    const blastoise = createMockPokemon(9, "blastoise", {
        hp: 79,
        attack: 83,
        defense: 100,
        speed: 78,
    });

    const slowpoke = createMockPokemon(79, "slowpoke", {
        hp: 90,
        attack: 65,
        defense: 65,
        speed: 15,
    });

    describe("simulateBattle", () => {
        it("should simulate a complete battle between teams", () => {
            const team1 = [pikachu];
            const team2 = [slowpoke];

            const fights = simulateBattle(team1, team2);

            expect(fights).toHaveLength(1);
            expect(fights[0]).toHaveProperty("fightNumber", 1);
            expect(fights[0]).toHaveProperty("pokemon1", pikachu);
            expect(fights[0]).toHaveProperty("pokemon2", slowpoke);
            expect(fights[0]).toHaveProperty("winner");
            expect(["team1", "team2", "draw"]).toContain(fights[0].winner);
        });

        it("should handle speed advantage correctly", () => {
            const team1 = [charizard];
            const team2 = [blastoise];

            const fights = simulateBattle(team1, team2);

            expect(fights[0].pokemon1Faster).toBe(true); 
            expect(fights[0].stats1.speed).toBeGreaterThan(
                fights[0].stats2.speed,
            );
        });

        it("should determine winner by attack vs defense", () => {
            const team1 = [charizard];
            const team2 = [slowpoke];

            const fights = simulateBattle(team1, team2);

            expect(fights[0].winner).toBe("team1");
            expect(fights[0].winReason).toBe("knockout_first_attack");
            expect(fights[0].attackSequence[0].success).toBe(true);
        });

        it("should handle draw when same pokemon fights", () => {
            const team1 = [pikachu];
            const team2 = [
                createMockPokemon(25, "pikachu", {
                    hp: 35,
                    attack: 55,
                    defense: 40,
                    speed: 90,
                }),
            ];

            const fights = simulateBattle(team1, team2);

            expect(fights[0].winner).toBe("draw");
            expect(fights[0].winReason).toBe("same_pokemon");
        });

        it("should continue battle until one team is eliminated", () => {
            const team1 = [charizard, pikachu];
            const team2 = [slowpoke, blastoise];

            const fights = simulateBattle(team1, team2);

            expect(fights.length).toBeGreaterThan(0);

            const lastFight = fights[fights.length - 1];
            expect(["team1", "team2", "draw"]).toContain(lastFight.winner);
        });
    });

    describe("determineWinner", () => {
        it("should determine team1 as winner when they have fewer defeated pokemon", () => {
            const mockFights = [
                {
                    winner: "team1",
                    pokemon1: { name: "charizard" },
                    pokemon2: { name: "slowpoke" },
                },
            ];

            const winner = determineWinner(mockFights);
            expect(winner).toBe("team1");
        });

        it("should determine draw when equal pokemon are defeated", () => {
            const mockFights = [
                {
                    winner: "draw",
                    pokemon1: { name: "pikachu" },
                    pokemon2: { name: "pikachu" },
                },
            ];

            const winner = determineWinner(mockFights);
            expect(winner).toBe("draw");
        });

        it("should return null for empty fights array", () => {
            const winner = determineWinner([]);
            expect(winner).toBeNull();
        });
    });

    describe("Battle Logic Edge Cases", () => {
        it("should handle counter-attack scenarios", () => {
            const weakAttacker = createMockPokemon(1, "weak", {
                hp: 50,
                attack: 30,
                defense: 50,
                speed: 100, 
            });

            const strongDefender = createMockPokemon(2, "strong", {
                hp: 80,
                attack: 90,
                defense: 40,
                speed: 50, 
            });

            const fights = simulateBattle([weakAttacker], [strongDefender]);

            expect(fights[0].pokemon1Faster).toBe(true); 
            expect(fights[0].attackSequence[0].success).toBe(false); 
            expect(fights[0].attackSequence[1].success).toBe(true); 
            expect(fights[0].winner).toBe("team2");
            expect(fights[0].winReason).toBe("knockout_counter_attack");
        });

        it("should handle speed tie with first attack advantage", () => {
            const pokemon1 = createMockPokemon(1, "first", {
                hp: 50,
                attack: 40,
                defense: 60,
                speed: 50,
            });

            const pokemon2 = createMockPokemon(2, "second", {
                hp: 50,
                attack: 40,
                defense: 60,
                speed: 50, 
            });

            const fights = simulateBattle([pokemon1], [pokemon2]);

            expect(fights[0].stats1.speed).toBe(fights[0].stats2.speed);
            expect(fights[0].winner).toBe("team1");
            expect(fights[0].winReason).toBe("first_attack_advantage");
        });
    });
});
