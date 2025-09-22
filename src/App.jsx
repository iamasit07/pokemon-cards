import { useState, useEffect, useCallback } from "react"
import { PokemonCard } from "./components/pokemon-card"
import { TypeSelector } from "./components/type-selector"
import { Plus } from "lucide-react"
import "./App.css"

// API endpoints
const API_BASE = "https://pokeapi.co/api/v2"
const ENDPOINTS = {
    pokemon: `${API_BASE}/pokemon`,
    type: `${API_BASE}/type`,
    species: `${API_BASE}/pokemon-species`,
    generation: `${API_BASE}/generation`,
}

export default function App() {
    const [pokemon, setPokemon] = useState([])
    const [selectedTypes, setSelectedTypes] = useState([])
    const [loading, setLoading] = useState(false)
    const [pokemonTypes, setPokemonTypes] = useState([])
    const [pokemonGenerations, setPokemonGenerations] = useState([])
    const [selectedGeneration, setSelectedGeneration] = useState("")
    const [totalPokemonCount, setTotalPokemonCount] = useState(1010)

    const fetchPokemonTypes = async () => {
        try {
            const response = await fetch(`${ENDPOINTS.type}?limit=25`)
            const data = await response.json()
            // Filter out 'unknown' and 'shadow' types which are not standard
            const standardTypes = data.results
                .filter(type => !['unknown', 'shadow'].includes(type.name))
                .map(type => type.name)
            setPokemonTypes(standardTypes)
        } catch (error) {
            console.error("Error fetching Pokemon types:", error)
            // Fallback to hardcoded types if API fails
            setPokemonTypes([
                "normal", "fire", "water", "electric", "grass", "ice",
                "fighting", "poison", "ground", "flying", "psychic", "bug",
                "rock", "ghost", "dragon", "dark", "steel", "fairy"
            ])
        }
    }

    const fetchPokemonGenerations = async () => {
        try {
            const response = await fetch(`${ENDPOINTS.generation}?limit=10`)
            const data = await response.json()
            const generations = data.results.map(gen => ({
                name: gen.name,
                displayName: gen.name.replace('generation-', 'Gen ').toUpperCase()
            }))
            setPokemonGenerations(generations)
        } catch (error) {
            console.error("Error fetching Pokemon generations:", error)
        }
    }

    const fetchTotalPokemonCount = async () => {
        try {
            const response = await fetch(`${ENDPOINTS.pokemon}?limit=1`)
            const data = await response.json()
            setTotalPokemonCount(data.count)
        } catch (error) {
            console.error("Error fetching Pokemon count:", error)
        }
    }

    const fetchRandomPokemon = useCallback(async (count = 6) => {
        setLoading(true)
        try {
            const promises = []
            for (let i = 0; i < count; i++) {
                const randomId = Math.floor(Math.random() * totalPokemonCount) + 1
                promises.push(fetch(`${ENDPOINTS.pokemon}/${randomId}`).then((res) => res.json()))
            }
            const results = await Promise.all(promises)
            return results
        } catch (error) {
            console.error("Error fetching Pokemon:", error)
            return []
        } finally {
            setLoading(false)
        }
    }, [totalPokemonCount])

    const fetchPokemonByTypes = useCallback(async (types, count = 6) => {
        setLoading(true)
        try {
            const allPokemon = []

            for (const type of types) {
                const response = await fetch(`${ENDPOINTS.type}/${type}`)
                const typeData = await response.json()
                allPokemon.push(...typeData.pokemon.map((p) => p.pokemon))
            }

            const uniquePokemon = allPokemon.filter(
                (pokemon, index, self) => index === self.findIndex((p) => p.name === pokemon.name),
            )

            const shuffled = uniquePokemon.sort(() => 0.5 - Math.random())
            const selected = shuffled.slice(0, count)

            const promises = selected.map((p) => fetch(p.url).then((res) => res.json()))
            const results = await Promise.all(promises)

            return results
        } catch (error) {
            console.error("Error fetching Pokemon by type:", error)
            return []
        } finally {
            setLoading(false)
        }
    }, [])

    const fetchPokemonByGeneration = useCallback(async (generation, count = 6) => {
        setLoading(true)
        try {
            const response = await fetch(`${ENDPOINTS.generation}/${generation}`)
            const generationData = await response.json()

            const pokemonList = generationData.pokemon_species
            const shuffled = pokemonList.sort(() => 0.5 - Math.random())
            const selected = shuffled.slice(0, count)

            // Get detailed Pokemon data
            const promises = selected.map(async (species) => {
                const pokemonResponse = await fetch(`${ENDPOINTS.pokemon}/${species.name}`)
                return pokemonResponse.json()
            })

            const results = await Promise.all(promises)
            return results
        } catch (error) {
            console.error("Error fetching Pokemon by generation:", error)
            return []
        } finally {
            setLoading(false)
        }
    }, [])

    const loadPokemon = async (isAddMore = false) => {
        let newPokemon

        if (selectedGeneration) {
            newPokemon = await fetchPokemonByGeneration(selectedGeneration, 6)
        } else if (selectedTypes.length > 0) {
            newPokemon = await fetchPokemonByTypes(selectedTypes, 6)
        } else {
            newPokemon = await fetchRandomPokemon(6)
        }

        if (isAddMore) {
            setPokemon((prev) => [...prev, ...newPokemon])
        } else {
            setPokemon(newPokemon)
        }
    }

    useEffect(() => {
        // Fetch initial data when component mounts
        const initializeApp = async () => {
            await Promise.all([
                fetchPokemonTypes(),
                fetchPokemonGenerations(),
                fetchTotalPokemonCount()
            ])
        }
        initializeApp()
    }, [])

    useEffect(() => {
        if (pokemonTypes.length > 0) {
            const loadInitialPokemon = async () => {
                let newPokemon

                if (selectedGeneration) {
                    newPokemon = await fetchPokemonByGeneration(selectedGeneration, 6)
                } else if (selectedTypes.length > 0) {
                    newPokemon = await fetchPokemonByTypes(selectedTypes, 6)
                } else {
                    newPokemon = await fetchRandomPokemon(6)
                }

                setPokemon(newPokemon)
            }

            loadInitialPokemon()
        }
    }, [selectedTypes, selectedGeneration, pokemonTypes, totalPokemonCount, fetchRandomPokemon, fetchPokemonByTypes, fetchPokemonByGeneration])

    const handleAddMore = () => {
        loadPokemon(true)
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-8">
                <header className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-black mb-2">Pokémon Explorer</h1>
                    <p className="text-gray-600 text-lg">Discover amazing Pokémon from the PokéAPI</p>
                </header>

                <div className="mb-8 space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold text-black mb-3">Filter by Generation</h2>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedGeneration("")}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${!selectedGeneration
                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                    : "bg-white text-black border border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                                    }`}
                            >
                                All Generations
                            </button>
                            {pokemonGenerations.map((gen) => (
                                <button
                                    key={gen.name}
                                    onClick={() => setSelectedGeneration(gen.name)}
                                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${selectedGeneration === gen.name
                                        ? "bg-blue-600 text-white hover:bg-blue-700"
                                        : "bg-white text-black border border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                                        }`}
                                >
                                    {gen.displayName}
                                </button>
                            ))}
                        </div>
                    </div>

                    <TypeSelector
                        types={pokemonTypes}
                        selectedTypes={selectedTypes}
                        onTypesChange={setSelectedTypes}
                        loading={pokemonTypes.length === 0}
                        disabled={!!selectedGeneration}
                    />
                </div>

                {loading && pokemon.length === 0 ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {pokemon.map((p, index) => (
                                <PokemonCard key={`${p.id}-${index}`} pokemon={p} />
                            ))}
                        </div>

                        <div className="flex justify-center">
                            <button
                                onClick={handleAddMore}
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 text-lg font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2"
                            >
                                {loading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    <Plus className="w-5 h-5" />
                                )}
                                Add More Cards
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}