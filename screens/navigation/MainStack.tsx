import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MainNavigator from "./MainNavigator";
import DietListScreen from "../main/diet/DietListScreen";
import AddDietScreen from "../main/diet/AddDietScreen";
import ProfileScreen from "../main/settings/ProfileScreen";
import PreferencesScreen from "../main/settings/PreferencesScreen";
import LogWeightScreen from "../main/progress/LogWeightScreen";
import ArticleScreen from "../main/home/ArticleScreen";
import { RootStackParamList } from "./types";
import RecipeDetailScreen from "../main/diet/RecipeDetailScreen";
import { AuthNavigator } from "./AuthNavigator";
import PaywallScreen from "../auth/PaywallScreen";
import ScanFoodScreen from "../main/diet/ScanFoodScreen";
import ManualFoodScreen from "../main/diet/ManualFoodScreen";
import FirstDayGuideScreen from "../main/home/FirstDayGuideScreen";
import SettingsScreen from "../main/settings/SettingsScreen";
import MoveGoalRewardScreen from "../main/home/MoveGoalRewardScreen";

const Stack = createStackNavigator<RootStackParamList>();

export type MainStackInitialRoute =
  | "MainNavigator"
  | "Paywall"
  | "FirstDayGuide"
  | "ScanFoodScreen";

interface MainStackProps {
  initialRouteName?: MainStackInitialRoute;
  debugScanImage?: string;
  debugScanHold?: boolean;
}

export const MainStack: React.FC<MainStackProps> = ({
  initialRouteName = "MainNavigator",
  debugScanImage,
  debugScanHold,
}) => {
  return (
    <Stack.Navigator initialRouteName={initialRouteName}>
      <Stack.Screen
        name="MainNavigator"
        component={MainNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FirstDayGuide"
        component={FirstDayGuideScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DietListScreen"
        component={DietListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddDietScreen"
        component={AddDietScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ScanFoodScreen"
        component={ScanFoodScreen}
        initialParams={
          debugScanImage
            ? { debugImagePath: debugScanImage, debugHold: debugScanHold }
            : undefined
        }
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ManualFoodScreen"
        component={ManualFoodScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MoveGoalReward"
        component={MoveGoalRewardScreen}
        options={{ headerShown: false, presentation: "modal", gestureEnabled: false }}
      />
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PreferencesScreen"
        component={PreferencesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LogWeightScreen"
        component={LogWeightScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RecipeDetailScreen"
        component={RecipeDetailScreen}
        options={{ headerShown: false }}
      />  
      <Stack.Screen
        name="ArticleScreen"
        component={ArticleScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AuthNavigator"
        component={AuthNavigator}
        options={{ headerShown: false }}
      />  
      <Stack.Screen
        name="Paywall"
        component={PaywallScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
