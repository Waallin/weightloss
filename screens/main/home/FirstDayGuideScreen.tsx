import React, { useEffect, useState } from "react";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as haptics from "expo-haptics";
import { increment } from "firebase/firestore";
import { colors } from "../../../constants/colors";
import { spacing } from "../../../constants/spacing";
import { textStyles } from "../../../constants/texts";
import PrimaryButtonComponent from "../../../components/PrimaryButtonComponent";
import { RootStackParamList } from "../../navigation/types";
import { useHealthKitPermissions } from "../../../services/healthkit";
import { calculatePoints } from "../../../services/dietPoints";
import { updateTodayProgress } from "../../../services/firebase";
import useTodayProgressStore from "../../../stores/useTodayProgressStore";
import useUserStore from "../../../stores/useUserStore";
import useConfettiStore from "../../../stores/useConfettiStore";
import { trackMixpanelEvent } from "../../../services/mixpanel";
import { analyticsEvents } from "../../../constants/analytics";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SPOTLIGHT_OUTER = Math.min(SCREEN_WIDTH * 0.78, 320);
const IMAGE_SIZE = SPOTLIGHT_OUTER * 0.84;
const DOT_SIZE = 8;
const DOT_INACTIVE = "#D8D8D6";
const STEP_COUNT = 4;
const currentYear = new Date().getFullYear();

export const FIRST_DAY_GUIDE_STEP_KEY = "first_day_guide_step";

type GuideStep = 1 | 2 | 3 | 4;

const parseGuideStep = (value: string | null): GuideStep => {
  if (value === "2" || value === "3" || value === "4") {
    return Number(value) as GuideStep;
  }
  return 1;
};

const FirstDayGuideScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "FirstDayGuide">>();
  const { requestPermission } = useHealthKitPermissions();
  const { todayProgress, setTodayProgress } = useTodayProgressStore();
  const { user } = useUserStore();
  const { setVisibleConfetti } = useConfettiStore();
  const [step, setStep] = useState<GuideStep>(1);
  const [ready, setReady] = useState(false);
  const [waterCelebrated, setWaterCelebrated] = useState(false);
  const [connectingHealth, setConnectingHealth] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const hydrate = async () => {
      if (route.params?.mealLogged) {
        setStep(2);
        setWaterCelebrated(false);
        await AsyncStorage.setItem(FIRST_DAY_GUIDE_STEP_KEY, "2");
        navigation.setParams({ mealLogged: undefined });
        if (!cancelled) setReady(true);
        return;
      }

      const storedStep = await AsyncStorage.getItem(FIRST_DAY_GUIDE_STEP_KEY);
      if (cancelled) return;
      setStep(parseGuideStep(storedStep));
      setReady(true);
    };

    hydrate();
    return () => {
      cancelled = true;
    };
  }, [route.params?.mealLogged, navigation]);

  useEffect(() => {
    if (!ready) return;
    trackMixpanelEvent(analyticsEvents.firstDayGuideViewed);
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    trackMixpanelEvent(analyticsEvents.firstDayGuideSlideViewed, {
      slide: step,
    });
  }, [ready, step]);

  const goToStep = (nextStep: GuideStep) => {
    haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
    if (nextStep === 3) setWaterCelebrated(false);
    setStep(nextStep);
    AsyncStorage.setItem(FIRST_DAY_GUIDE_STEP_KEY, String(nextStep));
  };

  const handlePrimaryPress = async () => {
    if (step === 1) {
      haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
      navigation.navigate("ScanFoodScreen", { fromFirstDayGuide: true });
      return;
    }

    if (step === 2) {
      haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
      setConnectingHealth(true);
      try {
        await requestPermission();
      } catch (error) {
        console.log("Error requesting HealthKit permission:", error);
      } finally {
        setConnectingHealth(false);
      }
      setWaterCelebrated(false);
      setStep(3);
      AsyncStorage.setItem(FIRST_DAY_GUIDE_STEP_KEY, "3");
      return;
    }

    if (step === 3) {
      if (!waterCelebrated) {
        haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
        if (todayProgress?.progress && user?.email) {
          const currentWater = todayProgress.progress.water ?? 0;
          const nextWater = currentWater + 1;
          const reachedGoal = nextWater >= 10;

          setTodayProgress({
            ...todayProgress,
            progress: {
              ...todayProgress.progress,
              water: nextWater,
            },
            ...(reachedGoal
              ? {
                  completion: {
                    ...todayProgress.completion,
                    water: true,
                  },
                }
              : {}),
          });

          updateTodayProgress(user.email, {
            "progress.water": increment(1),
            ...(reachedGoal ? { "completion.water": true } : {}),
          });
          trackMixpanelEvent(analyticsEvents.waterLogged);
        }
        setVisibleConfetti(true);
        setWaterCelebrated(true);
        return;
      }

      goToStep(4);
      return;
    }

    haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
    trackMixpanelEvent(analyticsEvents.firstDayGuideCompleted);
    await AsyncStorage.setItem(FIRST_DAY_GUIDE_STEP_KEY, "done");
    navigation.replace("MainNavigator");
  };

  const fallbackPoints = calculatePoints(
    user?.currentWeight ?? user?.startWeight ?? 0,
    user?.height ?? 0,
    currentYear - (user?.birthYear ?? currentYear),
    user?.gender ?? "Male",
    0,
  ).total;
  const points = todayProgress?.points?.total || fallbackPoints;

  const title =
    step === 1
      ? "Let’s log your first meal"
      : step === 2
        ? "Make your points more accurate"
        : step === 3
          ? waterCelebrated
            ? "Nice. You’ve already started 🎉"
            : "Log your first glass 💧"
          : "Your plan is ready 🎉";

  const description =
    step === 1
      ? "Snap a photo and we’ll turn your meal into points — automatically."
      : step === 2
        ? "Your daily points adjust to your activity. The more you move, the more points you can earn."
        : step === 3
          ? waterCelebrated
            ? "1 glass down. Your first day is officially underway."
            : "One tap. You’re already building the habit."
          : `${points} points · 10 glasses · 5,000 steps`;

  const cta =
    step === 1
      ? "Scan a meal"
      : step === 2
        ? "Connect Apple Health"
        : step === 3
          ? waterCelebrated
            ? "Keep going →"
            : "Log a glass"
          : "Start my first day →";

  const secondary =
    step === 1 ? "I don’t have food right now" : step === 2 ? "Not now" : null;

  const image =
    step === 1
      ? require("../../../assets/mascot/logging.png")
      : step === 2
        ? require("../../../assets/mascot/steps.png")
        : step === 3
          ? waterCelebrated
            ? require("../../../assets/mascot/waterCompleted.png")
            : require("../../../assets/mascot/water.png")
          : require("../../../assets/mascot/allSet.png");

  if (!ready) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.ui.background }}
        edges={["top", "bottom"]}
      />
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.ui.background,
      }}
      edges={["top", "bottom"]}
    >
      <View
        style={{
          flex: 1,
          alignItems: "center",
          paddingHorizontal: spacing.lg,
          
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: SPOTLIGHT_OUTER,
            height: SPOTLIGHT_OUTER,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: spacing.lg,
          }}
        >
          <Image
            source={image}
            resizeMode="contain"
            style={{ width: IMAGE_SIZE, height: IMAGE_SIZE }}
          />
        </View>

        <Text
          style={{
            ...textStyles.onboardingTitle,
            textAlign: "center",
            marginBottom: spacing.sm,
          }}
        >
          {title}
        </Text>
        {description ? (
          <Text
            style={{
              ...textStyles.onboardingBody,
              textAlign: "center",
              paddingHorizontal: spacing.sm,
              lineHeight: 22,
            }}
          >
            {description}
          </Text>
        ) : null}
        {step === 3 && waterCelebrated ? (
          <View
            style={{
              width: "100%",
              marginTop: spacing.lg,
              paddingVertical: spacing.md,
              paddingHorizontal: spacing.md,
              borderRadius: spacing.borderRadius,
        
              alignItems: "center",
              gap: spacing.sm,
            }}
          >
            <Text
              style={{
                ...textStyles.listItemEmphasis,
                textAlign: "center",
              }}
            >
              💧 1 / 10 glasses
            </Text>
            <View
              style={{
                width: "100%",
                height: 6,
                borderRadius: 3,
                backgroundColor: colors.ui.dotInactive,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  width: "10%",
                  height: "100%",
                  backgroundColor: colors.ui.primary,
                  borderRadius: 3,
                }}
              />
            </View>
          </View>
        ) : null}
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: spacing.lg,
          gap: spacing.sm,
        }}
      >
        {Array.from({ length: STEP_COUNT }, (_, index) => {
          const isActive = index + 1 === step;
          return (
            <View
              key={index}
              style={{
                width: DOT_SIZE,
                height: DOT_SIZE,
                borderRadius: DOT_SIZE / 2,
                backgroundColor: isActive ? colors.ui.primary : DOT_INACTIVE,
              }}
            />
          );
        })}
      </View>

      <View
        style={{
          paddingHorizontal: spacing.md,
          paddingBottom: spacing.sm,
        }}
      >
        <PrimaryButtonComponent
        
          title={cta}
          onPress={handlePrimaryPress}
          loading={connectingHealth}
          disabled={connectingHealth}
        />
      
          <TouchableOpacity
          disabled={!secondary}
            activeOpacity={0.7}
            onPress={() => {
              haptics.impactAsync(haptics.ImpactFeedbackStyle.Medium);
              if (connectingHealth) return;
              goToStep((step + 1) as GuideStep);
            }}
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: spacing.sm,
              marginTop: spacing.sm,
            }}
          >
            <Text
              style={{
                ...textStyles.onboardingBody,
                textAlign: "center",
              }}
            >
              {secondary}
            </Text>
          </TouchableOpacity>
       
      </View>
    </SafeAreaView>
  );
};

export default FirstDayGuideScreen;
