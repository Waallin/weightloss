import { ScrollView, View, Text } from "react-native";
import React from "react";
import { globalStyles } from "../../../constants/globalStyles";
import { spacing } from "../../../constants/spacing";
import SettingsItem from "./components/SettingsItem";
import Constants from "expo-constants";
import { colors } from "../../../constants/colors";
import { textSizes, textStyles } from "../../../constants/texts";
import { useNavigation } from "@react-navigation/native";
const SettingsScreen = () => {
  const navigation = useNavigation();
  
  const handleDeleteAccount = () => {
    console.log("Delete Account");
  };

  const handleProfile = () => {
    navigation.navigate("ProfileScreen");
  };

  const handlePreferences = () => {
    navigation.navigate("PreferencesScreen");
    console.log("Preferences");
  };

  const handleLogout = () => {
    console.log("Logout");
  };

  const renderConstants = () => {
    return (
      <View
        style={{
          position: "absolute",
          bottom: 150,
          right: 0,
        }}
      >
        <Text
          style={{
            ...textStyles.secondary,
            fontSize: textSizes.sm,
            color: colors.text.secondary,
          }}
        >
          Version {Constants.expoConfig?.version}
        </Text>
      </View>
    );
  };

  const renderProfileSettings = () => {
    return (
      <View style={{ gap: spacing.sm }}>
        <Text style={{
          ...textStyles.primary,
          fontSize: textSizes.lg,
          fontWeight: "bold",
          marginBottom: spacing.sm,
        }}>Profile</Text>
      <View style={{ gap: spacing.sm }}>
        <SettingsItem
          title="Profile"
          description="Manage your profile settings"
          icon="account-outline"
          onPress={handleProfile}
        />
        <SettingsItem
          title="Preferences"
          description="Manage your preferences"
          icon="account-cog-outline"
          onPress={handlePreferences}
        />
      </View>
      </View>
    );
  };

  const renderLogoutSettings = () => {
    return (
      <View>
        <Text style={{
          ...textStyles.primary,
          fontSize: textSizes.lg,
          fontWeight: "bold",
          marginBottom: spacing.sm,
        }}>Account</Text>
      <View style={{ gap: spacing.sm }}>
        <SettingsItem
          title="Logout"
          description="Logout of your account"
          icon="logout"
          iconColor={colors.ui.delete}
          backgroundColor={colors.ui.grey}
          onPress={handleLogout}
        />
        <SettingsItem
          title="Delete Account"
          description="Delete your account and all your data"
          icon="delete-outline"
          iconColor={colors.ui.delete}
          backgroundColor={colors.ui.grey}
          onPress={handleDeleteAccount}
        />
      </View>
      </View>
    );
  };
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={globalStyles.scrollContainer}
      style={{
        ...globalStyles.container,
      }}
    >
      {renderProfileSettings()}
      {renderLogoutSettings()}
      {renderConstants()}
    </ScrollView>
  );
};

export default SettingsScreen;
