import { ScrollView, View, Text, Alert } from "react-native";
import React from "react";
import { globalStyles } from "../../../constants/globalStyles";
import { spacing } from "../../../constants/spacing";
import SettingsItem from "./components/SettingsItem";
import Constants from "expo-constants";
import { colors } from "../../../constants/colors";
import { typography } from "../../../constants/texts";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import * as haptics from "expo-haptics";
import useToastStore from "../../../stores/useToastStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteDocument } from "../../../services/firebase";
import useUserStore from "../../../stores/useUserStore";
import { RootStackParamList } from "../../navigation/types";
import useTodayDietStore from "../../../stores/useTodayDietStore";
import useTodayProgressStore from "../../../stores/useTodayProgressStore";
import { deleteUser } from "../../../services/firebase";

const SettingsScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { showToast } = useToastStore();
  const { todayDiet, setTodayDiet } = useTodayDietStore();
  const { todayProgress, setTodayProgress } = useTodayProgressStore();
  const { user } = useUserStore();
  const handleDeleteAccount = async () => {

    haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);


    Alert.alert("Delete Account", "Are you sure you want to delete your account? This action is irreversible.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive", onPress: async () => {

          await AsyncStorage.removeItem("user");
          await deleteUser(user?.email as string);

          navigation.navigate("AuthNavigator");
          showToast("Account deleted successfully");
        }
      },
    ]);
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
          bottom: 120,
          right: 20,
        }}
      >
        <Text
          style={{
            ...typography.body,
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
          ...typography.titleBold,
          color: colors.text.primary,
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
          ...typography.titleBold,
          color: colors.text.primary,
          marginBottom: spacing.sm,
        }}>Account</Text>
        <View style={{ gap: spacing.sm }}>
          {/* <SettingsItem
            title="Logout"
            description="Logout of your account"
            icon="logout"
            iconColor={colors.ui.delete}
            onPress={handleLogout}
          /> */}
          <SettingsItem
            title="Delete Account"
            description="Delete your account and all your data"
            icon="delete-outline"
            iconColor={colors.ui.delete}
            onPress={handleDeleteAccount}
          />
        </View>
      </View>
    );
  };
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={globalStyles.scrollContainer}
        style={{
          ...globalStyles.container,
        }}
      >
        {renderProfileSettings()}
        {renderLogoutSettings()}
      </ScrollView>
      {renderConstants()}
    </View>
  );
};

export default SettingsScreen;
