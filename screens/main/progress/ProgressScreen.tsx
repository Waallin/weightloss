import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { MotiView } from "moti";
import { ReduceMotion } from "react-native-reanimated";
import { globalStyles } from "../../../constants/globalStyles";
import { colors } from "../../../constants/colors";
import { spacing } from "../../../constants/spacing";
import {
  logWeightCopy,
  progressGaugeCopy,
  progressWeightsCopy,
  typography,
} from "../../../constants/texts";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as haptics from "expo-haptics";
import useUserStore from "../../../stores/useUserStore";
import useTodayProgressStore from "../../../stores/useTodayProgressStore";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { getDays } from "../../../services/firebase";
import { formatWeightFromKg, kgToLb } from "../../../utils/units";
import useUnitsStore from "../../../stores/useUnitsStore";
import {
  DayDoc,
  buildWeek,
  formatNumber,
  getJourneyPosition,
} from "../../../utils/goals";

const CIRCLE_SIZE = 200;
const CIRCLE_WIDTH = 15;
const CARD_RADIUS = 24;

const ProgressScreen = () => {
  const navigation = useNavigation();
  const { user } = useUserStore();
  const { weightUnit } = useUnitsStore();
  const formatWeightDisplay = (value: number | null | undefined): string => {
    return formatWeightFromKg(value, weightUnit, progressWeightsCopy.notSet);
  };
  const formatWeightNumber = (kg: number) =>
    weightUnit === "lb" ? kgToLb(kg) : Math.round(kg);
  const { todayProgress } = useTodayProgressStore();
  const [days, setDays] = useState<DayDoc[]>([]);

  useFocusEffect(useCallback(() => {
    if (!user?.email) return;
    getDays(user.email as string).then((result) => setDays(result as DayDoc[]));
  }, [user?.email]));

  const journey = useMemo(() => getJourneyPosition(user?.createdAt), [user?.createdAt]);
  const week = useMemo(
    () => buildWeek(user?.createdAt, days, todayProgress),
    [user?.createdAt, days, todayProgress],
  );
  const pastDays = week.filter((d) => d.hasData);
  const eatCount = pastDays.filter((d) => d.eat).length;
  const moveCount = pastDays.filter((d) => d.move).length;
  const avgSteps = useMemo(() => {
    const keys = new Set(pastDays.map((d) => d.dateKey));
    const stepDays = days.filter((d) => d.dateKey && keys.has(d.dateKey) && (d.progress?.steps ?? 0) > 0);
    if (stepDays.length === 0) return 0;
    const sum = stepDays.reduce((a, d) => a + (d.progress?.steps ?? 0), 0);
    return Math.round(sum / stepDays.length / 10) * 10;
  }, [days, pastDays]);

  const checkInDate = useMemo(() => {
    const d = new Date(journey.blockStart);
    d.setDate(d.getDate() + 6);
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  }, [journey.blockStart]);
  const daysToCheckIn = 7 - journey.dayInWeek;

  const totalChangeKg = useMemo(() => {
    const start = user?.startWeight;
    const goal = user?.goalWeight;
    if (start == null || goal == null) return 0;
    return Math.abs(goal - start);
  }, [user?.startWeight, user?.goalWeight]);

  const progressKg = useMemo(() => {
    const start = user?.startWeight;
    const goal = user?.goalWeight;
    const current = user?.currentWeight;
    if (start == null || goal == null || current == null) return 0;

    if (goal < start) {
      const segment = start - goal;
      const lost = start - current;
      return Math.min(Math.max(0, lost), segment);
    }
    if (goal > start) {
      const segment = goal - start;
      const gained = current - start;
      return Math.min(Math.max(0, gained), segment);
    }
    return 0;
  }, [user?.startWeight, user?.goalWeight, user?.currentWeight]);

  const goalProgressPercentage = useMemo(() => {
    const start = user?.startWeight;
    const goal = user?.goalWeight;
    const current = user?.currentWeight;
    if (start == null || goal == null || current == null) return 0;

    if (totalChangeKg > 0) {
      const raw = (progressKg / totalChangeKg) * 100;
      return Math.min(100, Math.max(0, Math.round(raw)));
    }
    return current === goal ? 100 : 0;
  }, [totalChangeKg, progressKg, user?.startWeight, user?.goalWeight, user?.currentWeight]);

  const progressSummaryLine = useMemo(() => {
    const start = user?.startWeight;
    const goal = user?.goalWeight;
    const current = user?.currentWeight;
    if (start == null || goal == null || current == null) {
      return "Log your weight to track progress";
    }
    if (totalChangeKg === 0) {
      if (current === goal) {
        return "At your goal weight";
      }
      const delta = Math.abs(current - goal);
      return `${formatWeightNumber(delta)} ${weightUnit} from goal`;
    }
    return `${formatWeightNumber(progressKg)} / ${formatWeightNumber(totalChangeKg)} ${weightUnit} completed`;
  }, [user?.startWeight, user?.goalWeight, user?.currentWeight, totalChangeKg, progressKg, weightUnit]);

  const returnWeightMicroCopy = () => {
    const start = user?.startWeight;
    const goal = user?.goalWeight;
    const current = user?.currentWeight;
    if (start != null && goal != null && current != null && start === goal) {
      if (current === goal) {
        return "You're at your goal 💪";
      }
      return "Every step toward your goal counts";
    }
    const p = goalProgressPercentage;
    if (totalChangeKg > 0 && p >= 100) {
      return "Goal reached 🎉";
    }
    if (p >= 95) {
      return "So close. Finish strong 🏁";
    }
    if (p >= 85) {
      return "Final stretch ✨";
    }
    if (p >= 70) {
      return "Amazing progress 🚀";
    }
    if (p >= 50) {
      return "Halfway there 🎯";
    }
    if (p >= 35) {
      return "Great progress 💪";
    }
    if (p >= 25) {
      return "Keep it going";
    }
    if (p >= 15) {
      return "Nice momentum";
    }
    if (p >= 10) {
      return "Good start 👏";
    }
    if (p > 0) {
      return "You're on your way";
    }
    return "Let's get started 💪";
  };

  const handleLogWeightPress = () => {
    haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("LogWeightScreen");
  };

  const renderSummary = () => {
    return (
      <MotiView
        from={{ opacity: 0, translateY: 10, scale: 0.98 }}
        animate={{ opacity: 1, translateY: 0, scale: 1 }}
        transition={{ type: "timing", duration: 450, reduceMotion: ReduceMotion.Never }}
        style={{ gap: 12 }}
      >
        <View>
          <Text style={{ ...typography.screenTitle, color: colors.text.primary }}>Progress</Text>
          <Text style={{ ...typography.bodyMedium, color: colors.goals.muted, marginTop: 2 }}>
            Week {journey.weekNumber} · the two things you control
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: 12 }}>
          {[
            { label: "Eat smart", dot: colors.goals.eatRing, value: eatCount, valueColor: colors.goals.eat, sub: "days inside budget" },
            {
              label: "Move daily",
              dot: colors.goals.moveRing,
              value: moveCount,
              valueColor: colors.goals.move,
              sub: avgSteps ? `days at 5,000 · avg ${formatNumber(avgSteps)}` : "days at 5,000 steps",
            },
          ].map((card) => (
            <View
              key={card.label}
              style={{
                flex: 1,
                backgroundColor: colors.ui.white,
                borderRadius: CARD_RADIUS,
                padding: spacing.md,
                ...globalStyles.shadow,
                shadowOpacity: 0.04,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: card.dot }} />
                <Text style={{ ...typography.bodySemiBold, color: colors.goals.muted }}>{card.label}</Text>
              </View>
              <Text style={{ ...typography.displayNumeric, fontSize: 30, lineHeight: 36, color: card.valueColor, marginTop: 6 }}>
                {card.value}
              </Text>
              <Text style={{ ...typography.small, fontSize: 13, color: colors.goals.muted }}>{card.sub}</Text>
            </View>
          ))}
        </View>
      </MotiView>
    );
  };

  const renderCheckIn = () => {
    return (
      <MotiView
        from={{ opacity: 0, translateY: 10, scale: 0.98 }}
        animate={{ opacity: 1, translateY: 0, scale: 1 }}
        transition={{ type: "timing", duration: 450, delay: 160, reduceMotion: ReduceMotion.Never }}
        style={{ gap: 12 }}
      >
        <View
          style={{
            backgroundColor: colors.ui.white,
            borderRadius: CARD_RADIUS,
            padding: 20,
            ...globalStyles.shadow,
            shadowOpacity: 0.06,
          }}
        >
          <View style={{ flexDirection: "row", gap: 14, alignItems: "center" }}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                backgroundColor: "#EFEFF2",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialCommunityIcons name="scale-bathroom" size={22} color={colors.text.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ ...typography.captionSemiBold, fontSize: 13, letterSpacing: 0.6, textTransform: "uppercase", color: colors.goals.muted }}>
                Weekly check-in
              </Text>
              <Text style={{ ...typography.titleBold, color: colors.text.primary, marginTop: 2 }}>
                {checkInDate} · {daysToCheckIn <= 0 ? "today" : `in ${daysToCheckIn} day${daysToCheckIn === 1 ? "" : "s"}`}
              </Text>
            </View>
          </View>
          <Text style={{ ...typography.body, fontSize: 15, lineHeight: 22, color: colors.goals.muted, marginTop: 12 }}>
            Step on the scale that morning and log your weight. Once a week shows the real trend.
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleLogWeightPress}
            accessibilityRole="button"
            style={{
              alignSelf: "flex-start",
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              height: 44,
              paddingHorizontal: 18,
              marginTop: spacing.md,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: colors.ui.primary,
              backgroundColor: "transparent",
            }}
          >
            <Text style={{ ...typography.buttonSecondary, color: colors.goals.eat }}>
              {logWeightCopy.screenTitle}
            </Text>
            <MaterialCommunityIcons name="arrow-right" size={18} color={colors.goals.eat} />
          </TouchableOpacity>
        </View>
        <View style={{ paddingVertical: spacing.md, paddingHorizontal: 18, borderRadius: CARD_RADIUS, backgroundColor: "#EFEFF2" }}>
          <Text style={{ ...typography.bodyMedium, lineHeight: 21, color: colors.text.primary }}>
            <Text style={{ fontFamily: typography.bodySemiBold.fontFamily }}>Why not weigh in every day? </Text>
            Weight swings a kilo overnight from water, salt and sleep. Your two daily goals are the signal; the scale confirms it weekly.
          </Text>
        </View>
      </MotiView>
    );
  };

  const renderCircularProgressGauge = () => {
    return (
      <MotiView
        from={{ opacity: 0, translateY: 10, scale: 0.98 }}
        animate={{ opacity: 1, translateY: 0, scale: 1 }}
        transition={{
          type: "timing",
          duration: 450,
          delay: 100,
          reduceMotion: ReduceMotion.Never,
        }}
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          backgroundColor: colors.ui.componentBackground,
          ...globalStyles.shadow,
          shadowOpacity: 0.06,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.lg,
          borderRadius: CARD_RADIUS,
        }}
      >
        <View style={{ alignItems: "center", width: "100%" }}>
          <View
            style={{
              width: CIRCLE_SIZE,
              height: CIRCLE_SIZE,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AnimatedCircularProgress
              style={{ position: "absolute" }}
              size={CIRCLE_SIZE}
              width={CIRCLE_WIDTH}
              fill={goalProgressPercentage}
              tintColor={colors.ui.primary}
              backgroundColor={colors.ui.circularGaugeTrack}
              rotation={0}
              arcSweepAngle={360}
              lineCap="round"
              duration={900}
            />
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: spacing.sm,
              }}
            >
              <Text
                style={{
                  ...typography.displayNumeric,
                  color: colors.ui.primary,
                }}
              >
                {goalProgressPercentage}%
              </Text>
              <Text
                style={{
                  ...typography.small,
                  color: colors.text.secondary,
                  textAlign: "center",
                  marginTop: spacing.xs,
                }}
              >
                {progressGaugeCopy.toGoalLabel}
              </Text>
            </View>
          </View>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              gap: spacing.sm,
              marginTop: spacing.md,
              paddingHorizontal: spacing.sm,
              width: "100%",
            }}
          >
            <Text
              style={{
                ...typography.subheadline,
                textAlign: "center",
                color: colors.text.primary,
              }}
            >
              {returnWeightMicroCopy()}
            </Text>
            <Text
              style={{
                ...typography.body,
                color: colors.text.secondary,
                textAlign: "center",
              }}
            >
              {progressSummaryLine}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              marginTop: spacing.lg,
              paddingTop: spacing.md,
              borderTopWidth: 1,
              borderTopColor: colors.ui.cardBorder,
              paddingHorizontal: spacing.xs,
            }}
          >
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text
                style={{
                  ...typography.statLabel,
                  color: colors.text.secondary,
                  textAlign: "center",
                }}
              >
                {progressWeightsCopy.startLabel}
              </Text>
              <Text
                style={{
                  ...typography.statValue,
                  color: colors.text.primary,
                  marginTop: spacing.xs,
                  textAlign: "center",
                }}
              >
                {formatWeightDisplay(user?.startWeight)}
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text
                style={{
                  ...typography.statLabel,
                  color: colors.text.secondary,
                  textAlign: "center",
                }}
              >
                {progressWeightsCopy.currentLabel}
              </Text>
              <Text
                style={{
                  ...typography.statValue,
                  color: colors.ui.primary,
                  marginTop: spacing.xs,
                  textAlign: "center",
                }}
              >
                {formatWeightDisplay(user?.currentWeight)}
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text
                style={{
                  ...typography.statLabel,
                  color: colors.text.secondary,
                  textAlign: "center",
                }}
              >
                {progressWeightsCopy.goalLabel}
              </Text>
              <Text
                style={{
                  ...typography.statValue,
                  color: colors.text.primary,
                  marginTop: spacing.xs,
                  textAlign: "center",
                }}
              >
                {formatWeightDisplay(user?.goalWeight)}
              </Text>
            </View>
          </View>
        </View>
      </MotiView>
    );
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ ...globalStyles.scrollContainer, gap: 12 }}
      style={{
        ...globalStyles.container,
      }}
    >
      {renderSummary()}
      {renderCircularProgressGauge()}
      {renderCheckIn()}
    </ScrollView>
  );
};

export default ProgressScreen;
