import { View } from "react-native";
import { AuthNavigator } from "./screens/navigation/AuthNavigator";
import { useEffect } from "react";
import globalApi from "./services/api";

export default function App() {
  useEffect(() => {
    // getWeather();
  }, []);

  const getWeather = async () => {
    const response = await globalApi("GET", "/weather");
    console.log(response);
  };
  return (
    <View style={{ flex: 1 }}>
      <AuthNavigator />
    </View>
  );
}
