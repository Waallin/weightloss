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
import { fetchDocument, getDocument, getDocuments, updateDocument } from "./services/firebase";
import useConfigStore from "./stores/useConfigStore";
import ConfettiOverlay from "./components/ConfettiOverlay";
import useConfettiStore from "./stores/useConfettiStore";
import { increment } from "firebase/firestore";
import { auth } from "./services/firebaseConfig";
import { refreshSuperProperties, trackReturnIfNeeded } from "./services/tracking";
import { calculatePoints } from "./services/dietPoints";
import { syncToday } from "./services/firebase";
import useTodayProgressStore from "./stores/useTodayProgressStore";
import { useTodaySteps } from "./services/healthkit";
import { getDateKey } from "./utils/dateUtils";
import useTodayDietStore from "./stores/useTodayDietStore";
import Toast from "./components/Toast";
import { getDebugScanImage, getDebugSteps, seedDebugProfile } from "./utils/debugScanImage";
const currentYear = new Date().getFullYear()
import { identifyMixpanel, initializeMixpanel, trackMixpanelEvent } from "./services/mixpanel";
import { analyticsEvents } from "./constants/analytics";
import useUnitsStore from "./stores/useUnitsStore";
import { scheduleActiveUserNotifications } from "./services/notifications";
import { initializeMetaTracking } from "./services/metasdk";
import { initializeTikTokTracking } from "./services/tiktoksdk";
import { FIRST_DAY_GUIDE_STEP_KEY } from "./screens/main/home/FirstDayGuideScreen";
import UnderageBlockedScreen, {
  UNDERAGE_BLOCKED_KEY,
} from "./screens/auth/UnderageBlockedScreen";

export default function App(props: { scanImage?: string; debugSteps?: string; scanHold?: string }) {
  const debugScanImage = getDebugScanImage(props);
  const debugSteps = getDebugSteps(props);
  if (!debugScanImage && debugSteps != null) {
    return <DebugDashboardApp steps={debugSteps} />;
  }
  if (debugScanImage) {
    // Debug-only: skip onboarding, login, paywall and all service init
    // (Firebase, RevenueCat, analytics) and go straight to the real scan.
    return <DebugScanApp debugScanImage={debugScanImage} hold={!!props.scanHold} />;
  }
  return <AppContent />;
}

function DebugDashboardApp({ steps }: { steps: number }) {
  useState(() => seedDebugProfile(steps));
  return (
    <View style={{ flex: 1, backgroundColor: colors.ui.background }}>
      <SafeAreaView />
      <NavigationContainer>
        <MainStack initialRouteName="MainNavigator" />
      </NavigationContainer>
    </View>
  );
}

function DebugScanApp({ debugScanImage, hold }: { debugScanImage: string; hold: boolean }) {
  useState(seedDebugProfile); // runs once, before the first render of the scan
  return (
    <View style={{ flex: 1, backgroundColor: colors.ui.background }}>
      <SafeAreaView />
      <NavigationContainer>
        <MainStack
          initialRouteName="ScanFoodScreen"
          debugScanImage={debugScanImage}
          debugScanHold={hold}
        />
      </NavigationContainer>
    </View>
  );
}

function AppContent() {

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
  const [resumeFirstDayGuide, setResumeFirstDayGuide] = useState(false);
  const hydrateUnits = useUnitsStore((s) => s.hydrateUnits);
  const initializeApp = async () => {
    // Mixpanel måste vara initierat innan checkInUser skickar app_opened och super properties
    await initializeMixpanel();
    const authStatus = await checkInUser();
    if (authStatus === "blocked" || authStatus === "offline") return;
    const config = await handleConfig();
    await identifyUser();
    const trackMixpanelInstall = await handleTrackMixpanelInstall();
    const scheduledNotifications = await scheduleActiveUserNotifications();
    await hydrateUnits();
  };

  useEffect(() => {
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

  const identifyUser = async () => {
    const user = await AsyncStorage.getItem("user");
    if (!user) return;
    await identifyMixpanel(user);
  };
  

  const handleTrackMixpanelInstall = async () => {
    const mixpanelInstalled = await AsyncStorage.getItem("mixpanel_installed");
    if (mixpanelInstalled) return;
    const trackMixPanelInstall = await trackMixpanelEvent(analyticsEvents.appInstalled);
    await AsyncStorage.setItem("mixpanel_installed", "true");
  };

  const checkInUser = async () => {
    // Sparad Firebase-session (anonyma konton) läses in asynkront vid start
    await auth.authStateReady().catch(() => {});
    const underageBlocked = await AsyncStorage.getItem(UNDERAGE_BLOCKED_KEY);
    if (underageBlocked === "true") {
      setAuthState("underageBlocked");
      return "blocked";
    }

    const user = await AsyncStorage.getItem("user");

    if (!user) {
      setAuthState("unauthenticated");
      return false;
    }

    // Ett nätverksfel får inte tolkas som att kontot saknas, då loggas användaren ut för gott
    let userData;
    try {
      userData = await fetchDocument("users", user);
    } catch (error) {
      console.log("Could not read user document:", error);
      setAuthState("offline");
      return "offline";
    }
    const dietRef = "users/" + user + "/days/" + getDateKey() + "/foodEntries";
    const todayDiet = await getDocuments(dietRef);

    if (userData) {
    
      await updateDocument("users", user, {
        totalAppsOpen: increment(1),
        lastActiveAt: new Date(),
      });
      setTodayDiet(todayDiet);
      setUser(userData);
      await refreshSuperProperties(userData);
      trackMixpanelEvent(analyticsEvents.appOpened);
      trackReturnIfNeeded(userData);
      // Bara konton som skapats efter att guiden infördes har "pending"; äldre konton hoppar över den
      setResumeFirstDayGuide(
        (await AsyncStorage.getItem(FIRST_DAY_GUIDE_STEP_KEY)) === "pending",
      );
      setAuthState("loggedIn");
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
        {authState === "underageBlocked" ? (
          <UnderageBlockedScreen />
        ) : (
          <NavigationContainer>
            {authState === "loggedIn" && (
              <MainStack
                initialRouteName={
                  resumeFirstDayGuide ? "FirstDayGuide" : "MainNavigator"
                }
              />
            )}
            {authState === "unauthenticated" && <AuthNavigator />}
            {authState === "offline" && (
              <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 32, gap: 16 }}>
                <Text style={{ fontSize: 18, textAlign: "center", color: colors.text.primary }}>
                  Can't reach Kudoo right now. Check your connection.
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setAuthState("loading");
                    initializeApp();
                  }}
                  style={{ backgroundColor: colors.ui.primary, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 28 }}
                >
                  <Text style={{ color: colors.ui.white, fontSize: 17, fontWeight: "600" }}>Try again</Text>
                </TouchableOpacity>
              </View>
            )}
          </NavigationContainer>
        )}
      </View>
    </View>
  );
}
