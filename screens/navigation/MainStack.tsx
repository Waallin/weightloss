import { createStackNavigator } from "@react-navigation/stack";
import AuthScreen from "../auth/AuthScreen";
import MainNavigator from "./MainNavigator";
import DietListScreen from "../main/diet/DietListScreen";
import AddDietScreen from "../main/diet/AddDietScreen";

const Stack = createStackNavigator();

export const MainStack = () => {
  return (
    <Stack.Navigator>
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
    </Stack.Navigator>
  );
};
