import { Text, TouchableOpacity, View } from "react-native";
import React, { type ComponentProps } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { colors } from "../../../../constants/colors";
import { spacing } from "../../../../constants/spacing";
import { typography } from "../../../../constants/texts";
import * as Haptics from "expo-haptics";

type MaterialIconName = NonNullable<
  ComponentProps<typeof MaterialCommunityIcons>["name"]
>;

const ICON_CONTAINER_SIZE = 44;

interface SettingsItemProps {
  title: string;
  description: string;
  icon: MaterialIconName;
  onPress: () => void;
  /** Destructive rows get a red tint instead of the green default */
  destructive?: boolean;
  /** Hides the divider under the row (last row in a card) */
  last?: boolean;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  title,
  description,
  icon,
  onPress,
  destructive,
  last,
}) => {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const tint = destructive ? colors.ui.delete : colors.goals.eat;
  const tintBackground = destructive ? "#FEECEC" : colors.goals.eatSoft;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.md,
        paddingVertical: 14,
        paddingHorizontal: spacing.md,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: colors.ui.cardBorder,
      }}
    >
      <View
        style={{
          width: ICON_CONTAINER_SIZE,
          height: ICON_CONTAINER_SIZE,
          borderRadius: 14,
          backgroundColor: tintBackground,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MaterialCommunityIcons name={icon} size={22} color={tint} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text
          numberOfLines={1}
          style={{
            ...typography.cardTitle,
            color: destructive ? colors.ui.delete : colors.text.primary,
          }}
        >
          {title}
        </Text>
        <Text
          numberOfLines={2}
          style={{
            ...typography.small,
            color: colors.goals.muted,
            marginTop: 2,
          }}
        >
          {description}
        </Text>
      </View>
      <MaterialCommunityIcons
        name="chevron-right"
        size={22}
        color={colors.goals.dotEmpty}
      />
    </TouchableOpacity>
  );
};

export default SettingsItem;
