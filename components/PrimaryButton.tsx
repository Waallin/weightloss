import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import { colors } from "../constants/colors";
import { spacing } from "../constants/spacing";
import { globalStyles } from "../constants/globalStyles";
import { Entypo } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
  useSharedValue,
} from "react-native-reanimated";

const PrimaryButton = ({
  onPress,
  loading,
  disabled,
  title,
  arrow,
}: {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  title: string;
  arrow?: boolean;
}) => {
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    opacity.value = withTiming(disabled ? 0.5 : 1, { duration: 50 });
  }, [disabled]);

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 1,
      stiffness: 20,
    });
  };

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const buttonStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      opacity.value,
      [0, 1],
      [colors.status.disabled, colors.ui.accent]
    );

    return {
      backgroundColor,
      padding: spacing.md,
      borderRadius: spacing.borderRadius,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      flexDirection: "row" as const,
    };
  });

  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  return (
    <Animated.View style={animatedStyle}>
      <AnimatedTouchable
        activeOpacity={0.8}
        style={buttonStyle}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
      >
        <Text style={{ ...globalStyles.buttonText, color: colors.ui.white }}>
          {title}
        </Text>
        {arrow && (
          <Entypo name="chevron-right" size={20} color={colors.ui.white} />
        )}
      </AnimatedTouchable>
    </Animated.View>
  );
};

export default PrimaryButton;

const styles = StyleSheet.create({});
