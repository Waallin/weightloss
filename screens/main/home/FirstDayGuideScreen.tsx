import { Dimensions } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
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
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { STEP_GOAL, formatNumber } from "../../../utils/goals";

const RING_SIZE = Math.min(Dimensions.get("window").width * 0.66, 260);
const MASCOT_SIZE = Math.min(Dimensions.get("window").width * 0.95, 380);

const currentYear = new Date().getFullYear();

export { FIRST_DAY_GUIDE_STEP_KEY } from "../../../services/finishFirstDayGuide";

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
  const [step, setStep] = useState<"steps" | "ring" | "meal">("steps");
  const connectFlowRef = useRef(false);

  const handleConnect = async () => {
    if (connecting) return;
    connectFlowRef.current = true;
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
    setStep("ring");
    trackMixpanelEvent(analyticsEvents.stepsRingViewed, { steps: todaySteps });
  };

  const goToMeal = () => {
    setStep("meal");
    trackMixpanelEvent(analyticsEvents.firstDayGuideSlideViewed, { slide: 2 });
  };

  useEffect(() => {
    if (route.params?.mealLogged) {
      // Måltiden är loggad: visa dagens dashboard innan paywallen
      navigation.replace("FirstDayDashboard");
      return;
    }
    setReady(true);
  }, [route.params?.mealLogged]);

  // Redan kopplat: hoppa direkt till måltidssteget
  useEffect(() => {
    if (healthConnected && step === "steps" && !connectFlowRef.current) setStep("meal");
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

  // Ingen "Skip": den som inte har mat framme väljer ett exempelfoto
  const handleSample = () => {
    haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("ScanFoodScreen", { fromFirstDayGuide: true, autoSample: true });
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
  const onRingStep = step === "ring";
  const dotKey = onRingStep ? "steps" : step;
  const stepsFill = Math.min(100, (todaySteps / STEP_GOAL) * 100);
  const goalReached = todaySteps >= STEP_GOAL;

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

  const secondaryButton = (label: string, icon: React.ComponentProps<typeof Ionicons>["name"], onPress: () => void) => (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={{
        marginTop: spacing.sm,
        height: 54,
        borderRadius: 14,
        backgroundColor: colors.ui.componentBackground,
        borderWidth: 1,
        borderColor: colors.ui.cardBorder,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        shadowColor: colors.ui.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 2,
      }}
    >
      <Ionicons name={icon} size={20} color={colors.ui.primary} />
      <Text style={{ ...typography.cardTitle, color: colors.text.primary }}>{label}</Text>
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
                width: s === dotKey ? 22 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: s === dotKey ? colors.ui.primary : "#D8D8D6",
              }}
            />
          ))}
        </View>

        <View style={{ flex: 1, justifyContent: "center" }}>
        <View style={{ alignItems: "center" }}>
          {onRingStep ? (
            <AnimatedCircularProgress
              size={RING_SIZE}
              width={18}
              fill={stepsFill}
              prefill={0}
              tintColor={colors.goals.moveRing}
              backgroundColor={colors.goals.ringTrack}
              rotation={0}
              lineCap="round"
              duration={1000}
            >
              {() => (
                <View style={{ alignItems: "center" }}>
                  <Ionicons
                    name={goalReached ? "checkmark" : "footsteps"}
                    size={28}
                    color={colors.goals.moveRing}
                  />
                  <Text style={{ ...typography.displayNumeric, fontSize: 46, lineHeight: 54, color: colors.text.primary }}>
                    {formatNumber(todaySteps)}
                  </Text>
                  <Text style={{ ...typography.bodyMedium, color: colors.goals.muted }}>
                    of {formatNumber(STEP_GOAL)} steps
                  </Text>
                </View>
              )}
            </AnimatedCircularProgress>
          ) : (
            <Image
              source={
                onStepsStep
                  ? require("../../../assets/mascot/easier.png")
                  : require("../../../assets/mascot/camera.png")
              }
              resizeMode="contain"
              style={{ width: MASCOT_SIZE, height: MASCOT_SIZE }}
            />
          )}
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
            {onRingStep
              ? goalReached
                ? "You’ve hit your goal"
                : todaySteps > 0
                  ? "Nice, you’re on your way"
                  : "Step counting is on"
              : onStepsStep
                ? "Let your steps count"
                : "Try logging a meal"}
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
            {onRingStep
              ? goalReached
                ? `That’s ${formatNumber(STEP_GOAL)} steps today. Nothing to log, it counts automatically.`
                : todaySteps > 0
                  ? `${formatNumber(Math.max(0, STEP_GOAL - todaySteps))} steps to go for today’s goal. It counts automatically.`
                  : `Your goal is ${formatNumber(STEP_GOAL)} steps a day. Take a walk and watch the ring fill.`
              : onStepsStep
              ? "Connect Apple Health and your daily steps are tracked automatically. Nothing to log."
              : `You have ${points} points today. Snap a photo of what you’re eating and see how it works.`}
          </Text>
        </View>
        </View>

        {onRingStep ? (
          primaryButton("Continue", "arrow-forward", colors.ui.primary, goToMeal)
        ) : onStepsStep ? (
          <>
            {primaryButton("Turn on step counting", "footsteps-outline", colors.ui.primary, handleConnect)}
            {textLink("Not now", goToMeal, colors.goals.muted)}
          </>
        ) : (
          <>
            {primaryButton("Scan a meal", "camera-outline", colors.ui.primary, handleScan)}
            {secondaryButton("No food nearby? Pick a sample photo", "images-outline", handleSample)}
          </>
        )}
      </View>

    </SafeAreaView>
  );
};

export default FirstDayGuideScreen;
