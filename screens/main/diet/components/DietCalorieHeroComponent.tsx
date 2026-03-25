import React from "react";
import { Text, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { colors } from "../../../../constants/colors";
import { spacing } from "../../../../constants/spacing";
import { globalStyles } from "../../../../constants/globalStyles";
import { textSizes } from "../../../../constants/texts";
import { fonts } from "../../../../constants/fonts";

const CIRCLE_SIZE = 200;
const CIRCLE_WIDTH = 12;

export interface DietCalorieHeroComponentProps {
  dateLabel: string;
  eaten: number;
  burned: number;
  remaining: number;
  /** 0–100 for ring fill */
  progressFill: number;
}

const defaultProps: DietCalorieHeroComponentProps = {
  dateLabel: "",
  eaten: 0,
  burned: 0,
  remaining: 0,
  progressFill: 0,
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
  } = { ...defaultProps, ...(props ?? {}) };
  return (
    <View
      style={{
        width: "100%",
        borderRadius: spacing.borderRadius,
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.md,
        marginBottom: spacing.md,
        ...globalStyles.shadow,
        backgroundColor: colors.ui.componentBackground,
      }}
    >
      <Text
        style={{
          fontFamily: fonts.primary.medium,
          fontSize: textSizes.sm,
          color: colors.ui.primary,
          textAlign: "center",
          opacity: 0.95,
          marginBottom: spacing.md,
        }}
      >
        {dateLabel}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text
            style={{
              fontFamily: fonts.primary.regular,
              fontSize: textSizes.sm,
              color: colors.ui.primary,
              opacity: 0.95,
            }}
          >
            Eaten
          </Text>
          <Text
            style={{
              fontFamily: fonts.primary.bold,
              fontSize: textSizes.xxl,
              color: colors.ui.primary,
              marginTop: spacing.xs,
            }}
          >
            {eaten}
          </Text>
        </View>

        <View
          style={{
            flex: 1.35,
            alignItems: "center",
            justifyContent: "center",
            minWidth: CIRCLE_SIZE,
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
              backgroundColor={colors.ui.cardBorder}
              rotation={0}
              arcSweepAngle={360}
              lineCap="round"
              duration={900}
            />
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Text
                style={{
                  fontFamily: fonts.primary.regular,
                  fontSize: textSizes.xs,
                  color: colors.ui.primary,
                  opacity: 0.95,
                }}
              >
                Remaining
              </Text>
              <Text
                style={{
                  fontFamily: fonts.primary.bold,
                  fontSize: 32,
                  color: colors.ui.primary,
                  marginVertical: spacing.xs,
                }}
              >
                {remaining}
              </Text>
              <Text
                style={{
                  fontFamily: fonts.primary.regular,
                  fontSize: textSizes.xs,
                  color: colors.ui.primary,
                  opacity: 0.92,
                }}
              >
                Nice! You're on track!
              </Text>
            </View>
          </View>
        </View>

        <View style={{ flex: 1, alignItems: "center" }}>
          <Text
            style={{
              fontFamily: fonts.primary.regular,
              fontSize: textSizes.sm,
              color: colors.ui.primary,
              opacity: 0.95,
            }}
          >
            Burned
          </Text>
          <Text
            style={{
              fontFamily: fonts.primary.bold,
              fontSize: textSizes.xxl,
              color: colors.ui.primary,
              marginTop: spacing.xs,
            }}
          >
            {burned}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default DietCalorieHeroComponent;
