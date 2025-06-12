import { createStackNavigator } from "@react-navigation/stack";
import MainNavigator from "./MainNavigator";
import ProfileScreen from "../main/profile/ProfileScreen";
import BoatRegistration from "../main/boat-registration/BoatRegistration";
import PreferenceView from "../main/profile/preferences/PreferenceView";
import { SafeAreaView } from "react-native";
import ForecastScreen from "../main/forecast/ForecastScreen";
import BoatScreen from "../main/boat/BoatScreen";
import AddMaintanceScreen from "../main/maintance/AddMaintanceScreen";
import AddFuelScreen from "../main/fuel/AddFuelScreen";
import NotificationScreen from "../main/notifications/NotificationScreen";

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
        name="AddMaintance"
        component={AddMaintanceScreen}
        options={{ headerShown: true, headerTitle: "Add Maintance" }}
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
    </Stack.Navigator>
  );
};
