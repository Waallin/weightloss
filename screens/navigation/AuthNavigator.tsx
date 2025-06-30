import { createStackNavigator } from "@react-navigation/stack";
import AuthScreen from "../auth/AuthScreen";
import CreateProfileScreen from "../auth/CreateProfileScreen";
import { MainStack } from "./MainStack";
import AddBoatScreen from "../auth/AddBoatScreen";

const Stack = createStackNavigator();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Auth"
        component={AuthScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateProfile"
        component={CreateProfileScreen}
        options={{
          headerShown: true,
          headerTitle: "Complete Your Profile",
          headerLeft: () => null,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="MainStack"
        component={MainStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddBoat"
        component={AddBoatScreen}
        options={{ headerShown: false, headerTitle: "Add Boat" }}
      />
    </Stack.Navigator>
  );
};
