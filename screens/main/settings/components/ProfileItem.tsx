import { Text, View } from "react-native";
import React, { type ComponentProps } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { colors } from "../../../../constants/colors";
import { spacing } from "../../../../constants/spacing";
import { typography } from "../../../../constants/texts";
import { SETTINGS_ICON_SIZE, settingsRowStyle } from "./SettingsSection";

type MaterialIconName = NonNullable<
  ComponentProps<typeof MaterialCommunityIcons>["name"]
>;

interface ProfileItemProps {
  title: string;
  value: string | number;
  icon: MaterialIconName;
  iconColor?: string;
  disabled?: boolean;
  suffix?: string;
  /** Hides the divider under the row (last row in a card) */
  last?: boolean;
}

const ProfileItem: React.FC<ProfileItemProps> = ({
  title,
  suffix,
  value,
  icon,
  iconColor,
  last,
}) => {
  return (
    <View style={settingsRowStyle(last)}>
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
          name={icon}
          size={22}
          color={iconColor ?? colors.goals.eat}
        />
      </View>
      <Text
        numberOfLines={1}
        style={{
          ...typography.cardTitle,
          color: colors.text.primary,
          flex: 1,
          minWidth: 0,
        }}
      >
        {title}
      </Text>
      <Text
        numberOfLines={1}
        style={{
          ...typography.cardTitle,
          color: colors.goals.muted,
          marginLeft: spacing.xs,
        }}
      >
        {suffix ? `${value} ${suffix}` : String(value)}
      </Text>
    </View>
  );
};

export default ProfileItem;
