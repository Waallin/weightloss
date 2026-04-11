import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useMemo } from "react";
import { MotiView } from "moti";
import { ReduceMotion } from "react-native-reanimated";
import { globalStyles } from "../../../constants/globalStyles";
import { colors } from "../../../constants/colors";
import { spacing } from "../../../constants/spacing";
import { textSizes } from "../../../constants/texts";
import CircularProgressGaugeComponent from "../../../components/CircularProgressGaugeComponent";
import { Calendar } from "react-native-calendars";
import type { MarkedDates, Theme } from "react-native-calendars/src/types";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import * as haptics from "expo-haptics";

/** Mock: dates (YYYY-MM-DD) when today's goal was completed */
const MOCK_GOAL_COMPLETED_DATES = [
  "2026-03-01",
  "2026-03-03",
  "2026-03-05",
  "2026-03-07",
  "2026-03-10",
  "2026-03-14",
  "2026-03-18",
  "2026-03-21",
  "2026-03-24",
  "2026-03-28",
];

const MOCK_WEIGHT_DATES = [
  "2026-03-01",
  "2026-03-02",
  "2026-03-10",
  "2026-03-18",
];

const formatLocalYmd = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const buildProgressCalendarMarkedDates = (todayYmd: string): MarkedDates => {
  const weightSet = new Set(MOCK_WEIGHT_DATES);
  const goalSet = new Set(MOCK_GOAL_COMPLETED_DATES);
  const allYmd = new Set([...MOCK_WEIGHT_DATES, ...MOCK_GOAL_COMPLETED_DATES]);
  const marked: MarkedDates = {};

  const baseText = { color: colors.text.primary };
  /** Taller cell so the weight dot is not clipped under the day number (incl. green goal days). */
  const goalDayContainer = {
    backgroundColor: colors.ui.success,
    borderRadius: spacing.borderRadius,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    minHeight: 35,
    height: 35,
  };

  const todayOutline = {
    borderWidth: spacing.calendarTodayBorderWidth,
    backgroundColor: "#ECFDF5",
    borderColor: "#22C55E",
    borderRadius: spacing.borderRadius,
  };

  for (const ymd of allYmd) {
    const hasWeight = weightSet.has(ymd);
    const hasGoal = goalSet.has(ymd);

    if (hasWeight && hasGoal) {
      marked[ymd] = {
        marked: true,
        dotColor: colors.ui.weightDot,
        customStyles: {
          container: goalDayContainer,
          text: baseText,
        },
      };
    } else if (hasWeight) {
      marked[ymd] = {
        marked: true,
        dotColor: colors.ui.weightDot,
      };
    } else {
      marked[ymd] = {
        customStyles: {
          container: goalDayContainer,
          text: baseText,
        },
      };
    }
  }

  const existingToday = marked[todayYmd];
  if (existingToday) {
    marked[todayYmd] = {
      ...existingToday,
      customStyles: {
        text: existingToday.customStyles?.text ?? baseText,
        container: {
          ...(existingToday.customStyles?.container ?? {}),
          ...todayOutline,
        },
      },
    };
  } else {
    marked[todayYmd] = {
      customStyles: {
        container: {
          ...todayOutline,
          alignItems: "center",
          justifyContent: "center",
          minHeight: 35,
          height: 35,
        },
        text: baseText,
      },
    };
  }

  return marked;
};

const ProgressScreen = () => {
  const todayYmd = useMemo(() => formatLocalYmd(new Date()), []);
  const navigation = useNavigation();
  const calendarMarkedDates = useMemo(
    () => buildProgressCalendarMarkedDates(todayYmd),
    [todayYmd],
  );

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
          gap: spacing.md,
        }}
      >
        <Calendar
          current={todayYmd}
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
          style={{
            width: "100%",
          }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.sm,
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.sm,
            }}
          >
            <View
              style={{
                width: spacing.calendarWeightDotSize,
                height: spacing.calendarWeightDotSize,
                borderRadius: spacing.calendarWeightDotSize / 2,
                backgroundColor: colors.ui.weightDot,
              }}
            />
            <Text
              style={{ fontSize: textSizes.sm, color: colors.text.primary }}
            >
              Weight logged
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.sm,
            }}
          >
            <View
              style={{
                width: spacing.md,
                height: spacing.md,
                backgroundColor: colors.ui.success,
                borderRadius: spacing.borderRadius,
              }}
            />
            <Text
              style={{ fontSize: textSizes.sm, color: colors.text.primary }}
            >
              Goal completed
            </Text>
          </View>
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
          reduceMotion: ReduceMotion.Never,
        }}
        style={{
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.ui.componentBackground,
          ...globalStyles.shadow,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.lg,
          borderRadius: spacing.borderRadius,
        }}
      >
        <CircularProgressGaugeComponent
          fill={50}
          tintColor={colors.ui.primary}
          backgroundColor={colors.ui.primarySoft}
        />
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            gap: spacing.md,
          }}
        >
          <Text style={{ fontSize: textSizes.lg, fontWeight: "600" }}>
            Halfway to your goal weight! 🎯
          </Text>
          <Text
            style={{ fontSize: textSizes.sm, color: colors.text.secondary }}
          >
            4 / 8 kg completed
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleLogWeightPress}
          style={{
            width: "60%",
            alignItems: "center",
            justifyContent: "center",
            borderColor: "#1FA971",
            padding: spacing.sm,
            borderRadius: spacing.borderRadius,
            marginTop: spacing.md,
            backgroundColor: "#E1F6EA",
            flexDirection: "row",
            gap: spacing.xs,
          }}
        >
          <MaterialCommunityIcons name="plus" size={24} color="#1FA971" />
          <Text
            style={{
              fontSize: textSizes.sm,
              color: "#1FA971",
              fontWeight: "bold",
            }}
          >
            Log weight
          </Text>
        </TouchableOpacity>
      </MotiView>
    );
  };
  const renderStreaksComponent = () => {
    return (
      <View>
        <Text
          style={{
            fontSize: textSizes.lg,
            fontWeight: "bold",
            marginBottom: spacing.sm,
          }}
        >
          Streaks
        </Text>
        <View
          style={{
            flexDirection: "row",
            backgroundColor: colors.ui.componentBackground,
            alignItems: "center",
            borderRadius: spacing.borderRadius,
            ...globalStyles.shadow,
          }}
        >
          <View
            style={{
              ...styles.streakStatsContainer,
            }}
          >
            <Text style={{ fontSize: textSizes.lg, fontWeight: "bold" }}>
              2 days
            </Text>
            <Text
              style={{ fontSize: textSizes.sm, color: colors.text.secondary }}
            >
              Current streak
            </Text>
          </View>
          <View
            style={{
              width: 1,
              position: "absolute",
              left: "50%",
              top: 0,
              bottom: 0,
              height: "100%",
              backgroundColor: colors.ui.cardBorder,
            }}
          />
          <View
            style={{
              ...styles.streakStatsContainer,
            }}
          >
            <Text style={{ fontSize: textSizes.lg, fontWeight: "bold" }}>
              13 days
            </Text>
            <Text
              style={{ fontSize: textSizes.sm, color: colors.text.secondary }}
            >
              Longest streak
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderCommingSoonComponent = () => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: spacing.lg,
          gap: spacing.sm,
          backgroundColor: colors.ui.componentBackground,
          borderRadius: spacing.borderRadius,
          padding: spacing.md,
          ...globalStyles.shadow,
        }}
      >
        <Text
          style={{
            fontSize: textSizes.lg,
            fontWeight: "bold",
            color: colors.text.primary,
          }}
        >
          Coming soon
        </Text>
        <Text
          style={{
            fontSize: textSizes.sm,
            color: colors.text.secondary,
            textAlign: "center",
          }}
        >
          We're working on this feature right now. Please check back soon!
        </Text>
      </View>
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

const styles = StyleSheet.create({
  streakStatsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
});
