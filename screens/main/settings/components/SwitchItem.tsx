import { Switch, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as Haptics from "expo-haptics";
import { colors } from "../../../../constants/colors";
import { spacing } from "../../../../constants/spacing";
import { globalStyles } from "../../../../constants/globalStyles";
import { textStyles } from "../../../../constants/texts";

const ICON_CONTAINER_SIZE = 48;

interface SwitchItemProps {
  title: string;
  description: string;
  icon: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  backgroundColor?: string;
  iconColor?: string;
}

const SwitchItem: React.FC<SwitchItemProps> = ({
  title,
  description,
  icon,
  value,
  onValueChange,
  backgroundColor,
  iconColor,
}) => {
  const iconName = (icon ?? "help-circle-outline") as React.ComponentProps<
    typeof MaterialCommunityIcons
  >["name"];

  const handleRowPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onValueChange(!value);
  };

  const handleSwitchChange = (next: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onValueChange(next);
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: spacing.md,
        paddingRight: spacing.sm,
        paddingVertical: spacing.md,
        gap: spacing.md,
        backgroundColor: backgroundColor ?? colors.ui.componentBackground,
        borderRadius: spacing.borderRadius,
        borderWidth: 1,
        borderColor: colors.ui.cardBorder,
        ...globalStyles.shadow,
      }}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleRowPress}
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.md,
          minWidth: 0,
        }}
      >
        <View
          style={{
            width: ICON_CONTAINER_SIZE,
            height: ICON_CONTAINER_SIZE,
            borderRadius: ICON_CONTAINER_SIZE / 2,
            backgroundColor: "#ECFDF5",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MaterialCommunityIcons
            name={iconName}
            size={24}
            color={iconColor ?? "#22C55E"}
          />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text numberOfLines={2} style={{ ...textStyles.listItemTitle }}>
            {title}
          </Text>
          <Text
            numberOfLines={3}
            style={{
              ...textStyles.listItemMeta,
              marginTop: spacing.xs,
            }}
          >
            {description}
          </Text>
        </View>
      </TouchableOpacity>
      <Switch
        value={value}
        onValueChange={handleSwitchChange}
        trackColor={{
          false: colors.ui.grey,
          true: colors.ui.primary,
        }}
        thumbColor={colors.ui.white}
        ios_backgroundColor={colors.ui.grey}
      />
    </View>
  );
};

export default SwitchItem;
