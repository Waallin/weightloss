import { ScrollView, Text, View } from "react-native";
import React, { useState } from "react";
import SwitchItem from "./components/SwitchItem";
import { globalStyles } from "../../../constants/globalStyles";
import { spacing } from "../../../constants/spacing";
import GoBackHeaderComponent from "../../../components/GoBackHeaderComponent";
import UnitToggle from "../../../components/UnitToggle";
import useUnitsStore from "../../../stores/useUnitsStore";
import { colors } from "../../../constants/colors";
import { textStyles } from "../../../constants/texts";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const ICON_CONTAINER_SIZE = 48;

const PreferencesScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { heightUnit, weightUnit, setHeightUnit, setWeightUnit } =
    useUnitsStore();

  const renderUnitRow = ({
    title,
    description,
    icon,
    children,
  }: {
    title: string;
    description: string;
    icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
    children: React.ReactNode;
  }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingLeft: spacing.md,
          paddingRight: spacing.sm,
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
            backgroundColor: "#ECFDF5",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MaterialCommunityIcons name={icon} size={24} color="#22C55E" />
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
        {children}
      </View>
    );
  };

  const renderPreferencesSection = () => {
    return (
      <View style={{ gap: spacing.sm }}>
        <SwitchItem
          title="Notifications"
          description="Receive notifications for new updates and important information"
          icon="bell"
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
        />
        {renderUnitRow({
          title: "Height",
          description: "Show height in feet or centimeters",
          icon: "human-male-height",
          children: (
            <UnitToggle
              options={["ft", "cm"] as const}
              value={heightUnit}
              onChange={setHeightUnit}
            />
          ),
        })}
        {renderUnitRow({
          title: "Weight",
          description: "Show weight in pounds or kilograms",
          icon: "weight",
          children: (
            <UnitToggle
              options={["lb", "kg"] as const}
              value={weightUnit}
              onChange={setWeightUnit}
            />
          ),
        })}
      </View>
    );
  };
  return (
    <ScrollView
      contentContainerStyle={globalStyles.scrollContainer}
      showsVerticalScrollIndicator={false}
      style={{
        ...globalStyles.container,
      }}
    >
      <GoBackHeaderComponent title="Preferences" />
      {renderPreferencesSection()}
    </ScrollView>
  );
};

export default PreferencesScreen;
