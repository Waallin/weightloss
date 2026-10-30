import React, { useEffect, useMemo, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native";
import { MotiView } from "moti";
import { ReduceMotion } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import * as haptics from "expo-haptics";
import { colors } from "../../../constants/colors";
import { spacing } from "../../../constants/spacing";
import { typography } from "../../../constants/texts";
import { RootStackParamList } from "../../navigation/types";
import useTodayProgressStore from "../../../stores/useTodayProgressStore";
import useTodayDietStore from "../../../stores/useTodayDietStore";
import useUserStore from "../../../stores/useUserStore";
import useConfettiStore from "../../../stores/useConfettiStore";
import { getDays, updateTodayProgress } from "../../../services/firebase";
import { trackMixpanelEvent } from "../../../services/mixpanel";
import { maybeAskForStoreReview } from "../../../services/storeReview";
import { analyticsEvents } from "../../../constants/analytics";
import { DayDoc, buildWeek, formatNumber, moveWin } from "../../../utils/goals";
import { getDateKey } from "../../../utils/dateUtils";

const MoveGoalRewardScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, "MoveGoalReward">>();
  const insets = useSafeAreaInsets();
  const { todayProgress, setTodayProgress } = useTodayProgressStore();
  const { todayDiet } = useTodayDietStore();
  const { user } = useUserStore();
  const { setVisibleConfetti } = useConfettiStore();
  const [days, setDays] = useState<DayDoc[]>([]);
  const claimedRef = useRef(false);
  const [ringDone, setRingDone] = useState(false);

  const steps = route.params?.steps ?? todayProgress?.progress?.steps ?? 0;

  useEffect(() => {
    if ((route.params as any)?.preview) return; // TEMP_PREVIEW
    if (claimedRef.current || !todayProgress || !user?.email) return;
    claimedRef.current = true;
    haptics.notificationAsync(haptics.NotificationFeedbackType.Success);
    setVisibleConfetti(true);
    setTodayProgress({
      ...todayProgress,
      completion: {
        ...todayProgress.completion,
        steps: true,
      },
    });
    updateTodayProgress(user.email as string, {
      "completion.steps": true,
    });
    trackMixpanelEvent(analyticsEvents.stepsGoalCompleted);
    void maybeAskForStoreReview("steps_goal", 3500);
  }, [todayProgress, user?.email]);

  useEffect(() => {
    if (!user?.email) return;
    getDays(user.email as string).then((result) => setDays(result as DayDoc[]));
  }, [user?.email]);

  const todayDoc: DayDoc = useMemo(
    () => ({
      dateKey: getDateKey(),
      points: todayProgress?.points,
      progress: { steps },
    }),
    [todayProgress?.points, steps],
  );

  const week = useMemo(
    () => buildWeek(user?.createdAt, days, todayDoc),
    [user?.createdAt, days, todayDoc],
  );

  const rewardLine = useMemo(() => {
    const total = todayProgress?.points?.total ?? 0;
    const used = todayProgress?.points?.used ?? 0;
    const left = total - used;
    if ((todayDiet?.length ?? 0) > 0 && left >= 0) {
      return `Your food is on pace too. Stay inside your ${left} points and today is a two-goal day.`;
    }
    const byKey: Record<string, DayDoc> = {};
    for (const d of days) if (d?.dateKey) byKey[d.dateKey] = d;
    let streak = 1;
    const cursor = new Date();
    for (let i = 0; i < 365; i++) {
      cursor.setDate(cursor.getDate() - 1);
      const key = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate(), 12)
        .toISOString()
        .split("T")[0];
      if (moveWin(byKey[key])) streak++;
      else break;
    }
    return `That is ${streak} day${streak === 1 ? "" : "s"} in a row on Move daily.`;
  }, [todayProgress?.points, todayDiet?.length, days]);

  const handleClose = () => {
    haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  return (
    <LinearGradient
      colors={["#7F70F0", colors.goals.move, colors.goals.dark]}
      locations={[0, 0.55, 1]}
      style={{
        flex: 1,
        alignItems: "center",
        paddingTop: 40,
        paddingBottom: insets.bottom + spacing.md,
        paddingHorizontal: spacing.lg,
      }}
    >
      <View style={{ width: 220, height: 220, alignItems: "center", justifyContent: "center" }}>
        <MotiView
          from={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: ringDone ? 1 : 0, scale: ringDone ? 1 : 0.92 }}
          transition={{ type: "timing", duration: 700, reduceMotion: ReduceMotion.Never }}
          style={{
            position: "absolute",
            width: 220,
            height: 220,
            borderRadius: 110,
            backgroundColor: "rgba(255,255,255,0.06)",
            shadowColor: colors.ui.white,
            shadowOpacity: 0.55,
            shadowRadius: 28,
            shadowOffset: { width: 0, height: 0 },
          }}
        />
        <AnimatedCircularProgress
          style={{ position: "absolute" }}
          size={220}
          width={12}
          fill={100}
          prefill={0}
          tintColor={colors.ui.white}
          backgroundColor="rgba(255,255,255,0.16)"
          rotation={0}
          lineCap="round"
          duration={1200}
          onAnimationComplete={() => setRingDone(true)}
        />
        <MotiView
          from={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 16, delay: 700, reduceMotion: ReduceMotion.Never }}
        >
          <Ionicons name="checkmark" size={96} color={colors.ui.white} />
        </MotiView>
      </View>

      <Text
        style={{
          ...typography.bodySemiBold,
          fontSize: 15,
          letterSpacing: 0.8,
          textTransform: "uppercase",
          color: "#CFC9FA",
          marginTop: 18,
        }}
      >
        Move goal done
      </Text>
      <Text style={{ ...typography.displayNumeric, fontSize: 52, lineHeight: 60, color: colors.ui.white, marginTop: 6 }}>
        {formatNumber(steps)}
      </Text>
      <Text style={{ ...typography.body, fontSize: 17, color: "#DDD9FB" }}>steps today</Text>

      <View
        style={{
          marginTop: spacing.lg,
          width: "100%",
          backgroundColor: "rgba(255,255,255,0.1)",
          borderRadius: 24,
          padding: spacing.md,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {week.map((d) => {
            const done = (d.hasData || d.isToday) && d.move;
            const today = d.isToday && !done;
            return (
              <View key={d.n} style={{ flex: 1, alignItems: "center", gap: 6 }}>
                <Text style={{ ...typography.small, color: "#CFC9FA" }}>{d.label}</Text>
                <View
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    backgroundColor: done ? colors.ui.white : today ? "transparent" : "rgba(255,255,255,0.1)",
                    borderWidth: today || (d.isCheckIn && d.isFuture) ? 2 : 0,
                    borderStyle: d.isCheckIn && d.isFuture ? "dashed" : "solid",
                    borderColor: today ? colors.ui.white : "rgba(255,255,255,0.4)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {done ? (
                    <Ionicons name="checkmark" size={16} color={colors.goals.move} />
                  ) : (
                    <Text style={{ ...typography.bodySemiBold, fontSize: 13, color: today ? colors.ui.white : "#CFC9FA" }}>
                      {d.n}
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>
        <Text style={{ ...typography.body, fontSize: 15, lineHeight: 22, color: colors.ui.white, marginTop: 12 }}>
          {rewardLine}
        </Text>
      </View>

      <View style={{ flex: 1 }} />
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleClose}
        style={{
          width: "100%",
          height: 58,
          borderRadius: 14,
          backgroundColor: colors.ui.white,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ ...typography.button, fontSize: 18, color: colors.goals.dark }}>Keep it going</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default MoveGoalRewardScreen;
