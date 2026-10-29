import { Text, View } from "react-native";
import React from "react";
import { MotiView } from "moti";
import { ReduceMotion } from "react-native-reanimated";
import { colors } from "../../../../constants/colors";
import { spacing } from "../../../../constants/spacing";
import { typography } from "../../../../constants/texts";

export const SETTINGS_CARD_RADIUS = 24;
export const SETTINGS_ICON_SIZE = 44;

export const settingsCardShadow = {
  shadowColor: colors.goals.dark,
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.06,
  shadowRadius: 24,
  elevation: 4,
};

/** Row chrome shared by every row inside a settings card. */
export const settingsRowStyle = (last?: boolean) => ({
  flexDirection: "row" as const,
  alignItems: "center" as const,
  gap: spacing.md,
  paddingVertical: 14,
  paddingHorizontal: spacing.md,
  borderBottomWidth: last ? 0 : 1,
  borderBottomColor: colors.ui.cardBorder,
});

interface SettingsSectionProps {
  label?: string;
  delay?: number;
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({
  label,
  delay = 100,
  children,
}) => {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 10, scale: 0.98 }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      transition={{
        type: "timing",
        duration: 450,
        delay,
        reduceMotion: ReduceMotion.Never,
      }}
    >
      {label ? (
        <Text
          style={{
            ...typography.captionSemiBold,
            fontSize: 13,
            letterSpacing: 0.6,
            textTransform: "uppercase",
            color: colors.goals.eat,
            marginBottom: spacing.sm,
            paddingHorizontal: spacing.xs,
          }}
        >
          {label}
        </Text>
      ) : null}
      <View
        style={{
          backgroundColor: colors.ui.white,
          borderRadius: SETTINGS_CARD_RADIUS,
          overflow: "hidden",
          ...settingsCardShadow,
        }}
      >
        {children}
      </View>
    </MotiView>
  );
};

export default SettingsSection;
