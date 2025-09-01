const PokemonListSkeleton = () => (
    <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
                <div
                    key={index}
                    className="bg-gray-200 animate-pulse rounded-lg h-48"
                ></div>
            ))}
        </div>
    </div>
);

export default PokemonListSkeleton;
