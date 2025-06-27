import { View } from "react-native";
import { AuthNavigator } from "./screens/navigation/AuthNavigator";
import { useEffect, useState } from "react";
import globalApi from "./services/api";
import Toast from "./components/Toast";
import useToastStore from "./stores/useToastStore";
import { CustomSplashScreen } from "./components/CustomSplashScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useUserStore from "./stores/useUserStore";
import { MainStack } from "./screens/navigation/MainStack";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  const { isVisible, message } = useToastStore();
  const { setUser } = useUserStore();
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("user_token");
      if (token) {
        const endpoint = "user/get";
        const user = await globalApi("GET", endpoint, null, token);
        if (user.success) {
          setUser(user.data);
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error("Auth check error:", error);
    } finally {
      setAuthChecked(true);
    }
  };

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  // Visa splash screen tills auth är kollad
  if (showSplash || !authChecked) {
    return <CustomSplashScreen onFinish={handleSplashFinish} />;
  }

  // Navigera direkt till rätt destination
  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        {isAuthenticated ? <MainStack /> : <AuthNavigator />}
      </NavigationContainer>
      {isVisible && <Toast title={message} />}
    </View>
  );
}
