import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import React, { useMemo } from "react";
import { MotiView } from "moti";
import { ReduceMotion } from "react-native-reanimated";
import { globalStyles } from "../../../constants/globalStyles";
import { colors } from "../../../constants/colors";
import { spacing } from "../../../constants/spacing";
import {
  logWeightCopy,
  progressCalendarCopy,
  progressGaugeCopy,
  progressWeightsCopy,
  textSizes,
} from "../../../constants/texts";
import { Calendar } from "react-native-calendars";
import type { Theme } from "react-native-calendars/src/types";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import * as haptics from "expo-haptics";
import useUserStore from "../../../stores/useUserStore";
import {
  formatJourneyStartedDate,
  formatLocalYmd,
  parseUserCreatedAt,
} from "../../../utils/dateUtils";
import { AnimatedCircularProgress } from "react-native-circular-progress";

const CIRCLE_SIZE = 200;
const CIRCLE_WIDTH = 15;

const formatKgDisplay = (value: number | null | undefined): string => {
  if (value == null || Number.isNaN(Number(value))) {
    return progressWeightsCopy.notSet;
  }
  const n = Number(value);
  const str = Number.isInteger(n) ? String(n) : n.toFixed(1);
  return `${str} ${logWeightCopy.unitKg}`;
};

const ProgressScreen = () => {
  const todayYmd = formatLocalYmd(new Date());
  const navigation = useNavigation();
  const { user } = useUserStore();

  const startYmd = useMemo(() => {
    const d = parseUserCreatedAt(user?.createdAt);
    let ymd = formatLocalYmd(d);
    const today = formatLocalYmd(new Date());
    if (ymd > today) ymd = today;
    return ymd;
  }, [user?.createdAt]);

  const journeyStartedLabel = useMemo(() => {
    const d = parseUserCreatedAt(user?.createdAt);
    return formatJourneyStartedDate(d);
  }, [user?.createdAt]);

  const calendarMarkedDates = useMemo(
    () => ({
      [todayYmd]: {
        customStyles: {
          container: {
            backgroundColor: colors.ui.primary,
            width: spacing.calendarTodayCircleSize,
            height: spacing.calendarTodayCircleSize,
            borderRadius: spacing.calendarTodayCircleSize / 2,
            alignItems: "center" as const,
            justifyContent: "center" as const,
          },
          text: {
            color: colors.ui.white,
            fontWeight: "600" as const,
          },
        },
      },
    }),
    [todayYmd]
  );

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
      return `${delta} kg from goal`;
    }
    return `${progressKg} / ${totalChangeKg} kg completed`;
  }, [user?.startWeight, user?.goalWeight, user?.currentWeight, totalChangeKg, progressKg]);

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

  const renderCalendarComponent = () => {
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
          backgroundColor: colors.ui.componentBackground,
          ...globalStyles.shadow,
          padding: spacing.md,
          borderRadius: spacing.borderRadius,
          gap: spacing.sm,
        }}
      >
        <View style={{ gap: spacing.xs }}>
          <Text
            style={{
              fontSize: textSizes.lg,
              fontWeight: "700",
              color: colors.text.primary,
            }}
          >
            {progressCalendarCopy.sectionTitle}
          </Text>
          <Text style={{ fontSize: textSizes.sm, color: colors.text.secondary }}>
            {progressCalendarCopy.startedPrefix} {journeyStartedLabel}
          </Text>
        </View>
        <Calendar
          current={todayYmd}
          minDate={startYmd}
          maxDate={todayYmd}
          markingType="custom"
          markedDates={calendarMarkedDates}
          firstDay={1}
          hideExtraDays
          enableSwipeMonths
          theme={
            {
              backgroundColor: "transparent",
              calendarBackground: "transparent",
              dotStyle: {
                width: spacing.calendarWeightDotSize,
                height: spacing.calendarWeightDotSize,
                borderRadius: spacing.calendarWeightDotSize / 2,
                borderWidth: 2,
                borderColor: colors.ui.white,
                marginTop: 1,
              },
              "stylesheet.day.basic": {
                base: {
                  width: 32,
                  height: 42,
                  minHeight: 42,
                  alignItems: "center",
                },
              },
              monthTextColor: colors.text.primary,
              textMonthFontWeight: "700",
              textMonthFontSize: textSizes.lg,
              arrowColor: colors.ui.primary,
              dayTextColor: colors.text.primary,
              textDayFontSize: textSizes.sm,
              textDayFontWeight: "500",
              textSectionTitleColor: colors.text.secondary,
              textDayHeaderFontSize: textSizes.xs,
              textDayHeaderFontWeight: "600",
              todayTextColor: colors.ui.primary,
              todayBackgroundColor: "transparent",
              disabledArrowColor: colors.text.secondary,
              textDisabledColor: colors.text.secondary,
              textInactiveColor: colors.text.secondary,
              selectedDayBackgroundColor: colors.ui.primarySoft,
              selectedDayTextColor: colors.text.primary,
            } as Theme
          }
        />
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
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.lg,
          borderRadius: spacing.borderRadius,
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
                  fontWeight: "bold",
                  fontSize: 32,
                  color: colors.ui.primary,
                }}
              >
                {goalProgressPercentage}%
              </Text>
              <Text
                style={{
                  fontSize: textSizes.xs,
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
                fontSize: textSizes.lg,
                fontWeight: "600",
                textAlign: "center",
                color: colors.text.primary,
              }}
            >
              {returnWeightMicroCopy()}
            </Text>
            <Text
              style={{
                fontSize: textSizes.sm,
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
                  fontSize: textSizes.xs,
                  color: colors.text.secondary,
                  textAlign: "center",
                }}
              >
                {progressWeightsCopy.startLabel}
              </Text>
              <Text
                style={{
                  fontSize: textSizes.md,
                  fontWeight: "600",
                  color: colors.text.primary,
                  marginTop: spacing.xs,
                  textAlign: "center",
                }}
              >
                {formatKgDisplay(user?.startWeight)}
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text
                style={{
                  fontSize: textSizes.xs,
                  color: colors.text.secondary,
                  textAlign: "center",
                }}
              >
                {progressWeightsCopy.currentLabel}
              </Text>
              <Text
                style={{
                  fontSize: textSizes.md,
                  fontWeight: "600",
                  color: colors.ui.primary,
                  marginTop: spacing.xs,
                  textAlign: "center",
                }}
              >
                {formatKgDisplay(user?.currentWeight)}
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text
                style={{
                  fontSize: textSizes.xs,
                  color: colors.text.secondary,
                  textAlign: "center",
                }}
              >
                {progressWeightsCopy.goalLabel}
              </Text>
              <Text
                style={{
                  fontSize: textSizes.md,
                  fontWeight: "600",
                  color: colors.text.primary,
                  marginTop: spacing.xs,
                  textAlign: "center",
                }}
              >
                {formatKgDisplay(user?.goalWeight)}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleLogWeightPress}
          style={{
            width: "60%",
            alignItems: "center",
            justifyContent: "center",
            borderColor: colors.ui.primary,
            padding: spacing.sm,
            borderRadius: spacing.borderRadius,
            marginTop: spacing.md,
            backgroundColor: colors.ui.listRowIconBackground,
            flexDirection: "row",
            gap: spacing.xs,
          }}
        >
          <MaterialCommunityIcons name="plus" size={24} color={colors.ui.primary} />
          <Text
            style={{
              fontSize: textSizes.sm,
              color: colors.ui.primary,
              fontWeight: "bold",
            }}
          >
            {logWeightCopy.screenTitle}
          </Text>
        </TouchableOpacity>
      </MotiView>
    );
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={globalStyles.scrollContainer}
      style={{
        ...globalStyles.container,
      }}
    >
      {renderCircularProgressGauge()}
      {renderCalendarComponent()}
    </ScrollView>
  );
};

export default ProgressScreen;
