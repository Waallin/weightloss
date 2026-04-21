import React from "react";
import { Text, View } from "react-native";
import { MotiView } from "moti";
import Animated, {
  Easing,
  ReduceMotion,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { colors } from "../../../constants/colors";
import { spacing } from "../../../constants/spacing";
import { planBuildingCopy, textStyles, typography } from "../../../constants/texts";

type Props = {
  onComplete?: () => void;
  /**
   * Optional override for total duration. If omitted, a bounded random duration is used.
   * Default: 10 000ms.
   */
  durationMs?: number;
};

const defaultDurationMs = 10_000;

const getStepIndex = (percent: number): number => {
  if (percent < 35) return 0;
  if (percent < 75) return 1;
  return 2;
};

const clampInt = (value: number, min: number, max: number): number => {
  "worklet";
  return Math.min(max, Math.max(min, Math.round(value)));
};

const PlanBuildingLoader: React.FC<Props> = ({ onComplete, durationMs }) => {
  const progress = useSharedValue(0);
  const [percent, setPercent] = React.useState<number>(0);
  const hasCompletedRef = React.useRef(false);

  React.useEffect(() => {
    const total = durationMs ?? defaultDurationMs;

    progress.value = 0;
    progress.value = withTiming(
      0.92,
      {
        duration: Math.floor(total * 0.76),
        easing: Easing.out(Easing.cubic),
        reduceMotion: ReduceMotion.Never,
      },
      (finished) => {
        if (!finished) return;
        progress.value = withTiming(1, {
          duration: Math.floor(total * 0.24),
          easing: Easing.out(Easing.quad),
          reduceMotion: ReduceMotion.Never,
        });
      }
    );
  }, [durationMs, progress]);

  const setPercentAndComplete = React.useCallback(
    (next: number) => {
      setPercent(next);
      if (next >= 100 && !hasCompletedRef.current) {
        hasCompletedRef.current = true;
        onComplete?.();
      }
    },
    [onComplete]
  );

  useAnimatedReaction(
    () => clampInt(progress.value * 100, 0, 100),
    (next, prev) => {
      if (next === prev) return;
      runOnJS(setPercentAndComplete)(next);
    },
    [setPercentAndComplete]
  );

  const fillStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  }, []);

  const stepText = planBuildingCopy.steps[getStepIndex(percent)] ?? planBuildingCopy.steps[0];

  return (
    <MotiView
      from={{ opacity: 0, translateY: 8 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        type: "timing",
        duration: 350,
        reduceMotion: ReduceMotion.Never,
      }}
      style={{
        width: "100%",
        gap: spacing.sm,
        paddingTop: spacing.sm,
      }}
    >
      <View style={{ width: "100%", alignItems: "center" }}>
        <Text
          style={{
            ...typography.subheadline,
            color: colors.text.primary,
            textAlign: "center",
            marginBottom: spacing.xs,
          }}
        >
          {planBuildingCopy.title}
        </Text>

        <Text
          style={{
            ...textStyles.secondary,
            textAlign: "center",
            marginBottom: spacing.md,
          }}
        >
          {planBuildingCopy.subtitle}
        </Text>
      </View>

      <View
        style={{
          width: "100%",
          height: 12,
          borderRadius: 999,
          backgroundColor: colors.ui.secondaryBackground,
          overflow: "hidden",
        }}
      >
        <Animated.View
          style={[
            {
              height: "100%",
              backgroundColor: colors.ui.primary,
              borderRadius: 999,
            },
            fillStyle,
          ]}
        />
      </View>

      <View
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: spacing.xs,
        }}
      >
        <Text style={{ ...typography.captionSemiBold, color: colors.text.secondary }}>
          {stepText}
        </Text>
        <Text style={{ ...typography.captionSemiBold, color: colors.text.primary }}>
          {percent}%
        </Text>
      </View>
    </MotiView>
  );
};

export default React.memo(PlanBuildingLoader);

