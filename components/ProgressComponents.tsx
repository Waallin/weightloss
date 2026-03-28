import { Text, View } from "react-native";
import React from "react";
import { colors } from "../constants/colors";
import { fonts } from "../constants/fonts";
import { globalStyles } from "../constants/globalStyles";
import { spacing } from "../constants/spacing";
import { textSizes, textStyles } from "../constants/texts";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const ICON_CONTAINER_SIZE = 40;

const PROGRESS_BAR_HEIGHT = 4;

function formatAmount(value: number): string {
  return value.toLocaleString("en-US");
}

const ProgressComponents = ({
  title,
  icon,
  number,
  goal,
  microcopy,
  width,
}: {
  title: string;
  icon: string;
  number: number;
  goal: number;
  microcopy?: string;
  width?: string;
}) => {
  const progressRatio =
    goal > 0 ? Math.min(1, Math.max(0, number / goal)) : 0;

  return (
    <View
      style={{
        backgroundColor: colors.ui.componentBackground,
        borderWidth: 0,
        ...globalStyles.shadow,
        borderRadius: spacing.borderRadius,
        width: width || "47%",
        padding: spacing.md,
        gap: spacing.sm,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.xs
        }}
      >
        <View
          style={{
            // width: ICON_CONTAINER_SIZE,
            height: ICON_CONTAINER_SIZE,
            borderRadius: ICON_CONTAINER_SIZE / 2,
            alignItems: "center",
            justifyContent: "center",
         
          }}
        >
          <MaterialCommunityIcons name={icon as any} size={24} color={colors.ui.primary} />
        </View>
        <Text
          style={{
            ...textStyles.primary,
            fontWeight: "bold",
            fontSize: textSizes.md,
          }}
        >
          {title}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "baseline",
        }}
      >
        <Text
          style={{
            ...textStyles.primary,
            fontFamily: fonts.primary.semiBold,
            fontSize: textSizes.md,
            color: colors.text.primary,
          }}
        >
          {formatAmount(number)}
        </Text>
        <Text
          style={{
            ...textStyles.secondary,
            fontSize: textSizes.sm,
          }}
        >
          {` / ${formatAmount(goal)}`}
        </Text>
      </View>
      <View
        style={{
          height: PROGRESS_BAR_HEIGHT,
          borderRadius: PROGRESS_BAR_HEIGHT / 2,
          backgroundColor: colors.ui.dotInactive,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            width: `${progressRatio * 100}%`,
            height: "100%",
            backgroundColor: colors.ui.primary,
            borderRadius: PROGRESS_BAR_HEIGHT / 2,
          }}
        />
      </View>
      {microcopy ? (
        <Text
          style={{
            ...textStyles.secondary,
            fontSize: textSizes.xs,
            lineHeight: textSizes.xs * 1.35,
          }}
        >
          {microcopy}
        </Text>
      ) : null}
    </View>
  );
};

export default ProgressComponents;
