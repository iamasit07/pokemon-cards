// Simple color mapping using only blue and gray tones
const TYPE_COLORS = {
    normal: "bg-gray-500",
    fire: "bg-blue-500",
    water: "bg-blue-600",
    electric: "bg-gray-600",
    grass: "bg-blue-400",
    ice: "bg-gray-400",
    fighting: "bg-blue-700",
    poison: "bg-gray-700",
    ground: "bg-blue-300",
    flying: "bg-gray-300",
    psychic: "bg-blue-800",
    bug: "bg-gray-800",
    rock: "bg-blue-200",
    ghost: "bg-gray-200",
    dragon: "bg-blue-900",
    dark: "bg-gray-900",
    steel: "bg-gray-500",
    fairy: "bg-blue-300",
}

export function PokemonCard({ pokemon }) {
    const capitalizeFirst = (str) => {
        if (!str || typeof str !== 'string') return str || 'Unknown'
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    // Add safety checks for pokemon data
    if (!pokemon) {
        return (
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <p className="text-gray-500">Pokémon data not available</p>
            </div>
        )
    }

    // Safe image source with fallbacks
    const getImageSrc = () => {
        try {
            return pokemon.sprites?.other?.["official-artwork"]?.front_default ||
                pokemon.sprites?.front_default ||
                'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjVGNUY1Ii8+Cjx0ZXh0IHg9IjY0IiB5PSI2NCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPz88L3RleHQ+Cjwvc3ZnPg=='
        } catch (e) {
            return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjVGNUY1Ii8+Cjx0ZXh0IHg9IjY0IiB5PSI2NCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPz88L3RleHQ+Cjwvc3ZnPg=='
        }
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-200 p-6">
            <div className="text-center">
                <div className="mb-4">
                    <img
                        src={getImageSrc()}
                        alt={pokemon.name || 'Unknown Pokémon'}
                        className="w-32 h-32 mx-auto object-contain"
                        crossOrigin="anonymous"
                    />
                </div>

                <h3 className="text-xl font-bold text-black mb-4">{capitalizeFirst(pokemon.name)}</h3>

                <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {pokemon.types && Array.isArray(pokemon.types) ? pokemon.types.map((type) => (
                        <span
                            key={type?.type?.name || 'unknown'}
                            className={`${TYPE_COLORS[type?.type?.name] || 'bg-gray-500'} text-white px-2 py-1 rounded-full text-xs font-medium`}
                        >
                            {capitalizeFirst(type?.type?.name)}
                        </span>
                    )) : (
                        <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            Unknown Type
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-600">Height</p>
                        <p className="font-semibold text-black">{pokemon.height ? (pokemon.height / 10).toFixed(1) : 'Unknown'} m</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Weight</p>
                        <p className="font-semibold text-black">{pokemon.weight ? (pokemon.weight / 10).toFixed(1) : 'Unknown'} kg</p>
                    </div>
                </div>
            </div>
        </div>
    )
}