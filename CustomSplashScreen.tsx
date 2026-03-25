import { StyleSheet, Text, View, Animated } from "react-native";
import React, { useEffect, useRef } from "react";
import { colors } from "./constants/colors";

interface CustomSplashScreenProps {
  onFinish?: () => void;
}

const CustomSplashScreen: React.FC<CustomSplashScreenProps> = ({
  onFinish,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        onFinish?.();
      }, 800);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <Text style={styles.logo}>🚀</Text>
        <Text style={styles.appName}>App Template</Text>
      </Animated.View>
    </View>
  );
};

export default CustomSplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ui.first,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    fontSize: 60,
    marginBottom: 20,
  },
  appName: {
    fontSize: 28,
    fontWeight: "300",
    color: "#ffffff",
    letterSpacing: 2,
  },
});
