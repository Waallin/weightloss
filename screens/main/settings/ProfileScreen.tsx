import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { spacing } from "../../../constants/spacing";
import ProfileItem from "./components/ProfileItem";
import GoBackHeaderComponent from "../../../components/GoBackHeaderComponent";
import { globalStyles } from "../../../constants/globalStyles";
import { textSizes, textStyles } from "../../../constants/texts";
import { colors } from "../../../constants/colors";
import useUserStore from "../../../stores/useUserStore";
const ProfileScreen = () => {
  const [height, setHeight] = useState<number>(175);
  const [weight, setWeight] = useState<number>(70);
  const [goalWeight, setGoalWeight] = useState<number>(70);
  const [birthYear, setBirthYear] = useState<number>(2000);
  const [gender, setGender] = useState<string>("male");
  const { user } = useUserStore();

  const renderProfileSection = () => {
    return (
      <View style={{ gap: spacing.sm }}>
        <ProfileItem
          title="Height"
          suffix="cm"
          value={user?.height ?? 175}
          icon="human-male-height"
          disabled={true}
        />
        <ProfileItem
          suffix="kg"
          title="Weight"
          value={user?.currentWeight ?? 70}
          icon="weight-kilogram"
        />
        <ProfileItem
          suffix="kg"
          title="Goal Weight"
          value={user?.goalWeight ?? 70}
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
      <TouchableOpacity style={{ alignItems: "center", justifyContent: "center", marginTop: spacing.xl }}>
        <Text style={{ ...textStyles.primary, textAlign: "center", textDecorationLine: "underline", color: colors.text.secondary}}>
          Need to change something? Reset your profile.
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
