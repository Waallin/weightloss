import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { ReduceMotion } from "react-native-reanimated";
import * as haptics from "expo-haptics";
import { colors } from "../../../constants/colors";
import { spacing } from "../../../constants/spacing";
import { typography } from "../../../constants/texts";

interface OptionCardProps {
  label: string;
  active: boolean;
  onPress: () => void;
  /** Position in the list, used to stagger the entrance */
  index?: number;
}

const OptionCard: React.FC<OptionCardProps> = ({
  label,
  active,
  onPress,
  index = 0,
}) => {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 14 }}
      animate={{ opacity: 1, translateY: 0, scale: active ? 1.02 : 1 }}
      transition={{
        type: "timing",
        duration: 380,
        delay: index * 70,
        reduceMotion: ReduceMotion.Never,
      }}
      style={{ borderRadius: 18 }}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          if (!active) haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: spacing.lg,
            paddingHorizontal: spacing.lg,
            borderRadius: 18,
            backgroundColor: active ? colors.ui.primary : colors.ui.white,
            borderWidth: 1,
            borderColor: active ? colors.ui.primary : colors.ui.cardBorder,
          }}
        >
          <Text
            style={{
              fontFamily: typography.bodySemiBold.fontFamily,
              fontWeight: "600",
              fontSize: 22,
              letterSpacing: -0.3,
              color: active ? colors.ui.white : colors.text.primary,
            }}
          >
            {label}
          </Text>
          <View
            style={{
              width: 26,
              height: 26,
              borderRadius: 13,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: active ? colors.ui.white : "transparent",
              borderWidth: active ? 0 : 1.5,
              borderColor: colors.ui.dotInactive,
            }}
          >
            {active && (
              <MaterialIcons name="check" size={17} color={colors.ui.primary} />
            )}
          </View>
        </View>
      </TouchableOpacity>
    </MotiView>
  );
};

export default OptionCard;
