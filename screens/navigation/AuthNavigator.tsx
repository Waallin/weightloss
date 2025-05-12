import { createStackNavigator } from "@react-navigation/stack";
import AuthScreen from "../auth/AuthScreen";
import { NavigationContainer } from "@react-navigation/native";
import CreateProfileScreen from "../auth/CreateProfileScreen";
import { TouchableOpacity, Text } from "react-native";
import { spacing } from "../../constants/spacing";
import { colors } from "../../constants/colors";
const Stack = createStackNavigator();

export const AuthNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ headerShown: false }}
        /> */}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};
