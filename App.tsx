import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import { AuthNavigator } from "./screens/navigation/AuthNavigator";
import { useEffect, useState } from "react";
import globalApi from "./services/api";
import useToastStore from "./stores/useToastStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useUserStore from "./stores/useUserStore";
import { MainStack } from "./screens/navigation/MainStack";
import { NavigationContainer } from "@react-navigation/native";
import CustomSplashScreen from "./CustomSplashScreen";
import 'react-native-reanimated'
import 'react-native-gesture-handler'
import { colors } from "./constants/colors";
import { getDocument } from "./services/firebase";
import useConfigStore from "./stores/useConfigStore";
import ConfettiOverlay from "./components/ConfettiOverlay";
import useConfettiStore from "./stores/useConfettiStore";
export default function App() {
  const { isVisible, message } = useToastStore();
  const { setUser } = useUserStore();
  const { setConfig } = useConfigStore();
  const { visibleConfetti, confettiNonce, setVisibleConfetti } =
    useConfettiStore();
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // checkAuthStatus();
    handleConfig();
    setTimeout(() => {
      setShowSplash(false);
    }, 3000);
  }, []);


  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const handleConfig = async () => {
    const config = await getDocument("config", "app");
    if (config) {
      setConfig(config);
    }
  };
  

  // Visa splash screen tills auth är kollad
  if (showSplash) {
    return <CustomSplashScreen onFinish={handleSplashFinish} />;
  }

  // Navigera direkt till rätt destination
  return (
    <View style={{ flex: 1 }}>
      <ConfettiOverlay
        visible={visibleConfetti}
        burstNonce={confettiNonce}
        onComplete={() => setVisibleConfetti(false)}
      />
      <View style={{ flex: 1, backgroundColor: colors.ui.background }}>
        <SafeAreaView />
        <NavigationContainer>
          {isAuthenticated ? <MainStack /> : <MainStack />}
        </NavigationContainer>
      </View>
    </View>
  );
}
