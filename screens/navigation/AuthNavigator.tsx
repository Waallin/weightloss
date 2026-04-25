import { createStackNavigator } from "@react-navigation/stack";
import AuthScreen from "../auth/AuthScreen";
import { MainStack } from "./MainStack";
import OnboardingScreen from "../auth/OnboardingScreen";
import SocialProofScreen from "../auth/SocialProofScreen";
import ProfileDetailsScreen from "../auth/ProfileDetailsScreen";
import PaywallScreen from "../auth/PaywallScreen";
import HowItWorkScreen from "../auth/HowItWorkScreen";
import PermissionScreen from "../auth/PermissionScreen";
import MainNavigator from "./MainNavigator";

const Stack = createStackNavigator();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SocialProofScreen"
        component={SocialProofScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Paywall"
        component={PaywallScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AuthScreen"
        component={AuthScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HowItWork"
        component={HowItWorkScreen}
        options={{ headerShown: false }}
      />    
      <Stack.Screen
        name="ProfileDetails"
        component={ProfileDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Auth"
        component={AuthScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PermissionScreen"
        component={PermissionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MainStack"
        component={MainStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MainNavigator"
        component={MainNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
