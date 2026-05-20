import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { spacing } from "../../../constants/spacing";
import ProfileItem from "./components/ProfileItem";
import GoBackHeaderComponent from "../../../components/GoBackHeaderComponent";
import { globalStyles } from "../../../constants/globalStyles";
import { textStyles } from "../../../constants/texts";
import { colors } from "../../../constants/colors";
import useUserStore from "../../../stores/useUserStore";
import { formatHeightFromCm, kgToLb } from "../../../utils/units";

const ProfileScreen = () => {
  const { user } = useUserStore();

  const renderProfileSection = () => {
    return (
      <View style={{ gap: spacing.sm }}>
        <ProfileItem
          title="Height"
          value={formatHeightFromCm(user?.height ?? 175)}
          icon="human-male-height"
          disabled={true}
        />
        <ProfileItem
          suffix="lb"
          title="Weight"
          value={kgToLb(user?.currentWeight ?? 70)}
          icon="weight-pound"
        />
        <ProfileItem
          suffix="lb"
          title="Goal Weight"
          value={kgToLb(user?.goalWeight ?? 70)}
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
        />
      </View>
    );
  };

  const handleResetProfile = () => {
    console.log("Reset profile");
  };
  const renderResetSection = () => {
    return (
      <TouchableOpacity
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginTop: spacing.xl,
          paddingHorizontal: spacing.md,
        }}
      >
        <Text
          style={{
            ...textStyles.primary,
            textAlign: "center",
            textDecorationLine: "underline",
            color: colors.text.secondary,
          }}
        >
          Need to change something? Delete your account and start over.
        </Text>
      </TouchableOpacity>
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
      <GoBackHeaderComponent title="Profile" />
      {renderProfileSection()}
      {renderResetSection()}
    </ScrollView>
  );
};

export default ProfileScreen;
const styles = StyleSheet.create({});
