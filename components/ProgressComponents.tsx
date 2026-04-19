import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { MotiView } from "moti";
import { ReduceMotion } from "react-native-reanimated";
import { colors } from "../constants/colors";
import { globalStyles } from "../constants/globalStyles";
import { spacing } from "../constants/spacing";
import { textSizes, textStyles, typography } from "../constants/texts";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";


const ICON_CONTAINER_SIZE = 40;

const PROGRESS_BAR_HEIGHT = 4;

const STATUS_OVERLAY_ANIMATION_DURATION_MS = 1100;
const STATUS_OVERLAY_SCALE_ACTIVE = 1.02;

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
  claimRewardPress,
  onPress,
  claimReward,
  description,
  completed,
}: {
  title: string;
  icon: string;
  number: number;
  goal: number;
  microcopy?: string;
  width?: string;
  claimRewardPress?: () => void;
  claimReward?: boolean;
  onPress?: () => void;
  description?: string;
  completed?: boolean;
}) => {

  const progressRatio = goal > 0 ? Math.min(1, Math.max(0, number / goal)) : 0;



  return (
    <TouchableOpacity
      disabled={claimReward}
      onPress={onPress}
      activeOpacity={0.9}
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

      {!completed && description ? (
        <View style={{
          position: "absolute",
    
          right: 10,
          bottom: 10,
          zIndex: 1000,
        }}>
          <Text style={{
            ...typography.small,
            color: colors.text.secondary,

            fontStyle: "italic",
          }}>
            {description}
          </Text>
        </View>
      ) : null}
      {completed && <View style={{
        position: "absolute",
        top: 10,
        right: 10
      }}>
        <Text style={{
          ...typography.small,
          color: colors.ui.primary,
          fontStyle: "italic",
        }}>
          Done👏
        </Text>
      </View>}
      {claimReward && (
        <MotiView
          from={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0.96, scale: STATUS_OVERLAY_SCALE_ACTIVE }}
          transition={{
            type: "timing",
            duration: STATUS_OVERLAY_ANIMATION_DURATION_MS,
            loop: true,
            repeatReverse: true,
            reduceMotion: ReduceMotion.System,
          }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
            borderRadius: spacing.borderRadius,
            ...globalStyles.shadow,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={claimRewardPress}
            style={{
              flex: 1,
              backgroundColor: colors.ui.primary,
              borderWidth: 0,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: spacing.borderRadius,
              gap: spacing.md,
              paddingHorizontal: spacing.md,
            }}
          >
            <Text
              style={{
                ...typography.buttonSecondary,
                textAlign: "center",
                color: colors.ui.white,
              }}
            >
              Goal reached👏
            </Text>
            <Text
              style={{
                ...typography.body,
                textAlign: "center",
                color: colors.ui.white,
              }}
            >
              Tap to complete goal
            </Text>
          </TouchableOpacity>
        </MotiView>
      )}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.xs,
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
          <MaterialCommunityIcons
            name={icon as any}
            size={24}
            color={colors.ui.primary}
          />
        </View>
        <Text
          style={{
            ...typography.cardTitle,
            color: colors.text.primary,
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
            ...typography.cardTitle,
            color: colors.text.primary,
          }}
        >
          {formatAmount(number)}
        </Text>
        <Text
          style={{
            ...textStyles.secondary,
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
            ...typography.small,
            color: colors.text.secondary,
            lineHeight: textSizes.xs * 1.35,
          }}
        >
          {microcopy}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
};

export default ProgressComponents;
