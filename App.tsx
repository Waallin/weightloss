import { View } from "react-native";
import { AuthNavigator } from "./screens/navigation/AuthNavigator";
import { useEffect } from "react";
import globalApi from "./services/api";
import Toast from "./components/Toast";
import useToastStore from "./stores/useToastStore";

export default function App() {
  const { isVisible, message } = useToastStore();

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
      {isVisible && <Toast title={message} />}
    </View>
  );
}
