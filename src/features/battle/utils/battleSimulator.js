export const simulateBattle = (team1Pokemon, team2Pokemon) => {
    const fights = [];
    const team1Active = [...team1Pokemon];
    const team2Active = [...team2Pokemon];
    let currentTeam1Index = 0;
    let currentTeam2Index = 0;
    let fightNumber = 1;

    while (
        currentTeam1Index < team1Active.length &&
        currentTeam2Index < team2Active.length
    ) {
        const pokemon1 = team1Active[currentTeam1Index];
        const pokemon2 = team2Active[currentTeam2Index];

        const fight = simulateFight(pokemon1, pokemon2, fightNumber);
        fights.push(fight);

        if (fight.winner === "team1") {
            currentTeam2Index++;
        } else if (fight.winner === "team2") {
            currentTeam1Index++;
        } else if (fight.winner === "draw") {
            currentTeam1Index++;
            currentTeam2Index++;
        }

        fightNumber++;
    }

    return fights;
};

const simulateFight = (pokemon1, pokemon2, fightNumber) => {
    const stats1 = extractStats(pokemon1);
    const stats2 = extractStats(pokemon2);

    if (pokemon1.id === pokemon2.id) {
        return {
            fightNumber,
            pokemon1,
            pokemon2,
            stats1,
            stats2,
            pokemon1Faster: stats1.speed >= stats2.speed,
            attackSequence: [],
            winner: "draw",
            winReason: "same_pokemon",
            winnerPokemon: null,
            loserPokemon: null,
        };
    }

    const pokemon1Faster = stats1.speed >= stats2.speed;
    let winner, winReason;
    const attackSequence = [];

    if (pokemon1Faster) {
        attackSequence.push({
            attacker: pokemon1.name,
            defender: pokemon2.name,
            attackStat: stats1.attack,
            defenseStat: stats2.defense,
            success: stats1.attack > stats2.defense,
        });

        if (stats1.attack > stats2.defense) {
            winner = "team1";
            winReason = "knockout_first_attack";
        } else {
            attackSequence.push({
                attacker: pokemon2.name,
                defender: pokemon1.name,
                attackStat: stats2.attack,
                defenseStat: stats1.defense,
                success: stats2.attack > stats1.defense,
            });

            if (stats2.attack > stats1.defense) {
                winner = "team2";
                winReason = "knockout_counter_attack";
            } else {
                const isSamePokemon = pokemon1.id === pokemon2.id;

                if (isSamePokemon) {
                    winner = "draw";
                    winReason = "same_pokemon";
                } else if (stats1.speed === stats2.speed) {
                    winner = "team1";
                    winReason = "first_attack_advantage";
                } else {
                    winner = pokemon1Faster ? "team1" : "team2";
                    winReason = "speed_advantage";
                }
            }
        }
    } else {
        attackSequence.push({
            attacker: pokemon2.name,
            defender: pokemon1.name,
            attackStat: stats2.attack,
            defenseStat: stats1.defense,
            success: stats2.attack > stats1.defense,
        });

        if (stats2.attack > stats1.defense) {
            winner = "team2";
            winReason = "knockout_first_attack";
        } else {
            attackSequence.push({
                attacker: pokemon1.name,
                defender: pokemon2.name,
                attackStat: stats1.attack,
                defenseStat: stats2.defense,
                success: stats1.attack > stats2.defense,
            });

            if (stats1.attack > stats2.defense) {
                winner = "team1";
                winReason = "knockout_counter_attack";
            } else {
                const isSamePokemon = pokemon1.id === pokemon2.id;

                if (isSamePokemon) {
                    winner = "draw";
                    winReason = "same_pokemon";
                } else if (stats1.speed === stats2.speed) {
                    winner = "team2";
                    winReason = "first_attack_advantage";
                } else {
                    winner = pokemon1Faster ? "team1" : "team2";
                    winReason = "speed_advantage";
                }
            }
        }
    }

    return {
        fightNumber,
        pokemon1,
        pokemon2,
        stats1,
        stats2,
        pokemon1Faster,
        attackSequence,
        winner,
        winReason,
        winnerPokemon:
            winner === "draw" ? null : winner === "team1" ? pokemon1 : pokemon2,
        loserPokemon:
            winner === "draw" ? null : winner === "team1" ? pokemon2 : pokemon1,
    };
};

const extractStats = (pokemon) => {
    const statsArray = pokemon.stats || [];
    return {
        hp: statsArray.find((s) => s.stat.name === "hp")?.base_stat || 50,
        attack:
            statsArray.find((s) => s.stat.name === "attack")?.base_stat || 50,
        defense:
            statsArray.find((s) => s.stat.name === "defense")?.base_stat || 50,
        speed: statsArray.find((s) => s.stat.name === "speed")?.base_stat || 50,
    };
};

export const determineWinner = (fights) => {
    if (fights.length === 0) return null;

    const team1Defeated = new Set();
    const team2Defeated = new Set();

    fights.forEach((fight) => {
        if (fight.winner === "team1") {
            team2Defeated.add(fight.pokemon2.name);
        } else if (fight.winner === "team2") {
            team1Defeated.add(fight.pokemon1.name);
        } else if (fight.winner === "draw") {
            team1Defeated.add(fight.pokemon1.name);
            team2Defeated.add(fight.pokemon2.name);
        }
    });

    if (team1Defeated.size < team2Defeated.size) {
        return "team1";
    } else if (team2Defeated.size < team1Defeated.size) {
        return "team2";
    } else {
        return "draw";
    }
};
