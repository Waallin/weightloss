import { createStackNavigator } from "@react-navigation/stack";
import AuthScreen from "../auth/AuthScreen";
import MainNavigator from "./MainNavigator";
import DietListScreen from "../main/diet/DietListScreen";
import AddDietScreen from "../main/diet/AddDietScreen";
import ProfileScreen from "../main/settings/ProfileScreen";
import PreferencesScreen from "../main/settings/PreferencesScreen";
import LogWeightScreen from "../main/progress/LogWeightScreen";
import ArticleScreen from "../main/home/ArticleScreen";
import { RootStackParamList } from "./types";
import RecipeDetailScreen from "../main/diet/RecipeDetailScreen";

const Stack = createStackNavigator<RootStackParamList>();

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
    </Stack.Navigator>
  );
};
