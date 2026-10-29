import React from "react";
import { Dimensions, Image, Text, View } from "react-native";
import { MotiView } from "moti";
import { ReduceMotion } from "react-native-reanimated";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { colors } from "../../../constants/colors";
import { globalStyles } from "../../../constants/globalStyles";
import { spacing } from "../../../constants/spacing";
import { textStyles, typography } from "../../../constants/texts";
import { calculatePoints } from "../../../services/dietPoints";
import { STEP_GOAL, formatNumber } from "../../../utils/goals";
import { formatLb, kgToLb } from "../../../utils/units";
import useUserStore from "../../../stores/useUserStore";
import useUnitsStore from "../../../stores/useUnitsStore";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
// allSet.png is square with a lot of transparent space above and below the mascot,
// so it is drawn large and cropped vertically to keep the layout tight
const MASCOT_SIZE = Math.min(SCREEN_WIDTH * 0.98, 400);
const MASCOT_CROPPED_HEIGHT = MASCOT_SIZE * 0.58;
const currentYear = new Date().getFullYear();

type PlanRow = {
  key: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  iconColor: string;
  iconBackground: string;
  label: string;
  value: string;
  unit?: string;
  valueColor: string;
  note?: string;
};

const ease = { type: "timing", reduceMotion: ReduceMotion.Never } as const;

/** "You're all set": the user's personal plan, built from the profile answers */
const PlanSummary: React.FC = () => {
  const { user } = useUserStore();
  const { weightUnit } = useUnitsStore();

  const startWeight = user?.startWeight ?? 0;
  const goalWeight = user?.goalWeight ?? 0;
  const goalDeltaKg = Math.abs(goalWeight - startWeight);
  const goalDeltaLabel =
    weightUnit === "lb"
      ? `${formatLb(kgToLb(goalDeltaKg))} lbs`
      : `${Math.round(goalDeltaKg)} kg`;
  const targetValue =
    goalWeight === startWeight
      ? "Maintain"
      : `${goalWeight < startWeight ? "Lose" : "Gain"} ${goalDeltaLabel}`;

  const dailyPoints = calculatePoints(
    user?.currentWeight ?? user?.startWeight ?? 0,
    user?.height ?? 0,
    currentYear - (user?.birthYear ?? currentYear),
    user?.gender ?? "Male",
    0,
  ).total;

  const rows: PlanRow[] = [
    {
      key: "eat",
      icon: "food-apple-outline",
      iconColor: colors.goals.eat,
      iconBackground: colors.goals.eatSoft,
      label: "Eat Smart",
      value: formatNumber(dailyPoints),
      unit: "points a day",
      valueColor: colors.goals.eat,
      note: "Every food costs points. Filling foods like protein and fiber cost less.",
    },
    {
      key: "move",
      icon: "walk",
      iconColor: colors.goals.move,
      iconBackground: colors.goals.moveSoft,
      label: "Move Daily",
      value: formatNumber(STEP_GOAL),
      unit: "steps a day",
      valueColor: colors.goals.move,
      note: "Walking earns you extra points.",
    },
    {
      key: "goal",
      icon: "target",
      iconColor: colors.ui.primary,
      iconBackground: colors.goals.eatSoft,
      label: "Weight goal",
      value: targetValue,
      valueColor: colors.text.primary,
    },
  ];

  return (
    <View style={{ width: "100%", alignItems: "center" }}>
      <MotiView
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ...ease, duration: 550 }}
        style={{
          width: MASCOT_SIZE,
          height: MASCOT_CROPPED_HEIGHT,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: spacing.md,
        }}
      >
        <Image
          source={require("../../../assets/mascot/allSet.png")}
          resizeMode="contain"
          style={{ position: "absolute", width: MASCOT_SIZE, height: MASCOT_SIZE }}
        />
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 12 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ ...ease, duration: 420, delay: 150 }}
        style={{ alignItems: "center" }}
      >
        <Text
          style={{
            ...textStyles.onboardingTitle,
            fontSize: 34,
            lineHeight: 40,
            letterSpacing: -0.6,
            textAlign: "center",
            marginBottom: spacing.xs,
          }}
        >
          You’re all set
        </Text>
        <Text
          style={{
            ...textStyles.onboardingBody,
            textAlign: "center",
            lineHeight: 22,
            marginBottom: spacing.lg,
          }}
        >
          Two simple daily goals. Your plan is ready.
        </Text>
      </MotiView>

      <View
        style={{
          width: "100%",
          backgroundColor: colors.ui.white,
          borderRadius: 24,
          paddingHorizontal: spacing.md,
          ...globalStyles.shadow,
          shadowOpacity: 0.07,
        }}
      >
        {rows.map((row, index) => (
          <MotiView
            key={row.key}
            from={{ opacity: 0, translateY: 14 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ ...ease, duration: 420, delay: 300 + index * 110 }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 14,
              paddingVertical: spacing.md,
              borderTopWidth: index > 0 ? 1 : 0,
              borderTopColor: colors.ui.cardBorder,
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: row.iconBackground,
              }}
            >
              <MaterialCommunityIcons name={row.icon} size={24} color={row.iconColor} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ ...typography.bodySemiBold, fontSize: 15, color: colors.text.secondary }}>
                {row.label}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "baseline", gap: 6 }}>
                <Text
                  style={{
                    ...typography.displayNumeric,
                    fontSize: 26,
                    lineHeight: 32,
                    color: row.valueColor,
                  }}
                >
                  {row.value}
                </Text>
                {row.unit ? (
                  <Text style={{ ...typography.body, fontSize: 14, color: colors.goals.muted }}>
                    {row.unit}
                  </Text>
                ) : null}
              </View>
              {row.note ? (
                <Text
                  style={{
                    ...typography.small,
                    fontSize: 13,
                    lineHeight: 18,
                    color: colors.goals.muted,
                    marginTop: 2,
                  }}
                >
                  {row.note}
                </Text>
              ) : null}
            </View>
          </MotiView>
        ))}
      </View>
    </View>
  );
};

export default PlanSummary;
