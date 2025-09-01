import { memo } from "react";
import { Link } from "react-router-dom";
import { BattleIcon } from "@/assets/icons/BattleIcon";
import { PlusIcon } from "@/assets/icons/PlusIcon";
import { Button } from "@/components/common/Buttons/Button";

const HeroSection = memo(() => {
    return (
        <section className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Pokémon Battle
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
                Crea equipos increíbles, desafía a otros entrenadores y
                demuestra tu estrategia en combates épicos
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <Link to="/team/new">
                    <Button size="large" icon={<PlusIcon />}>
                        Crear Nuevo Equipo
                    </Button>
                </Link>
                <Link to="/battle">
                    <Button
                        variant="secondary"
                        size="large"
                        icon={<BattleIcon />}
                    >
                        Ir a Combate
                    </Button>
                </Link>
            </div>
        </section>
    );
});

HeroSection.displayName = "HeroSection";

export { HeroSection };
