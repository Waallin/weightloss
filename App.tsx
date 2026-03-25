import { SafeAreaView, View } from "react-native";
import { AuthNavigator } from "./screens/navigation/AuthNavigator";
import { useEffect, useState } from "react";
import globalApi from "./services/api";
import useToastStore from "./stores/useToastStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useUserStore from "./stores/useUserStore";
import { MainStack } from "./screens/navigation/MainStack";
import { NavigationContainer } from "@react-navigation/native";
import CustomSplashScreen from "./CustomSplashScreen";
import { colors } from "./constants/colors";

export default function App() {
  const { isVisible, message } = useToastStore();
  const { setUser } = useUserStore();
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // checkAuthStatus();
    setTimeout(() => {
      setShowSplash(false);
    }, 3000);
  }, []);

  const checkAuthStatus = async () => {};

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  // Visa splash screen tills auth är kollad
  if (showSplash) {
    return <CustomSplashScreen onFinish={handleSplashFinish} />;
  }

  // Navigera direkt till rätt destination
  return (
    <View style={{ flex: 1}}>
      <SafeAreaView />
      <NavigationContainer>
        {isAuthenticated ? <MainStack /> : <AuthNavigator />}
      </NavigationContainer>
    </View>
  );
}
