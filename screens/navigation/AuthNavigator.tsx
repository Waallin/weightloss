import { createStackNavigator } from "@react-navigation/stack";
import AuthScreen from "../auth/AuthScreen";
import { MainStack } from "./MainStack";
import OnboardingScreen from "../auth/OnboardingScreen";
import SocialProof from "../auth/SocialProof";
import ProfileDetailsScreen from "../auth/ProfileDetailsScreen";
import PaywallScreen from "../auth/PaywallScreen";
import HowItWorkScreen from "../auth/HowItWorkScreen";

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
        name="SocialProof"
        component={SocialProof}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Paywall"
        component={PaywallScreen}
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
        name="MainStack"
        component={MainStack}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
