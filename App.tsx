import { SafeAreaView, View, Text, TouchableOpacity, AppState } from "react-native";
import { AuthNavigator } from "./screens/navigation/AuthNavigator";
import { useEffect, useState } from "react";
import useToastStore from "./stores/useToastStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useUserStore from "./stores/useUserStore";
import { MainStack } from "./screens/navigation/MainStack";
import { NavigationContainer } from "@react-navigation/native";
import CustomSplashScreen from "./CustomSplashScreen";
import "react-native-reanimated";
import "react-native-gesture-handler";
import { colors } from "./constants/colors";
import { getDocument, getDocuments, updateDocument } from "./services/firebase";
import useConfigStore from "./stores/useConfigStore";
import ConfettiOverlay from "./components/ConfettiOverlay";
import useConfettiStore from "./stores/useConfettiStore";
import { increment } from "firebase/firestore";
import { calculatePoints } from "./services/dietPoints";
import { syncToday } from "./services/firebase";
import useTodayProgressStore from "./stores/useTodayProgressStore";
import { useTodaySteps } from "./services/healthkit";
import { getDateKey } from "./utils/dateUtils";
import useTodayDietStore from "./stores/useTodayDietStore";
import Toast from "./components/Toast";
import PaywallScreen from "./screens/auth/PaywallScreen";
const currentYear = new Date().getFullYear()
export default function App() {

  const { isVisible, message } = useToastStore();
  const { user, setUser } = useUserStore();
  const {  setTodayProgress } = useTodayProgressStore();
  const steps = useTodaySteps();
  const {  setTodayDiet } = useTodayDietStore();
  const { setConfig } = useConfigStore();
  const { visibleConfetti, confettiNonce, setVisibleConfetti } =
    useConfettiStore();
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
    handleConfig();
    setTimeout(() => {
      setShowSplash(false);
    }, 3000);
  }, []);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };




  useEffect(() => {
    if (!user?.email) return;

    handleSyncToday();
  }, [user?.email]);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active" && user?.email) {  
        handleSyncToday();
      }
    });

    return () => sub.remove();
  }, [user?.email]);
  
  const handleSyncToday = async () => {
    const points = calculatePoints(
      user?.currentWeight ?? user?.startWeight,
      user?.height ?? 0,
      currentYear - user?.birthYear,
      user?.gender ?? "Male",
      steps,
    );

    const syncedDay = await syncToday(user.email as string, steps, points);
    if (syncedDay != null) {
      setTodayProgress(syncedDay);
    }
  };
 

  const handleConfig = async () => {
    const config = await getDocument("config", "app");
    if (config) {
      setConfig(config);
    }
  };

  const checkAuthStatus = async () => {
    const user = await AsyncStorage.getItem("user");
    if (user) {
      const result = await checkInUser(user);

      if (result) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  };

  const checkInUser = async (user: string) => {
    const userData = await getDocument("users", user);
    const dietRef = "users/" + user + "/days/" + getDateKey() + "/foodEntries";
    const todayDiet = await getDocuments(dietRef);
    if (userData) {
      await updateDocument("users", user, {
        totalAppsOpen: increment(1),
        lastActiveAt: new Date(),
      });
      setTodayDiet(todayDiet);
      setUser(userData);
      return true;
    } else {
      console.log("🚀 ~ checkInUser ~ userData not found")
      await AsyncStorage.removeItem("user");
      setIsAuthenticated(false);
      return false;
    }
  };

  // Visa splash screen tills auth är kollad
  if (showSplash) {
    return <CustomSplashScreen onFinish={handleSplashFinish} />;
  }

  // Navigera direkt till rätt destination
  return (
    <View style={{ flex: 1 }}>
      {isVisible && <Toast title={message} />}
      <ConfettiOverlay
        visible={visibleConfetti}
        burstNonce={confettiNonce}
        onComplete={() => setVisibleConfetti(false)}
      />
      <View style={{ flex: 1, backgroundColor: colors.ui.background }}>
        <SafeAreaView />
        <NavigationContainer>
          {isAuthenticated ? <MainStack /> : <AuthNavigator />}
        </NavigationContainer>
      </View>
    </View>
  );
}
