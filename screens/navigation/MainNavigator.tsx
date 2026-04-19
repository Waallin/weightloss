import { StyleSheet, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

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
import * as haptics from "expo-haptics";
import { useEffect } from "react";
import HomeScreen from "../main/home/HomeScreen";
import SettingsScreen from "../main/settings/SettingsScreen";
import { textSizes, typography } from "../../constants/texts";
import ProgressScreen from "../main/progress/ProgressScreen";
import DietScreen from "../main/diet/DietScreen";

const Tab = createBottomTabNavigator();

/** Softer motion — reads more “premium” than stiff defaults */
const SPRING_PREMIUM = { damping: 22, stiffness: 200, mass: 0.65 };
const SPRING_BOUNCE = { damping: 14, stiffness: 220, mass: 0.55 };

const ACTIVE_PILL_SIZE = 46;
const ACTIVE_PILL_RADIUS = ACTIVE_PILL_SIZE / 2;

const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

const AnimatedTabIcon = ({
  focused,
  iconName,
  color,
}: {
  focused: boolean;
  iconName: string;
  color: string;
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(focused ? 1 : 0.44);
  const pillScale = useSharedValue(focused ? 1 : 0.86);
  const pillOpacity = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    opacity.value = withTiming(focused ? 1 : 0.44, { duration: 280 });
    pillOpacity.value = withTiming(focused ? 1 : 0, { duration: focused ? 320 : 200 });
    pillScale.value = withSpring(focused ? 1 : 0.86, SPRING_PREMIUM);

    if (focused) {
      scale.value = withSequence(
        withSpring(0.88, SPRING_BOUNCE),
        withSpring(1.06, SPRING_BOUNCE),
        withSpring(1, SPRING_PREMIUM)
      );
    } else {
      scale.value = withSpring(1, SPRING_PREMIUM);
    }
  }, [focused]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const animatedPillStyle = useAnimatedStyle(() => ({
    opacity: pillOpacity.value,
    transform: [{ scale: pillScale.value }],
  }));

  return (
    <View style={styles.tabIconContainer}>
      <Animated.View
        pointerEvents="none"
        style={[styles.activePillWrap, animatedPillStyle]}
      >
        <LinearGradient
          colors={[
            `${colors.ui.dietHeroGradientStart}55`,
            `${colors.ui.primary}30`,
          ]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.activePillGradient}
        />
      </Animated.View>
      <Animated.View style={[animatedIconStyle, { zIndex: 2 }]}>
        <AnimatedIcon
          name={iconName as keyof typeof Ionicons.glyphMap}
          size={textSizes.xxl}
          color={color}
        />
      </Animated.View>
    </View>
  );
};

const MainNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenListeners={{
        tabPress: () => {
          void haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
        },
      }}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.ui.white,
          position: "absolute",
          height: spacing.tabBarBaseHeight + insets.bottom,
          paddingTop: spacing.md,
          paddingBottom: insets.bottom,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.ui.cardBorder,
          borderTopLeftRadius: spacing.tabBarTopRadius,
          borderTopRightRadius: spacing.tabBarTopRadius,
          shadowColor: colors.ui.shadow,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 16,
          elevation: 12,
        },
        tabBarActiveTintColor: colors.ui.primary,
        tabBarInactiveTintColor: colors.text.secondary,

        tabBarLabelStyle: {
          ...typography.body,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon focused={focused} iconName="pulse" color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Diet"
        component={DietScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon focused={focused} iconName="nutrition" color={color} />
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
              iconName="stats-chart"
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
              iconName="settings"
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
    padding: spacing.xs,
    height: 52,
    width: 52,
    position: "relative",
  },
  activePillWrap: {
    position: "absolute",
    width: ACTIVE_PILL_SIZE,
    height: ACTIVE_PILL_SIZE,
    borderRadius: ACTIVE_PILL_RADIUS,
    zIndex: 1,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: `${colors.ui.primary}38`,
    shadowColor: colors.ui.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  activePillGradient: {
    width: ACTIVE_PILL_SIZE,
    height: ACTIVE_PILL_SIZE,
    borderRadius: ACTIVE_PILL_RADIUS,
  },
});
