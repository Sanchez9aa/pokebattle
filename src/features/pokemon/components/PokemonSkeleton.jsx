const PokemonSkeleton = ({ count = 1 }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden animate-pulse"
                >
                    <div className="bg-gray-100 p-4">
                        <div className="w-full h-32 bg-gray-300 rounded-md mx-auto"></div>
                    </div>

                    <div className="p-4">
                        <div className="h-6 bg-gray-300 rounded-md mb-2 w-3/4 mx-auto"></div>

                        <div className="flex justify-center gap-2 mb-4">
                            <div className="h-6 bg-gray-300 rounded-full w-16"></div>
                            <div className="h-6 bg-gray-300 rounded-full w-20"></div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-4">
                            <div className="flex justify-between">
                                <div className="h-4 bg-gray-300 rounded w-6"></div>
                                <div className="h-4 bg-gray-300 rounded w-8"></div>
                            </div>
                            <div className="flex justify-between">
                                <div className="h-4 bg-gray-300 rounded w-8"></div>
                                <div className="h-4 bg-gray-300 rounded w-8"></div>
                            </div>
                            <div className="flex justify-between">
                                <div className="h-4 bg-gray-300 rounded w-8"></div>
                                <div className="h-4 bg-gray-300 rounded w-8"></div>
                            </div>
                            <div className="flex justify-between">
                                <div className="h-4 bg-gray-300 rounded w-8"></div>
                                <div className="h-4 bg-gray-300 rounded w-8"></div>
                            </div>
                        </div>

                        <div className="h-10 bg-gray-300 rounded-lg w-full"></div>
                    </div>
                </div>
            ))}
        </>
    );
};

export default PokemonSkeleton;
