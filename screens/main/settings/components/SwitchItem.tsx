import { Switch, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as Haptics from "expo-haptics";
import { colors } from "../../../../constants/colors";
import { spacing } from "../../../../constants/spacing";
import { typography } from "../../../../constants/texts";
import { SETTINGS_ICON_SIZE, settingsRowStyle } from "./SettingsSection";

interface SwitchItemProps {
  title: string;
  description: string;
  icon: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  iconColor?: string;
  /** Hides the divider under the row (last row in a card) */
  last?: boolean;
}

const SwitchItem: React.FC<SwitchItemProps> = ({
  title,
  description,
  icon,
  value,
  onValueChange,
  iconColor,
  last,
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
    <View style={{ ...settingsRowStyle(last), paddingRight: spacing.sm }}>
      <TouchableOpacity
        activeOpacity={0.7}
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
            width: SETTINGS_ICON_SIZE,
            height: SETTINGS_ICON_SIZE,
            borderRadius: 14,
            backgroundColor: colors.goals.eatSoft,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MaterialCommunityIcons
            name={iconName}
            size={22}
            color={iconColor ?? colors.goals.eat}
          />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text
            numberOfLines={1}
            style={{ ...typography.cardTitle, color: colors.text.primary }}
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
