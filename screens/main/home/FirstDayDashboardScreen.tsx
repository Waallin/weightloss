import React, { useEffect, useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { MotiView } from "moti";
import * as haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { colors } from "../../../constants/colors";
import { spacing } from "../../../constants/spacing";
import { typography } from "../../../constants/texts";
import { analyticsEvents } from "../../../constants/analytics";
import { RootStackParamList } from "../../navigation/types";
import { trackMixpanelEvent } from "../../../services/mixpanel";
import { useTodaySteps } from "../../../services/healthkit";
import { maybeAskForStoreReview } from "../../../services/storeReview";
import useConfettiStore from "../../../stores/useConfettiStore";
import useTodayDietStore from "../../../stores/useTodayDietStore";
import useHealthConnected from "../../../hooks/useHealthConnected";
import { STEP_GOAL, formatNumber, ptsWord } from "../../../utils/goals";

const RING_SIZE = Math.min(Dimensions.get("window").width * 0.3, 120);

const cardStyle = {
  backgroundColor: colors.ui.white,
  borderRadius: 24,
  padding: spacing.md,
  flexDirection: "row" as const,
  alignItems: "center" as const,
  gap: 14,
  shadowColor: colors.goals.dark,
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.06,
  shadowRadius: 24,
  elevation: 4,
};

// Visas efter första loggade måltiden, precis före paywallen. Inga "points left"-siffror:
// profilen är ofylld här så dagsbudgeten bygger på standardvärden.
const FirstDayDashboardScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { todayDiet } = useTodayDietStore();
  const todaySteps = useTodaySteps();
  const { connected: healthConnected } = useHealthConnected(todaySteps);
  const { setVisibleConfetti } = useConfettiStore();
  const [busy, setBusy] = useState(false);

  const meal = Array.isArray(todayDiet) && todayDiet.length > 0 ? todayDiet[todayDiet.length - 1] : null;
  const mealPoints = Number(meal?.points ?? 0);
  const showSteps = healthConnected;
  const stepsFill = Math.min(100, (todaySteps / STEP_GOAL) * 100);

  useEffect(() => {
    haptics.notificationAsync(haptics.NotificationFeedbackType.Success);
    setVisibleConfetti(true);
    // Efter konfettin och bocken, medan användaren fortfarande är på dashboarden
    void maybeAskForStoreReview("day1_dashboard", 2800);
  }, []);

  useEffect(() => {
    trackMixpanelEvent(analyticsEvents.day1DashboardViewed, {
      has_steps: showSteps,
      steps: todaySteps,
      meal_points: mealPoints,
    });
  }, []);

  const handleStart = async () => {
    if (busy) return;
    setBusy(true);
    haptics.impactAsync(haptics.ImpactFeedbackStyle.Medium);
    trackMixpanelEvent(analyticsEvents.day1DashboardCtaTapped);
    navigation.navigate("AcquisitionSource");
    setBusy(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.ui.background }} edges={["top", "bottom"]}>
      <View style={{ flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.xl }}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <View style={{ alignItems: "center", justifyContent: "center", height: 124 }}>
            <MotiView
              from={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "timing", duration: 700 }}
              style={{
                position: "absolute",
                width: 124,
                height: 124,
                borderRadius: 62,
                backgroundColor: colors.goals.eatSoft,
                shadowColor: colors.goals.eatRing,
                shadowOpacity: 0.35,
                shadowRadius: 26,
                shadowOffset: { width: 0, height: 0 },
              }}
            />
            <AnimatedCircularProgress
              style={{ position: "absolute" }}
              size={104}
              width={5}
              fill={100}
              prefill={0}
              tintColor={colors.goals.eatRing}
              backgroundColor="rgba(22,185,123,0.15)"
              rotation={0}
              lineCap="round"
              duration={900}
            />
            <MotiView
              from={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 12, delay: 500 }}
              style={{
                width: 76,
                height: 76,
                borderRadius: 38,
                backgroundColor: colors.goals.eatRing,
                alignItems: "center",
                justifyContent: "center",
                shadowColor: colors.goals.eatRing,
                shadowOpacity: 0.45,
                shadowRadius: 14,
                shadowOffset: { width: 0, height: 6 },
              }}
            >
              <Ionicons name="checkmark" size={44} color={colors.ui.white} />
            </MotiView>
          </View>

          <Text
            style={{
              ...typography.screenTitle,
              fontSize: 32,
              lineHeight: 38,
              color: colors.text.primary,
              textAlign: "center",
              marginTop: spacing.md,
            }}
          >
            Day 1 is off to a start
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
            Your first meal is logged. This is all it takes, a photo and a few seconds.
          </Text>

          <View style={{ marginTop: spacing.lg, gap: spacing.md }}>
            {meal ? (
              <MotiView
                from={{ opacity: 0, translateY: 16 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: "timing", duration: 450, delay: 150 }}
                style={cardStyle}
              >
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 18,
                    backgroundColor: colors.goals.eatSoft,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="restaurant" size={26} color={colors.goals.eatRing} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ ...typography.bodyMedium, color: colors.goals.muted }}>Logged just now</Text>
                  <Text numberOfLines={1} style={{ ...typography.cardTitle, color: colors.text.primary, marginTop: 2 }}>
                    {meal.title}
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={{ ...typography.displayNumeric, fontSize: 30, lineHeight: 34, color: colors.goals.eatSoftText }}>
                    {mealPoints}
                  </Text>
                  <Text style={{ ...typography.bodyMedium, color: colors.goals.muted }}>
                    {ptsWord(mealPoints)} · estimate
                  </Text>
                </View>
              </MotiView>
            ) : null}

            {showSteps ? (
              <MotiView
                from={{ opacity: 0, translateY: 16 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: "timing", duration: 450, delay: 300 }}
                style={cardStyle}
              >
                <AnimatedCircularProgress
                  size={RING_SIZE * 0.55}
                  width={9}
                  fill={stepsFill}
                  prefill={0}
                  tintColor={colors.goals.moveRing}
                  backgroundColor={colors.goals.ringTrack}
                  rotation={0}
                  lineCap="round"
                  duration={900}
                >
                  {() => <Ionicons name="footsteps" size={18} color={colors.goals.moveRing} />}
                </AnimatedCircularProgress>
                <View style={{ flex: 1 }}>
                  <Text style={{ ...typography.bodyMedium, color: colors.goals.muted }}>Steps today</Text>
                  <Text style={{ ...typography.cardTitle, color: colors.text.primary, marginTop: 2 }}>
                    {formatNumber(todaySteps)} of {formatNumber(STEP_GOAL)}
                  </Text>
                </View>
              </MotiView>
            ) : null}
          </View>

          <MotiView
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 450, delay: 450 }}
            style={{
              ...cardStyle,
              marginTop: spacing.md,
              borderWidth: 1,
              borderColor: colors.goals.eatSoft,
              borderLeftWidth: 4,
              borderLeftColor: colors.goals.eatRing,
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                backgroundColor: colors.goals.eatSoft,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="sparkles" size={22} color={colors.goals.eatRing} />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  ...typography.bodySemiBold,
                  fontSize: 12,
                  letterSpacing: 0.8,
                  textTransform: "uppercase",
                  color: colors.goals.eatRing,
                }}
              >
                Up next
              </Text>
              <Text style={{ ...typography.cardTitle, color: colors.text.primary, marginTop: 2 }}>
                Make your points yours
              </Text>
              <Text style={{ ...typography.bodyMedium, lineHeight: 19, color: colors.goals.muted, marginTop: 2 }}>
                Add your height, weight and age so they fit you.
              </Text>
            </View>
          </MotiView>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleStart}
          disabled={busy}
          style={{
            height: 58,
            borderRadius: 14,
            backgroundColor: colors.ui.primary,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            marginBottom: spacing.md,
            opacity: busy ? 0.7 : 1,
          }}
        >
          <Text style={{ ...typography.button, fontSize: 18, color: colors.ui.white }}>Start my journey</Text>
          <Ionicons name="arrow-forward" size={22} color={colors.ui.white} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default FirstDayDashboardScreen;
