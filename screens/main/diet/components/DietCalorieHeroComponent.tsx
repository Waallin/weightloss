import React from "react";
import { Text, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { colors } from "../../../../constants/colors";
import { spacing } from "../../../../constants/spacing";
import { globalStyles } from "../../../../constants/globalStyles";
import { dietLabels, textSizes } from "../../../../constants/texts";
import { fonts } from "../../../../constants/fonts";

const CIRCLE_SIZE = 200;
const CIRCLE_WIDTH = 15;

export interface DietCalorieHeroComponentProps {
  dateLabel: string;
  eaten: number;
  burned: number;
  remaining: number;
  /** 0–100 for ring fill */
  progressFill: number;
  /** Dynamic encouragement; falls back to dietLabels.heroMicrocopyFallback */
  microcopy?: string;
}

const defaultProps: DietCalorieHeroComponentProps = {
  dateLabel: "",
  eaten: 0,
  burned: 0,
  remaining: 0,
  progressFill: 0,
  microcopy: undefined,
};

const DietCalorieHeroComponent = (
  props: DietCalorieHeroComponentProps | undefined
) => {
  const {
    dateLabel,
    eaten,
    burned,
    remaining,
    progressFill,
    microcopy,
  } = { ...defaultProps, ...(props ?? {}) };
  const heroMicrocopy =
    microcopy !== undefined && microcopy !== ""
      ? microcopy
      : dietLabels.heroMicrocopyFallback;
  return (
    <View
      style={{
        width: "100%",
        borderRadius: spacing.borderRadius,
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.md,
        ...globalStyles.shadow,
        backgroundColor: colors.ui.componentBackground,
      }}
    >
      <Text
        style={{
          fontFamily: fonts.primary.medium,
          fontSize: textSizes.sm,
          color: colors.text.secondary,
          textAlign: "center",
          opacity: 0.95,
          marginBottom: spacing.md,
        }}
      >
        {dateLabel}
      </Text>
      <View
        style={{
          alignItems: "center",
          width: "100%",
        }}
      >
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
            fill={progressFill}
            tintColor={colors.ui.primary}
            backgroundColor={"#F3F1EC"}
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
              {remaining}
            </Text>
            <Text
              style={{
                fontFamily: fonts.primary.regular,
                fontSize: textSizes.xs,
                color: colors.text.secondary,
                opacity: 0.95,
                textAlign: "center",
              }}
            >
              {remaining < 0
                ? dietLabels.heroPointsOverLabel
                : dietLabels.heroPointsLeftLabel}
            </Text>
          </View>
        </View>
        <Text
          style={{
            fontFamily: fonts.primary.regular,
            fontSize: textSizes.xs,
            lineHeight: Math.round(textSizes.xs * 1.45),
            color: colors.text.primary,
            textAlign: "center",
            marginTop: spacing.md,
            paddingHorizontal: spacing.md,
            width: "100%",
            maxWidth: 320,
          }}
        >
          {heroMicrocopy}
        </Text>
      </View>
    </View>
  );
};

export default DietCalorieHeroComponent;
