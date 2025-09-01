export default function TeamBuilderHeader({ filledSlots, maxSlots }) {
    const availableSlots = maxSlots - filledSlots;

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-800">
                    Equipo Actual
                </h3>
                <div className="text-sm text-gray-600">
                    {filledSlots}/{maxSlots} sitios ocupados
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-2 text-blue-600">
                    {availableSlots > 0 && (
                        <>
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <span>
                                {availableSlots} sitio
                                {availableSlots > 1 ? "s" : ""} libre
                                {availableSlots > 1 ? "s" : ""}
                            </span>
                        </>
                    )}
                    {filledSlots > 1 && (
                        <div className="flex flex-1 justify-end w-full items-center gap-2 text-purple-600">
                            <span className="text-sm">
                                Arrastra o mantén presionado los Pokémon para
                                cambiar su orden de batalla
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
