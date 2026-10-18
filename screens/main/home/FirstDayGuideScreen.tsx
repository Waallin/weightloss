import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { colors } from "../../../constants/colors";
import { spacing } from "../../../constants/spacing";
import { typography } from "../../../constants/texts";
import { RootStackParamList } from "../../navigation/types";
import { useTodaySteps } from "../../../services/healthkit";
import { calculatePoints } from "../../../services/dietPoints";
import useTodayProgressStore from "../../../stores/useTodayProgressStore";
import useUserStore from "../../../stores/useUserStore";
import useUnitsStore from "../../../stores/useUnitsStore";
import { trackMixpanelEvent } from "../../../services/mixpanel";
import { analyticsEvents } from "../../../constants/analytics";
import ConnectHealthSheet from "../../../components/ConnectHealthSheet";
import useHealthConnected from "../../../hooks/useHealthConnected";
import { formatWeightFromKg } from "../../../utils/units";
import { formatNumber } from "../../../utils/goals";

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
  const { weightUnit } = useUnitsStore();
  const todaySteps = useTodaySteps();
  const { connected: healthConnected, markRequested } = useHealthConnected(todaySteps);
  const [connectVisible, setConnectVisible] = useState(false);
  const [ready, setReady] = useState(false);

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

  const hasPlanWeights = user?.startWeight != null && user?.goalWeight != null;
  const planLine = hasPlanWeights
    ? ` Built from your plan: ${formatWeightFromKg(user?.startWeight, weightUnit)} → ${formatWeightFromKg(user?.goalWeight, weightUnit)}.`
    : "";

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

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.ui.background }}
      edges={["top", "bottom"]}
    >
      <View style={{ flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.md }}>
        <View style={{ alignItems: "center" }}>
          <Image
            source={require("../../../assets/mascot/allSet.png")}
            resizeMode="contain"
            style={{ width: 124, height: 141 }}
          />
        </View>
        <View style={{ alignItems: "center", marginTop: 10 }}>
          <Text style={{ ...typography.bodySemiBold, fontSize: 15, color: colors.goals.eat }}>
            You're all set
          </Text>
          <Text
            style={{
              ...typography.screenTitle,
              fontSize: 30,
              lineHeight: 36,
              color: colors.text.primary,
              textAlign: "center",
              marginTop: 6,
            }}
          >
            Two simple goals.{"\n"}Every day.
          </Text>
        </View>

        <View style={{ marginTop: 22, gap: 10 }}>
          <View style={cardStyle}>
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
              <MaterialCommunityIcons name="target" size={22} color={colors.goals.eat} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
                <Text style={{ ...typography.titleBold, fontSize: 17, color: colors.text.primary }}>Eat smart</Text>
                <Text style={{ ...typography.titleBold, fontSize: 15, color: colors.goals.eat }}>{points} points</Text>
              </View>
              <Text style={{ ...typography.bodyMedium, lineHeight: 20, color: colors.goals.muted, marginTop: 3 }}>
                Snap your meals and we count the points.{planLine}
              </Text>
            </View>
          </View>

          <View style={cardStyle}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                backgroundColor: colors.goals.moveSoft,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialCommunityIcons name="shoe-print" size={22} color={colors.goals.move} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
                <Text style={{ ...typography.titleBold, fontSize: 17, color: colors.text.primary }}>Move daily</Text>
                <Text style={{ ...typography.titleBold, fontSize: 15, color: colors.goals.move }}>5,000 steps</Text>
              </View>
              <Text style={{ ...typography.bodyMedium, lineHeight: 20, color: colors.goals.muted, marginTop: 3 }}>
                Counted automatically from Apple Health. Nothing to log.
              </Text>
              {healthConnected ? (
                <View style={{ marginTop: spacing.sm, flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Ionicons name="checkmark" size={16} color={colors.goals.move} />
                  <Text style={{ ...typography.bodySemiBold, color: colors.goals.move }}>
                    Connected · {formatNumber(todaySteps)} steps so far today
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
                    setConnectVisible(true);
                  }}
                  style={{
                    marginTop: 10,
                    alignSelf: "flex-start",
                    height: 40,
                    paddingHorizontal: 14,
                    borderRadius: 14,
                    backgroundColor: colors.goals.moveSoft,
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ ...typography.buttonSecondary, fontSize: 15, color: colors.goals.move }}>
                    Connect Apple Health
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        <Text style={{ ...typography.bodyMedium, color: colors.goals.muted, textAlign: "center", marginTop: 14 }}>
          Hit both and the day gets a check in your week.
        </Text>

        <View style={{ flex: 1 }} />

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleScan}
          style={{
            height: 58,
            borderRadius: 14,
            backgroundColor: colors.goals.eat,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            shadowColor: colors.goals.eat,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.28,
            shadowRadius: 10,
            elevation: 6,
          }}
        >
          <Ionicons name="camera-outline" size={22} color={colors.ui.white} />
          <Text style={{ ...typography.button, fontSize: 18, color: colors.ui.white }}>
            Scan your first meal
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleLookAround}
          style={{ height: 44, alignItems: "center", justifyContent: "center", marginTop: spacing.sm }}
        >
          <Text style={{ ...typography.cardTitle, color: colors.goals.muted }}>Look around first</Text>
        </TouchableOpacity>
      </View>

      <ConnectHealthSheet
        visible={connectVisible}
        onClose={() => setConnectVisible(false)}
        onConnected={markRequested}
      />
    </SafeAreaView>
  );
};

export default FirstDayGuideScreen;
