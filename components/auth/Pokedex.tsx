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

const Pokedex: React.FC = () => {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("pikachu");
  const [query, setQuery] = useState<string>("pikachu");

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`
        );
        if (!response.ok) throw new Error("Pokémon no encontrado");

        const data = await response.json();

        const pokemonData: Pokemon = {
          name: data.name,
          image: data.sprites.front_default,
          types: data.types.map((t: any) => t.type.name),
        };

        setPokemon(pokemonData);
      } catch (err: any) {
        setError(err.message);
        setPokemon(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [query]);

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      setQuery(searchTerm);
    }
  };

  const getBackgroundColor = () => {
    if (!pokemon || pokemon.types.length === 0) return typeColors.default;
    const mainType = pokemon.types[0];
    return typeColors[mainType] || typeColors.default;
  };

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