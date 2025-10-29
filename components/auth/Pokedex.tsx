import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from "react-native";
import "@/global.css";
import CustomText from "../ui/CustomText";

type Pokemon = {
  id: number;
  name: string;
  image: string;
  types: string[];
};

const typeColors: Record<string, string> = {
  normal: "bg-gray-300",
  fire: "bg-red-500",
  water: "bg-blue-400",
  electric: "bg-yellow-400",
  grass: "bg-green-500",
  ice: "bg-cyan-300",
  fighting: "bg-orange-700",
  poison: "bg-purple-500",
  ground: "bg-yellow-700",
  flying: "bg-sky-300",
  psychic: "bg-pink-500",
  bug: "bg-lime-600",
  rock: "bg-stone-500",
  ghost: "bg-indigo-600",
  dragon: "bg-indigo-700",
  dark: "bg-neutral-800",
  steel: "bg-gray-400",
  fairy: "bg-pink-300",
  default: "bg-red-500",
};

const TOTAL_POKEMON = 1010; // Número total de Pokémon en la API

const Pokedex: React.FC = () => {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("mimikyu-disguised");
  const [allPokemon, setAllPokemon] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // 🔹 Cargar lista de nombres al inicio
  useEffect(() => {
    const loadAllPokemon = async () => {
      try {
        const listResponse = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=1000"
        );
        const listData = await listResponse.json();
        const names: string[] = listData.results.map((p: any) => p.name);
        setAllPokemon(names);
      } catch (err) {
        console.error("Error cargando lista de Pokémon");
      }
    };
    loadAllPokemon();
  }, []);

  // 🔹 Buscar Pokémon por nombre o ID
  const fetchPokemon = async (term: string, indexInFiltered?: number) => {
    try {
      setLoading(true);
      setError(null);

      const isNumber = /^\d+$/.test(term.trim());
      const url = isNumber
        ? `https://pokeapi.co/api/v2/pokemon/${term.trim()}`
        : `https://pokeapi.co/api/v2/pokemon/${term.trim().toLowerCase()}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Pokémon no encontrado");

      const data = await response.json();

      const pokemonData: Pokemon = {
        id: data.id,
        name: data.name,
        image: data.sprites.front_default,
        types: data.types.map((t: any) => t.type.name),
      };

      setPokemon(pokemonData);

      if (!isNumber && allPokemon.length > 0) {
        if (indexInFiltered === undefined) {
          const filtered = allPokemon.filter((n) =>
            n.toLowerCase().includes(term.toLowerCase())
          );
          setCurrentIndex(filtered.findIndex((n) => n === data.name) || 0);
        } else {
          setCurrentIndex(indexInFiltered);
        }
      }
    } catch (err) {
      if (/^\d+$/.test(term)) {
        setError("No se encontró ningún Pokémon con ese ID.");
      } else {
        findSimilarPokemon(term);
      }
      setPokemon(null);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Buscar Pokémon más parecido (solo para texto)
  const findSimilarPokemon = (term: string) => {
    if (allPokemon.length === 0) return;
    const similar =
      allPokemon.find((n) => n.toLowerCase().startsWith(term.toLowerCase())) ||
      allPokemon.find((n) => n.toLowerCase().includes(term.toLowerCase()));
    if (similar) fetchPokemon(similar);
    else {
      setError("No se encontró ningún Pokémon parecido.");
      setPokemon(null);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim() !== "") fetchPokemon(searchTerm.trim());
  };

  // 🔹 Botón siguiente
  const handleNext = () => {
    if (!pokemon) return;

    const isNumber = Number.isInteger(pokemon.id);

    if (isNumber) {
      const nextId = pokemon.id === TOTAL_POKEMON ? 1 : pokemon.id + 1;
      fetchPokemon(String(nextId));
    } else if (allPokemon.length > 0) {
      const nextIndex = (currentIndex + 1) % allPokemon.length;
      fetchPokemon(allPokemon[nextIndex], nextIndex);
    }
  };

  // 🔹 Botón anterior
  const handlePrevious = () => {
    if (!pokemon) return;

    const isNumber = Number.isInteger(pokemon.id);

    if (isNumber) {
      const prevId = pokemon.id === 1 ? TOTAL_POKEMON : pokemon.id - 1;
      fetchPokemon(String(prevId));
    } else if (allPokemon.length > 0) {
      const prevIndex =
        (currentIndex - 1 + allPokemon.length) % allPokemon.length;
      fetchPokemon(allPokemon[prevIndex], prevIndex);
    }
  };

  const getBackgroundColor = () => {
    if (!pokemon || pokemon.types.length === 0) return typeColors.default;
    const mainType = pokemon.types[0];
    return typeColors[mainType] || typeColors.default;
  };

  useEffect(() => {
    if (allPokemon.length > 0) fetchPokemon(searchTerm);
  }, [allPokemon]);

  return (
    <View className={`flex-1 items-center p-6 w-full ${getBackgroundColor()}`}>
      {/* Input de búsqueda */}
      <View className="flex-row mb-4 w-full justify-center">
        <TextInput
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Escribe un nombre o numero"
          className="bg-white rounded-xl px-4 py-2 text-black w-2/3"
          autoCapitalize="none"
        />
        <TouchableOpacity
          onPress={handleSearch}
          className="ml-2 bg-[#9F211F] rounded-xl px-4 justify-center"
        >
          <CustomText variant="Dato">Buscar</CustomText>
        </TouchableOpacity>
      </View>

      {/* Botones anterior / siguiente */}
      <View className="flex-row mb-4 space-x-4">
        <TouchableOpacity
          onPress={handlePrevious}
          className="bg-[#9F211F] rounded-xl px-4 py-2"
        >
          <CustomText variant="Dato">Anterior</CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleNext}
          className="bg-[#9F211F] rounded-xl px-4 py-2"
        >
          <CustomText variant="Dato">Siguiente</CustomText>
        </TouchableOpacity>
      </View>

      {/* Estado de carga */}
      {loading && (
        <View className="justify-center items-center mt-10">
          <ActivityIndicator size="large" color="#facc15" />
          <CustomText variant="Descripcion" dark>
            Cargando...
          </CustomText>
        </View>
      )}

      {/* Error */}
      {error && !loading && (
        <View className="justify-center items-center mt-10">
          <CustomText variant="Descripcion" dark>
            {error}
          </CustomText>
        </View>
      )}

      {/* Mostrar Pokémon */}
      {pokemon && !loading && !error && (
        <View className="items-center">
          <CustomText variant="Nombre" dark>
            {pokemon.name.toUpperCase()}
          </CustomText>

          {/* Mostrar ID */}
          <CustomText variant="Dato">ID: {pokemon.id}</CustomText>

          <Image
            source={{ uri: pokemon.image }}
            className="w-40 h-40 my-4"
            resizeMode="contain"
          />

          <CustomText variant="Dato">
            Tipo: {pokemon.types.join(", ")}
          </CustomText>
        </View>
      )}
    </View>
  );
};

export default Pokedex;
