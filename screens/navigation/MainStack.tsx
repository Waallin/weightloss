import { createStackNavigator } from "@react-navigation/stack";
import MainNavigator from "./MainNavigator";
import ProfileScreen from "../main/profile/ProfileScreen";

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
    </Stack.Navigator>
  );
};
