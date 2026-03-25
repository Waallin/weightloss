import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";
import { globalStyles } from "../../../constants/globalStyles";
import { colors } from "../../../constants/colors";
import { spacing } from "../../../constants/spacing";
import { textSizes } from "../../../constants/texts";
import CircularProgressGaugeComponent from "../../../components/CircularProgressGaugeComponent";
import { Calendar } from "react-native-calendars";
import type { MarkedDates } from "react-native-calendars/src/types";

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

const formatLocalYmd = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const buildGoalCompletedMarkedDates = (todayYmd: string): MarkedDates => {
  const marked: MarkedDates = {};
  for (const date of MOCK_GOAL_COMPLETED_DATES) {
    if (date > todayYmd) continue;
    marked[date] = {
      customStyles: {
        container: {
          backgroundColor: colors.ui.success,
          borderRadius: spacing.rounded,
          alignItems: "center",
          justifyContent: "center",
          width: 34,
          height: 34,
        },
        text: {
          color: colors.text.primary,
          fontWeight: "700",
        },
      },
    };
  }
  return marked;
};

const ProgressScreen = () => {
  const todayYmd = useMemo(() => formatLocalYmd(new Date()), []);
  const goalMarkedDates = useMemo(
    () => buildGoalCompletedMarkedDates(todayYmd),
    [todayYmd],
  );

  const renderCalendarComponent = () => {
    return (
      <View style={{ gap: spacing.sm }}>
        <Text
          style={{
            fontSize: textSizes.lg,
            fontWeight: "bold",
            marginBottom: spacing.xs,
          }}
        >
          Calendar
        </Text>
        <View
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
            markedDates={goalMarkedDates}
            firstDay={1}
            hideExtraDays
            enableSwipeMonths
            theme={{
              backgroundColor: "transparent",
              calendarBackground: "transparent",
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
            }}
            style={{
              width: "100%",
            }}
          />
        </View>
      </View>
    );
  };
  const renderCircularProgressGauge = () => {
    return (
      <View
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
            gap: spacing.sm,
          }}
        >
          <Text style={{ fontSize: textSizes.lg, fontWeight: "bold" }}>
            You're doing great! Keep it up!
          </Text>
          <Text
            style={{ fontSize: textSizes.sm, color: colors.text.secondary }}
          >
            Keep pushing, you're making fantastic progress!
          </Text>
        </View>
      </View>
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

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: spacing.scrollViewBottomPadding,
        gap: spacing.xl,
        marginTop: spacing.xl,
      }}
      style={{
        ...globalStyles.container,
      }}
    >
      {renderCircularProgressGauge()}
      {renderStreaksComponent()}
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
