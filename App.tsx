import { SafeAreaView, View, Text, TouchableOpacity, AppState } from "react-native";
import { AuthNavigator } from "./screens/navigation/AuthNavigator";
import { useCallback, useEffect, useState } from "react";
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
const currentYear = new Date().getFullYear()
import { getRevenueCatCustomerInfo, getProducts, initRevenueCat } from "./services/revenuecat";
import { initializeMixpanel, trackMixpanelEvent } from "./services/mixpanel";
import useRevCatStore from "./stores/useRevCatStore"; 
import { scheduleActiveUserNotifications } from "./services/notifications";
import { initializeMetaTracking } from "./services/metasdk";
import { initializeTikTokTracking } from "./services/tiktoksdk";

export default function App() {

  const { isVisible, message } = useToastStore();
  const { user, setUser } = useUserStore();
  const {  setTodayProgress } = useTodayProgressStore();
  const steps = useTodaySteps();
  const {  setTodayDiet } = useTodayDietStore();
  const { setConfig } = useConfigStore();
  const [authState, setAuthState] = useState("unauthenticated");
  const { visibleConfetti, confettiNonce, setVisibleConfetti } =
    useConfettiStore();
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { setProducts } = useRevCatStore();
  useEffect(() => {

    const initializeApp = async () => {
      const authStatus = await checkInUser()
      const config = await handleConfig(); 
      const revenueCatInitialized = await initRevenueCat(); 
      const products = await handleRevCatProducts();
      const revenueCatCustomerInfo = await handleRevenueCatCustomerInfo();
      const initializeMixpanelResult = await initializeMixpanel();
      const trackMixpanelInstall = await handleTrackMixpanelInstall();
      const scheduledNotifications = await scheduleActiveUserNotifications();
    }
    initializeApp();
    setTimeout(() => {
      setShowSplash(false);
    }, 3000);
  }, []);

  useEffect(() => {
    if (showSplash) return;
    const initTracking = async () => {
      await initializeMetaTracking();
      await initializeTikTokTracking();
    };
    initTracking();
  }, [showSplash]);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };




  const handleSyncToday = useCallback(async () => {
    if (!user?.email) return;
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
  }, [
    user?.email,
    user?.currentWeight,
    user?.startWeight,
    user?.height,
    user?.birthYear,
    user?.gender,
    steps,
    setTodayProgress,
  ]);

  useEffect(() => {
    if (!user?.email) return;
    handleSyncToday();
  }, [user?.email, steps, handleSyncToday]);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active" && user?.email) {  
        handleSyncToday();
      }
    });

    return () => sub.remove();
  }, [user?.email, handleSyncToday]);
 

  const handleConfig = async () => {
    const [config, reminderPaywallPhrases] = await Promise.all([
      getDocument("config", "app"),
      getDocument("config", "paywall_reminder"),
    ]);
    if (config || reminderPaywallPhrases) {
      setConfig({
        ...(config ?? {}),
        reminderPaywallPhrases,
      });
    }
  };

  const handleRevenueCatCustomerInfo = async () => {
    const user = await AsyncStorage.getItem("user");
    if (!user) return;
    
    const revenueCatCustomerInfo = await getRevenueCatCustomerInfo();
    updateDocument("users", user, {
      revenuecat: revenueCatCustomerInfo,
    });

    console.log("🚀 ~ handleRevenueCatCustomerInfo ~ revenueCatCustomerInfo:", revenueCatCustomerInfo)


    if (revenueCatCustomerInfo?.entitlements.active["Kudoo Premium"]) {
      setAuthState("loggedInWithPremium");
    } else {
      setAuthState("loggedInWithoutPremium");
    }
  };

  const handleRevCatProducts = async () => {
    const products = await getProducts();
    setProducts(products);
  };
  

  const handleTrackMixpanelInstall = async () => {
    const mixpanelInstalled = await AsyncStorage.getItem("mixpanel_installed");
    if (mixpanelInstalled) return;
    const trackMixPanelInstall = await trackMixpanelEvent("app_installed");
    await AsyncStorage.setItem("mixpanel_installed", "true");
  };

  const checkInUser = async () => {
    const user = await AsyncStorage.getItem("user");

    if (!user) {
      setAuthState("unauthenticated");
      return false;
    }

    const userData = await getDocument("users", user);
    const dietRef = "users/" + user + "/days/" + getDateKey() + "/foodEntries";
    const todayDiet = await getDocuments(dietRef);

    if (userData) {
    
      await updateDocument("users", user, {
        totalAppsOpen: increment(1),
        lastActiveAt: new Date(),
      });
      trackMixpanelEvent("app_opened");
      setTodayDiet(todayDiet);
      setUser(userData)
      
      return true;
    } else {

      await AsyncStorage.removeItem("user");
      setIsAuthenticated(false);
      setAuthState("unauthenticated");

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
          {authState === "loggedInWithPremium" && <MainStack />}
          {authState === "unauthenticated" && <AuthNavigator />}
          {authState === "loggedInWithoutPremium" && (
            <MainStack initialRouteName="Paywall" />
          )}
        </NavigationContainer>
      </View>
    </View>
  );
}
