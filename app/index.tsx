import Pokedex from "@/components/auth/Pokedex";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView edges={[]} className="w-screen h-screen bg-white">
      <Pokedex></Pokedex>
    </SafeAreaView>
  );
}
