import { Text, View } from "react-native";
import React, { type ComponentProps } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { colors } from "../../../../constants/colors";
import { spacing } from "../../../../constants/spacing";
import { globalStyles } from "../../../../constants/globalStyles";
import { textStyles } from "../../../../constants/texts";

type MaterialIconName = NonNullable<
  ComponentProps<typeof MaterialCommunityIcons>["name"]
>;

const ICON_CONTAINER_SIZE = 48;

interface ProfileItemProps {
  title: string;
  value: string | number;
  icon: MaterialIconName;
  iconColor?: string;
  disabled?: boolean;
  suffix?: string;
}

const ProfileItem: React.FC<ProfileItemProps> = ({
  title,
  suffix,
  value,
  icon,
  iconColor,

}) => {
    
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        gap: spacing.md,
        backgroundColor: colors.ui.componentBackground,
        borderRadius: spacing.borderRadius,
        borderWidth: 1,
        borderColor: colors.ui.cardBorder,
        ...globalStyles.shadow,
      }}
    >
      <View
        style={{
          width: ICON_CONTAINER_SIZE,
          height: ICON_CONTAINER_SIZE,
          borderRadius: ICON_CONTAINER_SIZE / 2,
          backgroundColor: colors.ui.listRowIconBackground,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MaterialCommunityIcons
          name={icon}
          size={24}
          color={iconColor ?? colors.ui.listRowIconTint}
        />
      </View>
      <Text
        numberOfLines={1}
        style={{
          ...textStyles.listItemTitle,
          flex: 1,
          minWidth: 0,
        }}
      >
        {title}
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
      <Text
        numberOfLines={1}
        style={{
          ...textStyles.primary,
          fontWeight: "bold",
          color: colors.text.primary,
        }}
      >
        {String(value)}
      </Text>
      {suffix && (
        <Text
          style={{
            ...textStyles.primary,

            fontWeight: "bold",

            color: colors.text.primary,
          }}
        >
          {suffix}
        </Text>
        
      )}
      </View>
    </View>
  );
};

export default ProfileItem;
