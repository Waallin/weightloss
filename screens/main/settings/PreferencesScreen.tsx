import { ScrollView, Text, View } from "react-native";
import React, { useState } from "react";
import SwitchItem from "./components/SwitchItem";
import SettingsSection, {
  SETTINGS_ICON_SIZE,
  settingsRowStyle,
} from "./components/SettingsSection";
import { globalStyles } from "../../../constants/globalStyles";
import { spacing } from "../../../constants/spacing";
import GoBackHeaderComponent from "../../../components/GoBackHeaderComponent";
import UnitToggle from "../../../components/UnitToggle";
import useUnitsStore from "../../../stores/useUnitsStore";
import { colors } from "../../../constants/colors";
import { typography } from "../../../constants/texts";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const PreferencesScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { heightUnit, weightUnit, setHeightUnit, setWeightUnit } =
    useUnitsStore();

  const renderUnitRow = ({
    title,
    description,
    icon,
    last,
    children,
  }: {
    title: string;
    description: string;
    icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
    last?: boolean;
    children: React.ReactNode;
  }) => {
    return (
      <View style={{ ...settingsRowStyle(last), paddingRight: spacing.sm }}>
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
            color={colors.goals.eat}
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
        {children}
      </View>
    );
  };

  const renderPreferencesSection = () => {
    return (
      <SettingsSection delay={100}>
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
          last: true,
          children: (
            <UnitToggle
              options={["lb", "kg"] as const}
              value={weightUnit}
              onChange={setWeightUnit}
            />
          ),
        })}
      </SettingsSection>
    );
  };
  return (
    <ScrollView
      contentContainerStyle={{
        ...globalStyles.scrollContainer,
        gap: spacing.homescreenGap,
      }}
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
