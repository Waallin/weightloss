import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MotiView } from "moti";
import { ReduceMotion } from "react-native-reanimated";
import { globalStyles } from "../../../constants/globalStyles";
import { colors } from "../../../constants/colors";
import { typography } from "../../../constants/texts";
import { spacing } from "../../../constants/spacing";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import * as haptics from "expo-haptics";
import useTodayProgressStore from "../../../stores/useTodayProgressStore";
import useTodayDietStore from "../../../stores/useTodayDietStore";
const currentYear = new Date().getFullYear()
import { RootStackParamList } from "../../navigation/types";
import useUserStore from "../../../stores/useUserStore";
import { useTodaySteps } from "../../../services/healthkit";
import { calculatePoints } from "../../../services/dietPoints";
import { getDays, syncToday } from "../../../services/firebase";
import { trackMixpanelEvent } from "../../../services/mixpanel";
import { analyticsEvents } from "../../../constants/analytics";
import { trackStepsFirstDetected } from "../../../services/tracking";
import SaveProgressCard from "./components/SaveProgressCard";
import GoalRing from "../../../components/GoalRing";
import ConnectHealthSheet from "../../../components/ConnectHealthSheet";
import useHealthConnected from "../../../hooks/useHealthConnected";
import {
  DayDoc,
  STEP_GOAL,
  buildWeek,
  formatNumber,
  getJourneyPosition,
  ptsWord,
  slotForNow,
  stepsStatusFor,
} from "../../../utils/goals";

const CARD_RADIUS = 24;
const cardShadow = {
  shadowColor: colors.goals.dark,
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.06,
  shadowRadius: 24,
  elevation: 4,
};

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { todayProgress, setTodayProgress } = useTodayProgressStore();
  const { todayDiet } = useTodayDietStore();
  const todaySteps = useTodaySteps();
  const { user } = useUserStore();
  const { connected: healthConnected, markRequested } = useHealthConnected(todaySteps);
  const [connectVisible, setConnectVisible] = useState(false);
  const [days, setDays] = useState<DayDoc[]>([]);
  const rewardShownRef = useRef(false);

  useEffect(() => {
    trackMixpanelEvent(analyticsEvents.homeViewed);    
  }, []);

  useEffect(() => {
    if (todaySteps > 0) trackStepsFirstDetected();
  }, [todaySteps > 0]);

  useEffect(() => {
    if (rewardShownRef.current) return;
    if (todaySteps >= STEP_GOAL && todayProgress?.completion?.steps === false) {
      rewardShownRef.current = true;
      navigation.navigate("MoveGoalReward", { steps: todaySteps });
    }
  }, [todaySteps, todayProgress?.completion?.steps, navigation]);

  const handleSyncToday = useCallback(async () => {
    if (!user?.email) return;
    const points = calculatePoints(
      user?.currentWeight ?? user?.startWeight,
      user?.height ?? 0,
      currentYear - user?.birthYear,
      user?.gender ?? "Male",
      todaySteps,
    );

    const syncedDay = await syncToday(user.email as string, todaySteps, points);
    if (syncedDay != null) {
      setTodayProgress(syncedDay);
    }
  }, [
    todaySteps,
    user?.email,
    user?.currentWeight,
    user?.startWeight,
    user?.height,
    user?.birthYear,
    user?.gender,
    setTodayProgress,
  ]);

  useFocusEffect(
    useCallback(() => {
      handleSyncToday();
    }, [handleSyncToday]),
  );

  useFocusEffect(
    useCallback(() => {
      if (!user?.email) return;
      getDays(user.email as string).then((result) => setDays(result as DayDoc[]));
    }, [user?.email]),
  );

  const total = todayProgress?.points?.total ?? 0;
  const used = todayProgress?.points?.used ?? 0;
  const left = total - used;
  const over = left < 0;
  const mealsCount = todayDiet?.length ?? 0;
  const steps = todayProgress?.progress?.steps ?? todaySteps ?? 0;
  const moveDone = healthConnected && steps >= STEP_GOAL;
  const stepsRem = Math.max(STEP_GOAL - steps, 0);
  const walkMin = Math.max(Math.ceil(stepsRem / 100), 1);

  const journey = useMemo(() => getJourneyPosition(user?.createdAt), [user?.createdAt]);
  const week = useMemo(() => buildWeek(user?.createdAt, days), [user?.createdAt, days]);
  const bothCount = week.filter((d) => d.hasData && d.both).length;

  const openScan = () => {
    haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("ScanFoodScreen");
  };

  const openConnect = () => {
    haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
    setConnectVisible(true);
  };

  const renderHeader = () => {
    const dateLabel = new Date().toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    const weekLabel =
      journey.weekNumber === 1 ? "of your first week" : `of week ${journey.weekNumber}`;

    return (
      <MotiView
        from={{ opacity: 0, translateY: 10, scale: 0.98 }}
        animate={{ opacity: 1, translateY: 0, scale: 1 }}
        transition={{ type: "timing", duration: 450, reduceMotion: ReduceMotion.Never }}
        style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}
      >
        <View>
          <Text style={{ ...typography.screenTitle, color: colors.text.primary }}>Today</Text>
          <Text style={{ ...typography.bodyMedium, color: colors.goals.muted, marginTop: 2 }}>
            {dateLabel} · Day {journey.dayInWeek} {weekLabel}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.75}
          accessibilityLabel="Profile and settings"
          onPress={() => {
            haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
            navigation.navigate("SettingsScreen");
          }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "#EFEFF2",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="person-outline" size={20} color={colors.text.primary} />
        </TouchableOpacity>
      </MotiView>
    );
  };

  const renderGoals = () => {
    let winsLine = "Updated live";
    let winsColor = colors.goals.muted;
    if (moveDone && mealsCount > 0 && !over) {
      winsLine = "Move done · Eat on pace";
      winsColor = colors.goals.eat;
    } else if (moveDone) {
      winsLine = "Move goal done";
      winsColor = colors.goals.move;
    } else if (mealsCount > 0 && !over) {
      winsLine = "Eat on pace";
      winsColor = colors.goals.eat;
    }

    const eatFill = total > 0 ? (Math.min(used / total, 1) * 100) : 0;
    const pillText = mealsCount === 0 ? `Fresh ${total} today` : over ? `Over by ${-left}` : "On pace";
    const pillColor = mealsCount === 0 ? colors.goals.muted : over ? colors.goals.over : colors.goals.eat;

    return (
      <MotiView
        from={{ opacity: 0, translateY: 10, scale: 0.98 }}
        animate={{ opacity: 1, translateY: 0, scale: 1 }}
        transition={{ type: "timing", duration: 450, delay: 100, reduceMotion: ReduceMotion.Never }}
        style={{
          backgroundColor: colors.ui.white,
          borderRadius: CARD_RADIUS,
          paddingTop: 18,
          paddingHorizontal: spacing.md,
          paddingBottom: spacing.md,
          ...cardShadow,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", paddingHorizontal: spacing.xs }}>
          <Text style={{ ...typography.cardTitle, color: colors.text.primary }}>Your two goals</Text>
          <Text style={{ ...typography.bodySemiBold, color: winsColor }}>{winsLine}</Text>
        </View>
        <View style={{ flexDirection: "row", marginTop: 14, gap: spacing.sm }}>
          <View style={{ flex: 1, alignItems: "center" }}>
            <GoalRing fill={eatFill} color={over ? colors.goals.overRing : colors.goals.eatRing}>
              <Text style={{ ...typography.displayNumeric, fontSize: 30, lineHeight: 34, color: over ? colors.goals.over : colors.text.primary }}>
                {over ? -left : left}
              </Text>
              <Text style={{ ...typography.small, color: colors.goals.muted }}>
                {over ? "over budget" : `left of ${total}`}
              </Text>
            </GoalRing>
            <View style={{ marginTop: 10, flexDirection: "row", alignItems: "center", gap: 6 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.goals.eatRing }} />
              <Text style={{ ...typography.cardTitle, fontSize: 15, color: colors.text.primary }}>Eat smart</Text>
            </View>
            <Text style={{ ...typography.bodySemiBold, color: pillColor, marginTop: 2 }}>{pillText}</Text>
          </View>

          <View style={{ flex: 1, alignItems: "center" }}>
            {healthConnected ? (
              <>
                <GoalRing
                  fill={(Math.min(steps / STEP_GOAL, 1)) * 100}
                  color={colors.goals.moveRing}
                  done={moveDone}
                  doneColor={colors.goals.move}
                >
                  <Text style={{ ...typography.displayNumeric, fontSize: 26, lineHeight: 32, color: colors.text.primary }}>
                    {formatNumber(steps)}
                  </Text>
                  <Text style={{ ...typography.small, color: colors.goals.muted }}>
                    {`of ${formatNumber(STEP_GOAL)} steps`}
                  </Text>
                </GoalRing>
                <View style={{ marginTop: 10, flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.goals.moveRing }} />
                  <Text style={{ ...typography.cardTitle, fontSize: 15, color: colors.text.primary }}>Move daily</Text>
                </View>
                <Text style={{ ...typography.bodySemiBold, color: colors.goals.move, marginTop: 2 }}>
                  {stepsStatusFor(steps)}
                </Text>
              </>
            ) : (
              <>
                <View
                  style={{
                    width: 116,
                    height: 116,
                    borderRadius: 58,
                    borderWidth: 2,
                    borderStyle: "dashed",
                    borderColor: colors.goals.moveSoftBorder,
                    backgroundColor: "#F7F6FE",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  <MaterialCommunityIcons name="shoe-print" size={30} color={colors.goals.move} />
                  <Text style={{ ...typography.small, fontFamily: typography.bodySemiBold.fontFamily, color: colors.goals.move }}>
                    Not tracking yet
                  </Text>
                </View>
                <View style={{ marginTop: 10, flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.goals.moveRing }} />
                  <Text style={{ ...typography.cardTitle, fontSize: 15, color: colors.text.primary }}>Move daily</Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={openConnect}
                  style={{
                    marginTop: 6,
                    height: 36,
                    paddingHorizontal: 12,
                    borderRadius: 14,
                    backgroundColor: colors.goals.moveSoft,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ ...typography.buttonSecondary, color: colors.goals.move }}>
                    Turn on step tracking
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </MotiView>
    );
  };

  const renderNextUp = () => {
    const slot = slotForNow();
    const evening = new Date().getHours() >= 20;
    const nearGoal = healthConnected && !moveDone && stepsRem <= 1000 && mealsCount > 0;
    let theme: "light" | "move" | "dark" = "light";
    let kicker = "Next up";
    let title: string = slot;
    let body = "";

    if (mealsCount === 0 && journey.weekNumber === 1 && journey.dayInWeek === 1) {
      kicker = "Start here";
      title = "Scan your first meal";
      body =
        "Tap Scan below and point your camera at your plate. We count the points." +
        (healthConnected ? " Your steps are already counting." : "");
    } else if (nearGoal) {
      theme = "move";
      kicker = "Almost there";
      title = `${formatNumber(stepsRem)} steps to go`;
      body = `About a ${walkMin}-minute walk. Your steps update by themselves, so there is nothing to log.`;
    } else if (evening && mealsCount > 0) {
      theme = "dark";
      if (moveDone && !over) {
        kicker = "Today";
        title = "Both goals on track";
        body = `Meals logged and your steps are done. ${left} points left if you want a snack.`;
      } else {
        const moveBit = !healthConnected
          ? " Turn on step tracking to count your steps too."
          : moveDone
            ? " Move goal done."
            : ` ${formatNumber(stepsRem)} steps to go.`;
        kicker = "Tonight";
        title = "Meals logged";
        body =
          (over ? `You are ${-left} over. One day does not make a week.` : `${left} points left for a snack.`) +
          moveBit;
      }
    } else if (over) {
      body = `You are ${-left} over, so keep ${slot.toLowerCase()} light and log it anyway.`;
    } else if (slot === "Breakfast") {
      body = `You have ${left} points. A regular breakfast is 2–5.`;
    } else if (slot === "Lunch") {
      body =
        `You have ${left} points left. A regular lunch is 5–8.` +
        (healthConnected && !moveDone && steps < STEP_GOAL / 2 ? " A walk after lunch gets you halfway to 5,000." : "");
    } else if (left >= 12) {
      body = `You have ${left} points left. Enough for a full dinner and a snack.`;
    } else if (left >= 7) {
      body = `You have ${left} points left. Room for a regular dinner.`;
    } else {
      body = `Only ${left} points left. Go for something lighter.`;
    }

    const bg = theme === "dark" ? colors.goals.dark : theme === "move" ? colors.goals.moveSoft : colors.ui.white;
    const fg = theme === "dark" ? colors.ui.white : colors.text.primary;
    const kickerColor = theme === "dark" ? "#A9A4CC" : theme === "move" ? colors.goals.move : colors.goals.eat;
    const subColor = theme === "dark" ? "#D9D6EE" : colors.goals.muted;

    return (
      <MotiView
        from={{ opacity: 0, translateY: 10, scale: 0.98 }}
        animate={{ opacity: 1, translateY: 0, scale: 1 }}
        transition={{ type: "timing", duration: 450, delay: 160, reduceMotion: ReduceMotion.Never }}
        style={{
          backgroundColor: bg,
          borderRadius: CARD_RADIUS,
          paddingVertical: 18,
          paddingHorizontal: 20,
          ...globalStyles.shadow,
          shadowOpacity: 0.04,
        }}
      >
        <Text style={{ ...typography.captionSemiBold, fontSize: 13, letterSpacing: 0.6, textTransform: "uppercase", color: kickerColor }}>
          {kicker}
        </Text>
        <Text style={{ ...typography.headline, fontSize: 19, color: fg, marginTop: spacing.xs }}>{title}</Text>
        <Text style={{ ...typography.body, fontSize: 15, lineHeight: 22, color: subColor, marginTop: spacing.xs }}>
          {body}
        </Text>
      </MotiView>
    );
  };

  const renderMeals = () => {
    return (
      <MotiView
        from={{ opacity: 0, translateY: 10, scale: 0.98 }}
        animate={{ opacity: 1, translateY: 0, scale: 1 }}
        transition={{ type: "timing", duration: 450, delay: 220, reduceMotion: ReduceMotion.Never }}
      >
        <View style={{ flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", marginTop: spacing.sm }}>
          <Text style={{ ...typography.headline, color: colors.text.primary }}>Meals</Text>
          <Text style={{ ...typography.bodyMedium, color: colors.goals.muted }}>{mealsCount} logged</Text>
        </View>
        <View
          style={{
            marginTop: 10,
            backgroundColor: colors.ui.white,
            borderRadius: CARD_RADIUS,
            paddingVertical: spacing.xs,
            paddingHorizontal: spacing.md,
            ...globalStyles.shadow,
            shadowOpacity: 0.04,
          }}
        >
          {mealsCount === 0 ? (
            <View style={{ minHeight: 58, justifyContent: "center" }}>
              <Text style={{ ...typography.bodyMedium, fontSize: 15, color: "#9A96AE" }}>
                Nothing logged yet today
              </Text>
            </View>
          ) : (
            todayDiet.map((entry: any, index: number) => {
              const pts = Number(entry?.points ?? 0);
              return (
                <View
                  key={`${entry?.sourceId ?? "row"}-${index}`}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    minHeight: 58,
                    borderBottomWidth: 1,
                    borderBottomColor: "#F2F2F4",
                  }}
                >
                  <Text numberOfLines={1} style={{ flex: 1, ...typography.cardTitle, fontSize: 15, color: colors.text.primary }}>
                    {entry?.title}
                  </Text>
                  <Text style={{ ...typography.cardTitle, fontSize: 15, color: colors.goals.eat }}>
                    {Number.isFinite(pts) ? `${pts} ${ptsWord(pts)}` : entry?.points}
                  </Text>
                </View>
              );
            })
          )}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
              navigation.navigate("DietListScreen", {});
            }}
            style={{ minHeight: 50, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderTopWidth: mealsCount === 0 ? 1 : 0, borderTopColor: "#F2F2F4" }}
          >
            <Text style={{ ...typography.bodySemiBold, color: colors.goals.eat }}>
              Add manually or browse recipes
            </Text>
            <Ionicons name="chevron-forward" size={18} color={colors.goals.eat} />
          </TouchableOpacity>
        </View>
      </MotiView>
    );
  };

  const renderWeek = () => {
    return (
      <MotiView
        from={{ opacity: 0, translateY: 10, scale: 0.98 }}
        animate={{ opacity: 1, translateY: 0, scale: 1 }}
        transition={{ type: "timing", duration: 450, delay: 280, reduceMotion: ReduceMotion.Never }}
      >
        <View style={{ flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", marginTop: spacing.sm }}>
          <Text style={{ ...typography.headline, color: colors.text.primary }}>
            {journey.weekNumber === 1 ? "Your first week" : `Week ${journey.weekNumber}`}
          </Text>
          <Text style={{ ...typography.bodyMedium, color: colors.goals.muted }}>{bothCount} of 7 with both</Text>
        </View>
        <View
          style={{
            marginTop: 10,
            backgroundColor: colors.ui.white,
            borderRadius: CARD_RADIUS,
            padding: spacing.md,
            ...globalStyles.shadow,
            shadowOpacity: 0.04,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            {week.map((d) => {
              const state = d.hasData ? (d.both ? "done" : "partial") : d.isToday ? "today" : "future";
              const bg =
                state === "done" ? colors.goals.dark : state === "partial" ? colors.goals.ringTrack : state === "today" ? colors.ui.white : "#F2F2F4";
              const fg =
                state === "done" ? colors.ui.white : state === "today" ? colors.goals.dark : state === "partial" ? colors.goals.muted : "#8E8AA3";
              return (
                <View key={d.n} style={{ flex: 1, alignItems: "center", gap: 6 }}>
                  <Text style={{ ...typography.small, color: colors.goals.muted }}>{d.label}</Text>
                  <View
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 17,
                      backgroundColor: bg,
                      borderWidth: state === "today" || (d.isCheckIn && state === "future") ? 2 : 0,
                      borderStyle: d.isCheckIn && state === "future" ? "dashed" : "solid",
                      borderColor: state === "today" ? colors.goals.dark : "#C8C8CF",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {state === "done" ? (
                      <Ionicons name="checkmark" size={18} color={colors.ui.white} />
                    ) : (
                      <Text style={{ ...typography.bodySemiBold, color: fg }}>{d.n}</Text>
                    )}
                  </View>
                  <View style={{ flexDirection: "row", gap: 4 }}>
                    {[
                      { on: d.isToday ? mealsCount > 0 && !over : d.hasData && d.eat, color: colors.goals.eatRing },
                      { on: d.isToday ? moveDone : d.hasData && d.move, color: colors.goals.moveRing },
                    ].map((dot, i) => (
                      <View
                        key={i}
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: 4,
                          backgroundColor: dot.on ? dot.color : "transparent",
                          borderWidth: dot.on ? 0 : 1.5,
                          borderColor: colors.goals.dotEmpty,
                        }}
                      />
                    ))}
                  </View>
                </View>
              );
            })}
          </View>
          <View style={{ marginTop: 12, flexDirection: "row", flexWrap: "wrap", gap: 14 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: colors.goals.eatRing }} />
              <Text style={{ ...typography.small, fontSize: 13, color: colors.goals.muted }}>Eat smart</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: colors.goals.moveRing }} />
              <Text style={{ ...typography.small, fontSize: 13, color: colors.goals.muted }}>Move daily</Text>
            </View>
            <Text style={{ ...typography.small, fontSize: 13, color: colors.goals.muted }}>Check = both goals</Text>
          </View>
          <Text style={{ ...typography.bodyMedium, lineHeight: 20, color: colors.goals.muted, marginTop: spacing.sm }}>
            Day 7 is your check-in. Step on the scale once and log your weight.
          </Text>
        </View>
      </MotiView>
    );
  };

  return (
    <View style={{
      flex: 1
    }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ ...globalStyles.scrollContainer, gap: 12 }}
        style={globalStyles.container}
      >
        {renderHeader()}
        {renderGoals()}
        <SaveProgressCard eligible={mealsCount > 0 || days.length > 1} />
        {renderNextUp()}
        {renderMeals()}
        {renderWeek()}
      </ScrollView>
      <ConnectHealthSheet
        visible={connectVisible}
        onClose={() => setConnectVisible(false)}
        onConnected={markRequested}
      />
    </View>
  );
};

export default HomeScreen;
