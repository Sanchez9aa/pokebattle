import { useMemo } from "react";

export default function TeamHeader({ id, teamName }) {
    const headerText = useMemo(() => {
        return id
            ? `Editando: ${teamName || "Equipo sin nombre"}`
            : "Crear Nuevo Equipo";
    }, [id, teamName]);

    const descriptionText = useMemo(() => {
        return id
            ? "Modifica tu equipo agregando o quitando Pokémon"
            : "Selecciona hasta 6 Pokémon para formar tu equipo perfecto";
    }, [id]);

    return (
        <div className="flex gap-2 items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {headerText}
            </h1>
            <p className="text-gray-600">{descriptionText}</p>
        </div>
    );
}
