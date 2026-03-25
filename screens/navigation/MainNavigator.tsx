import { StyleSheet, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { spacing } from "../../constants/spacing";
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
import HomeScreen from "../main/home/HomeScreen";
import SettingsScreen from "../main/settings/SettingsScreen";
import { fonts } from "../../constants/fonts";
import { textSizes } from "../../constants/texts";
import ProgressScreen from "../main/progress/ProgressScreen";
import DietScreen from "../main/diet/DietScreen";

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Home: { outline: "home-outline" as const, filled: "home" as const },
  Diet: { outline: "nutrition-outline" as const, filled: "nutrition" as const },
  Progress: {
    outline: "stats-chart-outline" as const,
    filled: "stats-chart" as const,
  },
  Settings: {
    outline: "settings-outline" as const,
    filled: "settings" as const,
  },
} as const;

type TabIconKey = keyof typeof TAB_ICONS;

const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

const AnimatedTabIcon = ({
  focused,
  tabKey,
  color,
}: {
  focused: boolean;
  tabKey: TabIconKey;
  color: string;
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(focused ? 1 : 0.5);
  const navigation = useNavigation();

  const iconName = focused
    ? TAB_ICONS[tabKey].filled
    : TAB_ICONS[tabKey].outline;

  useEffect(() => {
    opacity.value = withTiming(focused ? 1 : 0.5, { duration: 300 });
    if (!focused) {
      scale.value = withSpring(1, { damping: 12, stiffness: 80 });
    }
  }, [focused]);

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
      }
    });

    return () => {
      unsubscribe();
    };
  }, [focused, navigation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.tabIconContainer}>
      {focused ? <View style={styles.activeBackground} /> : null}
      <Animated.View style={[animatedStyle, { zIndex: 2 }]}>
        <AnimatedIcon name={iconName} size={textSizes.xxl} color={color} />
      </Animated.View>
    </View>
  );
};

const MainNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.ui.white,
          position: "absolute",
          height: spacing.tabBarBaseHeight + insets.bottom,
          paddingTop: spacing.md,
          paddingBottom: insets.bottom,
          borderTopWidth: 1,
          borderTopColor: colors.ui.cardBorder,
          borderTopLeftRadius: spacing.tabBarTopRadius,
          borderTopRightRadius: spacing.tabBarTopRadius,
          shadowColor: colors.ui.shadow,
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.08,
          shadowRadius: 10,
          elevation: 10,
        },
        tabBarActiveTintColor: colors.ui.primary,
        tabBarInactiveTintColor: colors.text.secondary,

        tabBarLabelStyle: {
          fontFamily: fonts.primary.regular,
          fontSize: textSizes.sm,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon focused={focused} tabKey="Home" color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Diet"
        component={DietScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon focused={focused} tabKey="Diet" color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              focused={focused}
              tabKey="Progress"
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              focused={focused}
              tabKey="Settings"
              color={color}
            />
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
    backgroundColor: `${colors.ui.primary}18`,
    zIndex: 1,
  },
});
