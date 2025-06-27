import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  Animated,
  StyleSheet,
  Dimensions,
  StatusBar,
} from "react-native";
import { colors } from "../constants/colors";
import { fonts } from "../constants/fonts";

const { width, height } = Dimensions.get("window");

interface CustomSplashScreenProps {
  onFinish: () => void;
}

export const CustomSplashScreen: React.FC<CustomSplashScreenProps> = ({
  onFinish,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const [currentStep, setCurrentStep] = useState(0);

  // Ladda din app-data här
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Steg 1: Visa logo med animation
      showLogo();

      // Steg 2: Ladda nödvändig data (simulera)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setCurrentStep(1);

      // Steg 3: Ladda mer data
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCurrentStep(2);

      // Steg 4: Avsluta splash screen
      await new Promise((resolve) => setTimeout(resolve, 500));
      hideAndFinish();
    } catch (error) {
      console.error("Error during app initialization:", error);
      // Om något går fel, visa appen ändå
      setTimeout(hideAndFinish, 1000);
    }
  };

  const showLogo = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideAndFinish = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      onFinish();
    });
  };

  const getLoadingText = () => {
    switch (currentStep) {
      case 0:
        return "Starting VST...";
      case 1:
        return "Loading boat data...";
      case 2:
        return "Preparing interface...";
      default:
        return "Almost ready!";
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />

      {/* Bakgrund med gradient-effekt */}
      <View style={styles.backgroundGradient} />

      {/* Huvudinnehåll */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
          },
        ]}
      >
        {/* App-logo eller ikon */}
        <Image
          source={require("../assets/splash-icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* App-namn */}
        <Text style={styles.appName}>VST</Text>
        <Text style={styles.subtitle}>Vessel Safety Tracker</Text>

        {/* Laddningsindikator */}
        <View style={styles.loadingContainer}>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: `${(currentStep + 1) * 33}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.loadingText}>{getLoadingText()}</Text>
        </View>
      </Animated.View>

      {/* Footer med version eller annat */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>v1.0.0</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary || "#007AFF",
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary || "#007AFF",
    // Du kan lägga till gradient här med react-native-linear-gradient
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    fontFamily: fonts.bold || "System",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.8,
    fontFamily: fonts.regular || "System",
    marginBottom: 60,
  },
  loadingContainer: {
    width: "100%",
    alignItems: "center",
  },
  progressBar: {
    width: "80%",
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 2,
    marginBottom: 16,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 2,
  },
  loadingText: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
    fontFamily: fonts.regular || "System",
  },
  footer: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#FFFFFF",
    opacity: 0.6,
    fontFamily: fonts.regular || "System",
  },
});
