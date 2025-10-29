import React, { useEffect, useState } from "react";
import { View, Image, ActivityIndicator } from "react-native";
import "@/global.css"
import CustomText from "../ui/CustomText";

type Pokemon = {
  name: string;
  image: string;
  types: string[];
};

const PokemonViewer: React.FC = () => {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const pokemonName = "pikachu";

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
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
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [pokemonName]);

  if (loading)
    return (
      <View className="flex-1 justify-center items-center bg-white w-screen h-screen">
        <ActivityIndicator size="large" color="#facc15" />
        <CustomText variant="Descripcion" dark>
          Cargando...
        </CustomText>
      </View>
    );

  if (error)
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <CustomText variant="Descripcion" dark>
          Error: {error}
        </CustomText>
      </View>
    );

  if (!pokemon) return null;

  return (
    <View className="flex-1 justify-center items-center bg-white p-4">
      <CustomText variant="Nombre" dark>
        {pokemon.name.toUpperCase()}
      </CustomText>

      <Image
        source={{ uri: pokemon.image }}
        className="w-40 h-40 my-4"
        resizeMode="contain"
      />

      <CustomText variant="Dato" dark>
        Tipo: {pokemon.types.join(", ")}
      </CustomText>
    </View>
  );
};

export default PokemonViewer;