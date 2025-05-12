import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { colors } from "../constants/colors";
import { spacing } from "../constants/spacing";
import { globalStyles } from "../constants/globalStyles";
import { Entypo } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

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
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: disabled ? 0.5 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [disabled]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const backgroundColor = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.status.disabled, colors.ui.accent],
  });

  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <AnimatedTouchable
        activeOpacity={0.8}
        style={{
          backgroundColor: backgroundColor,
          padding: spacing.md,
          borderRadius: spacing.md,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
        }}
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
