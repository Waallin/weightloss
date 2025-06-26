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
  const dotOpacity1 = useSharedValue(1);
  const dotOpacity2 = useSharedValue(1);
  const dotOpacity3 = useSharedValue(1);

  useEffect(() => {
    opacity.value = withTiming(disabled ? 0.5 : 1, { duration: 50 });
  }, [disabled]);

  useEffect(() => {
    if (loading) {
      let intervalId: NodeJS.Timeout;

      const animateDots = () => {
        dotOpacity1.value = withTiming(0.3, { duration: 300 }, () => {
          dotOpacity2.value = withTiming(0.3, { duration: 300 }, () => {
            dotOpacity3.value = withTiming(0.3, { duration: 300 }, () => {
              dotOpacity1.value = withTiming(1, { duration: 300 });
              dotOpacity2.value = withTiming(1, { duration: 300 });
              dotOpacity3.value = withTiming(1, { duration: 300 });
            });
          });
        });
      };

      // Starta första animationen direkt
      animateDots();

      // Fortsätt animera med intervall
      intervalId = setInterval(() => {
        animateDots();
      }, 2000); // 1200ms = hela animationscykeln (300ms * 4 steg)

      // Cleanup function
      return () => {
        if (intervalId) {
          clearInterval(intervalId);
        }
      };
    } else {
      // Reset opacities när loading är false
      dotOpacity1.value = withTiming(1, { duration: 100 });
      dotOpacity2.value = withTiming(1, { duration: 100 });
      dotOpacity3.value = withTiming(1, { duration: 100 });
    }
  }, [loading]);

  const backgroundColorGlobal = interpolateColor(
    opacity.value,
    [0, 1],
    [colors.status.disabled, colors.ui.accent]
  );

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
    const backgroundColor = backgroundColorGlobal;
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

  const dotStyle = {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.ui.white,
    marginHorizontal: 2,
  };

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
        {loading ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                ...globalStyles.buttonText,
                color: backgroundColorGlobal,
              }}
            >
              .
            </Text>
            <Animated.View style={[dotStyle, { opacity: dotOpacity1 }]} />
            <Animated.View style={[dotStyle, { opacity: dotOpacity2 }]} />
            <Animated.View style={[dotStyle, { opacity: dotOpacity3 }]} />
          </View>
        ) : (
          <>
            <Text
              style={{ ...globalStyles.buttonText, color: colors.ui.white }}
            >
              {title}
            </Text>
            {arrow && (
              <Entypo name="chevron-right" size={20} color={colors.ui.white} />
            )}
          </>
        )}
      </AnimatedTouchable>
    </Animated.View>
  );
};

export default PrimaryButton;

const styles = StyleSheet.create({});
