import { Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../constants/colors";
import { spacing } from "../../../constants/spacing";
import { typography } from "../../../constants/texts";
import { RootStackParamList } from "../../navigation/types";
import { useHealthKitPermissions, useTodaySteps } from "../../../services/healthkit";
import { calculatePoints } from "../../../services/dietPoints";
import useTodayProgressStore from "../../../stores/useTodayProgressStore";
import useUserStore from "../../../stores/useUserStore";
import { trackMixpanelEvent } from "../../../services/mixpanel";
import { analyticsEvents } from "../../../constants/analytics";
import useHealthConnected from "../../../hooks/useHealthConnected";

const MASCOT_SIZE = Math.min(Dimensions.get("window").width * 0.95, 380);

const currentYear = new Date().getFullYear();

export const FIRST_DAY_GUIDE_STEP_KEY = "first_day_guide_step";

const cardStyle = {
  backgroundColor: colors.ui.white,
  borderRadius: 24,
  padding: spacing.md,
  flexDirection: "row" as const,
  gap: 14,
  shadowColor: colors.goals.dark,
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.06,
  shadowRadius: 24,
  elevation: 4,
};

const FirstDayGuideScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "FirstDayGuide">>();
  const { todayProgress } = useTodayProgressStore();
  const { user } = useUserStore();
  const todaySteps = useTodaySteps();
  const { connected: healthConnected, markRequested } = useHealthConnected(todaySteps);
  const { requestPermission } = useHealthKitPermissions();
  const [connecting, setConnecting] = useState(false);
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState<"steps" | "meal">("steps");

  const handleConnect = async () => {
    if (connecting) return;
    haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
    setConnecting(true);
    trackMixpanelEvent(analyticsEvents.healthPermissionPrompted, { source: "first_day_guide" });
    try {
      await requestPermission();
    } catch (error) {
      console.log("Error requesting HealthKit permission:", error);
    } finally {
      setConnecting(false);
    }
    markRequested();
    goToMeal();
  };

  const goToMeal = () => {
    setStep("meal");
    trackMixpanelEvent(analyticsEvents.firstDayGuideSlideViewed, { slide: 2 });
  };

  const finishGuide = async () => {
    trackMixpanelEvent(analyticsEvents.firstDayGuideCompleted);
    await AsyncStorage.setItem(FIRST_DAY_GUIDE_STEP_KEY, "done");
    navigation.replace("MainNavigator");
  };

  useEffect(() => {
    if (route.params?.mealLogged) {
      finishGuide();
      return;
    }
    setReady(true);
  }, [route.params?.mealLogged]);

  // Redan kopplat: hoppa direkt till måltidssteget
  useEffect(() => {
    if (healthConnected && step === "steps") setStep("meal");
  }, [healthConnected]);

  useEffect(() => {
    if (!ready) return;
    trackMixpanelEvent(analyticsEvents.firstDayGuideViewed);
    trackMixpanelEvent(analyticsEvents.firstDayGuideSlideViewed, { slide: 1 });
  }, [ready]);

  const fallbackPoints = calculatePoints(
    user?.currentWeight ?? user?.startWeight ?? 0,
    user?.height ?? 0,
    currentYear - (user?.birthYear ?? currentYear),
    user?.gender ?? "Male",
    0,
  ).total;
  const points = todayProgress?.points?.total || fallbackPoints;

  const handleScan = () => {
    haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("ScanFoodScreen", { fromFirstDayGuide: true });
  };

  const handleLookAround = () => {
    haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
    finishGuide();
  };

  if (!ready) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.ui.background }}
        edges={["top", "bottom"]}
      />
    );
  }

  const onStepsStep = step === "steps";

  const primaryButton = (label: string, icon: React.ComponentProps<typeof Ionicons>["name"], color: string, onPress: () => void) => (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={{
        height: 58,
        borderRadius: 14,
        backgroundColor: color,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
      }}
    >
      <Ionicons name={icon} size={22} color={colors.ui.white} />
      <Text style={{ ...typography.button, fontSize: 18, color: colors.ui.white }}>{label}</Text>
    </TouchableOpacity>
  );

  const textLink = (label: string, onPress: () => void, color: string) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{ height: 44, justifyContent: "center", alignItems: "center" }}
    >
      <Text style={{ ...typography.cardTitle, color }}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.ui.background }}
      edges={["top", "bottom"]}
    >
      <View style={{ flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.md }}>
        <View style={{ flexDirection: "row", justifyContent: "center", gap: 6 }}>
          {["steps", "meal"].map((s) => (
            <View
              key={s}
              style={{
                width: s === step ? 22 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: s === step ? colors.ui.primary : "#D8D8D6",
              }}
            />
          ))}
        </View>

        <View style={{ flex: 1, justifyContent: "center" }}>
        <View style={{ alignItems: "center" }}>
          <Image
            source={
              onStepsStep
                ? require("../../../assets/mascot/easier.png")
                : require("../../../assets/mascot/camera.png")
            }
            resizeMode="contain"
            style={{ width: MASCOT_SIZE, height: MASCOT_SIZE }}
          />
        </View>
        <View style={{ alignItems: "center", marginTop: spacing.sm }}>
          <Text
            style={{
              ...typography.screenTitle,
              fontSize: 30,
              lineHeight: 36,
              color: colors.text.primary,
              textAlign: "center",
            }}
          >
            {onStepsStep ? "Let your steps count" : "Try logging a meal"}
          </Text>
          <Text
            style={{
              ...typography.bodyMedium,
              lineHeight: 21,
              color: colors.goals.muted,
              textAlign: "center",
              marginTop: 8,
              paddingHorizontal: spacing.md,
            }}
          >
            {onStepsStep
              ? "Connect Apple Health and your daily steps are tracked automatically. Nothing to log."
              : `You have ${points} points today. Snap a photo of what you’re eating and see how it works.`}
          </Text>
        </View>
        </View>

        {onStepsStep ? (
          <>
            {primaryButton("Turn on step counting", "footsteps-outline", colors.ui.primary, handleConnect)}
            {textLink("Not now", goToMeal, colors.goals.muted)}
          </>
        ) : (
          <>
            {primaryButton("Scan a meal", "camera-outline", colors.ui.primary, handleScan)}
            {textLink("Skip for now", handleLookAround, colors.goals.muted)}
          </>
        )}
      </View>

    </SafeAreaView>
  );
};

export default FirstDayGuideScreen;
