import { Text, TouchableOpacity, View } from "react-native";
import React, { type ComponentProps } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

type MaterialIconName = NonNullable<
  ComponentProps<typeof MaterialCommunityIcons>["name"]
>;
import { colors } from "../../../../constants/colors";
import { spacing } from "../../../../constants/spacing";
import { globalStyles } from "../../../../constants/globalStyles";
import { textStyles } from "../../../../constants/texts";
import * as Haptics from "expo-haptics";

const ICON_CONTAINER_SIZE = 48;



interface SettingsItemProps {
  title: string;
  description: string;
  icon: MaterialIconName;
  onPress: () => void;
  backgroundColor?: string;
  iconColor?: string;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  title,
  description,
  icon,
  onPress,
  backgroundColor,
  iconColor,
}) => {
  const iconName: MaterialIconName = icon ?? "help-circle-outline";

    const handlePress = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={handlePress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        gap: spacing.md,
        backgroundColor: backgroundColor ?? colors.ui.componentBackground,
        borderRadius: spacing.borderRadius,
        borderWidth: 1,
        borderColor: colors.ui.cardBorder,
        ...globalStyles.shadow,
      }}
    >
      <View style={{
        width: ICON_CONTAINER_SIZE,
        height: ICON_CONTAINER_SIZE,
        borderRadius: ICON_CONTAINER_SIZE / 2,
        backgroundColor: colors.ui.listRowIconBackground,
        alignItems: "center",
        justifyContent: "center",
      }}>
        <MaterialCommunityIcons
          name={iconName}
          size={24}
          color={iconColor ?? colors.ui.listRowIconTint}
        />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text
          numberOfLines={2}
          style={{ ...textStyles.listItemTitle }}
        >
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
      <MaterialCommunityIcons
        name="chevron-right"
        size={22}
        color={colors.text.secondary}
      />
    </TouchableOpacity>
  );
};

export default SettingsItem;
