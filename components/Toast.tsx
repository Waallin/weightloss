import { StyleSheet, Text, View, Animated } from "react-native";
import React, { useEffect, useRef } from "react";
import { colors } from "../constants/colors";
import { fonts } from "../constants/fonts";
import { spacing } from "../constants/spacing";
import { globalStyles } from "../constants/globalStyles";

interface ToastProps {
  title: string;
}

const Toast: React.FC<ToastProps> = ({ title }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    // Animera in toast
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Animera ut toast efter 3 sekunder
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }, 3000);

    return () => clearTimeout(timer);
  }, [fadeAnim, translateY]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.checkmark}>✓</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
    </Animated.View>
  );
};

export default Toast;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 60,
    left: spacing.md,
    right: spacing.md,
    zIndex: 1000,
    elevation: 10,
  },
  content: {
    backgroundColor: colors.status.success,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.borderRadius,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.ui.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.sm,
  },
  checkmark: {
    ...globalStyles.smallText,
    color: colors.status.success,
    fontFamily: fonts.primary.bold,
  },
  title: {
    ...globalStyles.smallText,
    color: colors.ui.white,
    fontFamily: fonts.primary.medium,
    flex: 1,
  },
});
