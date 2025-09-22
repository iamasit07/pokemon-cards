import { X } from "lucide-react"

export function TypeSelector({ types, selectedTypes, onTypesChange, loading = false, disabled = false }) {
    const capitalizeFirst = (str) => {
        if (!str || typeof str !== 'string') return str || 'Unknown'
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    const toggleType = (type) => {
        if (selectedTypes.includes(type)) {
            onTypesChange(selectedTypes.filter((t) => t !== type))
        } else {
            onTypesChange([...selectedTypes, type])
        }
    }

    const clearAll = () => {
        onTypesChange([])
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-black">Filter by Type</h2>
                <div className="flex items-center gap-2">
                    {disabled && (
                        <span className="text-sm text-gray-500">Disabled when filtering by generation</span>
                    )}
                    {selectedTypes.length > 0 && !disabled && (
                        <button
                            onClick={clearAll}
                            className="text-gray-600 hover:text-black bg-transparent border border-gray-300 hover:border-gray-400 px-3 py-1 rounded-md text-sm transition-colors duration-200 flex items-center gap-1"
                        >
                            <X className="w-4 h-4" />
                            Clear All
                        </button>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {loading ? (
                    <div className="flex items-center gap-2 text-gray-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        Loading types...
                    </div>
                ) : (
                    types.map((type) => (
                        <button
                            key={type}
                            onClick={() => !disabled && toggleType(type)}
                            disabled={disabled}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${disabled
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                                : selectedTypes.includes(type)
                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                    : "bg-white text-black border border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                                }`}
                        >
                            {capitalizeFirst(type)}
                        </button>
                    ))
                )}
            </div>

            {selectedTypes.length > 0 && (
                <p className="text-sm text-gray-600">
                    Showing Pokémon of type: {selectedTypes.map(capitalizeFirst).join(", ")}
                </p>
            )}
        </div>
    )
}