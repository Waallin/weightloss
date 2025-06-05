import { StyleSheet, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DashboardScreen from "../main/dashboard/DashboardScreen";
import ChecklistScreen from "../main/checklist/ChecklistScreen";
import LocationScreen from "../main/location/LocationScreen";
import FuelScreen from "../main/fuel/FuelScreen";
import { colors } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { spacing } from "../../constants/spacing";
import { globalStyles } from "../../constants/globalStyles";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import MaintanceScreen from "../main/maintance/MaintanceScreen";
import LogBookScreen from "../main/logbook/LogBookScreen";

const Tab = createBottomTabNavigator();

const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

const AnimatedTabIcon = ({
  focused,
  children,
  tabName,
}: {
  focused: boolean;
  children: React.ReactNode;
  tabName: string;
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(focused ? 1 : 0.5);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (focused) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        scale.value = withSequence(
          withSpring(0.9, { damping: 12, stiffness: 80 }),
          withSpring(1.1, { damping: 12, stiffness: 80 }),
          withSpring(1, { damping: 12, stiffness: 80 })
        );
        opacity.value = withTiming(1, { duration: 300 });
      } else {
        scale.value = withSpring(1, { damping: 12, stiffness: 80 });
        opacity.value = withTiming(0.5, { duration: 300 });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.tabIconContainer}>
      {focused && <View style={styles.activeBackground} />}
      <Animated.View style={[animatedStyle, { zIndex: 2 }]}>
        {children}
      </Animated.View>
    </View>
  );
};

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: colors.ui.white,
          marginBottom: spacing.lg,
          marginHorizontal: spacing.md,
          borderRadius: spacing.borderRadius,
          ...globalStyles.cardShadow,
          height: 65,
          paddingTop: 5,
          position: "absolute",
        },
        tabBarActiveTintColor: colors.brand.primary,
        tabBarInactiveTintColor: colors.text.tertiary,
        tabBarLabelStyle: {
          ...globalStyles.tabBarLabel,
          paddingTop: 5,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon focused={focused} tabName="Dashboard">
              <AnimatedIcon
                name={focused ? "boat-sharp" : "boat-outline"}
                size={24}
                color={color}
              />
            </AnimatedTabIcon>
          ),
        }}
      />
      <Tab.Screen
        name="Checklist"
        component={ChecklistScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon focused={focused} tabName="Checklist">
              <AnimatedIcon
                name={focused ? "list" : "list-outline"}
                size={24}
                color={color}
              />
            </AnimatedTabIcon>
          ),
        }}
      />
      <Tab.Screen
        name="LogBook"
        component={LogBookScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon focused={focused} tabName="Location">
              <AnimatedIcon
                name={focused ? "book" : "book-outline"}
                size={24}
                color={color}
              />
            </AnimatedTabIcon>
          ),
        }}
      />
      <Tab.Screen
        name="Location"
        component={LocationScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon focused={focused} tabName="Location">
              <AnimatedIcon
                name={focused ? "location" : "location-outline"}
                size={24}
                color={color}
              />
            </AnimatedTabIcon>
          ),
        }}
      />
      <Tab.Screen
        name="Service"
        component={MaintanceScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon focused={focused} tabName="Service">
              <AnimatedIcon
                name={focused ? "settings" : "settings-outline"}
                size={24}
                color={color}
              />
            </AnimatedTabIcon>
          ),
        }}
      />
      <Tab.Screen
        name="Fuel"
        component={FuelScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon focused={focused} tabName="Fuel">
              <AnimatedIcon
                name={focused ? "water" : "water-outline"}
                size={24}
                color={color}
              />
            </AnimatedTabIcon>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    height: 50,
    width: 50,
    position: "relative",
  },
  activeBackground: {
    position: "absolute",
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: `${colors.brand.primary}10`,
    zIndex: 1,
  },
});
