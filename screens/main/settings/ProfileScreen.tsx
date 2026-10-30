import { ScrollView, Text, TouchableOpacity } from "react-native";
import React from "react";
import { spacing } from "../../../constants/spacing";
import ProfileItem from "./components/ProfileItem";
import SettingsSection from "./components/SettingsSection";
import GoBackHeaderComponent from "../../../components/GoBackHeaderComponent";
import { globalStyles } from "../../../constants/globalStyles";
import { typography } from "../../../constants/texts";
import { colors } from "../../../constants/colors";
import useUserStore from "../../../stores/useUserStore";
import useUnitsStore from "../../../stores/useUnitsStore";
import { formatHeightFromCm, kgToLb } from "../../../utils/units";

const ProfileScreen = () => {
  const { user } = useUserStore();
  const { heightUnit, weightUnit } = useUnitsStore();

  const renderProfileSection = () => {
    const weightValue =
      weightUnit === "lb"
        ? kgToLb(user?.currentWeight ?? 70)
        : Math.round(user?.currentWeight ?? 70);
    const goalWeightValue =
      weightUnit === "lb"
        ? kgToLb(user?.goalWeight ?? 70)
        : Math.round(user?.goalWeight ?? 70);
    return (
      <SettingsSection delay={100}>
        <ProfileItem
          title="Height"
          value={formatHeightFromCm(user?.height ?? 175, heightUnit)}
          icon="human-male-height"
          disabled={true}
        />
        <ProfileItem
          suffix={weightUnit}
          title="Weight"
          value={weightValue}
          icon="weight-pound"
        />
        <ProfileItem
          suffix={weightUnit}
          title="Goal Weight"
          value={goalWeightValue}
          icon="target"
        />
        <ProfileItem
          title="Birth Year"
          value={user?.birthYear ?? 2000}
          icon="calendar"
          disabled={true}
        />
        <ProfileItem
          title="Gender"
          value={user?.gender ?? "male"}
          icon="gender-male-female"
          disabled={true}
          last
        />
      </SettingsSection>
    );
  };

  const renderResetSection = () => {
    return (
      <TouchableOpacity
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: spacing.md,
        }}
      >
        <Text
          style={{
            ...typography.bodyMedium,
            textAlign: "center",
            textDecorationLine: "underline",
            color: colors.goals.muted,
          }}
        >
          Need to change something? Delete your account and start over.
        </Text>
      </TouchableOpacity>
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
      <GoBackHeaderComponent title="Profile" />
      {renderProfileSection()}
      {renderResetSection()}
    </ScrollView>
  );
};

export default ProfileScreen;
