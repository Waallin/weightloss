import { createStackNavigator } from "@react-navigation/stack";
import MainNavigator from "./MainNavigator";
import ProfileScreen from "../main/profile/ProfileScreen";
import BoatRegistration from "../main/boat-registration/BoatRegistration";
import PreferenceView from "../main/profile/preferences/PreferenceView";
import { SafeAreaView } from "react-native";
import ForecastScreen from "../main/forecast/ForecastScreen";
import BoatScreen from "../main/boat/BoatScreen";
import AddServiceScreen from "../main/Service/AddServiceScreen";
import AddFuelScreen from "../main/fuel/AddFuelScreen";
import NotificationScreen from "../main/notifications/NotificationScreen";
import CrewScreen from "../main/crew/CrewScreen";
import EditProfileScreen from "../main/profile/EditProfileScreen";
import AnalyticsScreen from "../main/analytics/AnalyticsScreen";

const Stack = createStackNavigator();

export const MainStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={MainNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: true,
          headerTitle: "Profile",
        }}
      />
      <Stack.Screen
        name="BoatRegistration"
        component={BoatRegistration}
        options={{
          headerShown: true,
          headerTitle: "Boat Registration",
        }}
      />
      <Stack.Screen
        name="PreferenceView"
        component={PreferenceView}
        options={{ headerShown: true, headerTitle: "Preferences" }}
      />
      <Stack.Screen
        name="Forecast"
        component={ForecastScreen}
        options={{ headerShown: true, headerTitle: "Forecast" }}
      />
      <Stack.Screen
        name="Boat"
        component={BoatScreen}
        options={{ headerShown: true, headerTitle: "Boat" }}
      />
      <Stack.Screen
        name="AddService"
        component={AddServiceScreen}
        options={{ headerShown: true, headerTitle: "Add Service" }}
      />
      <Stack.Screen
        name="AddFuel"
        component={AddFuelScreen}
        options={{ headerShown: true, headerTitle: "Add Fuel" }}
      />
      <Stack.Screen
        name="Notification"
        component={NotificationScreen}
        options={{
          headerShown: true,
          headerTitle: "Notifications",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="Crew"
        component={CrewScreen}
        options={{ headerShown: true, headerTitle: "Crew" }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ headerShown: true, headerTitle: "Edit Profile" }}
      />
      <Stack.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{ headerShown: true, headerTitle: "Analytics" }}
      />
    </Stack.Navigator>
  );
};
