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

const Stack = createStackNavigator<RootStackParamList>();

export type MainStackInitialRoute = "MainNavigator" | "Paywall";

interface MainStackProps {
  initialRouteName?: MainStackInitialRoute;
}

export const MainStack: React.FC<MainStackProps> = ({
  initialRouteName = "MainNavigator",
}) => {
  return (
    <Stack.Navigator initialRouteName={initialRouteName}>
      <Stack.Screen
        name="MainNavigator"
        component={MainNavigator}
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
