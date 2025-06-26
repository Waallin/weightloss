import {
  Animated,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import WavesBackground from "../../components/WavesBackground";
import { spacing } from "../../constants/spacing";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../constants/colors";
import { globalStyles } from "../../constants/globalStyles";
import { Feather } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";
import PrimaryButton from "../../components/PrimaryButton";

const AddBoatScreen = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const breathingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    breathingAnimation.start();

    return () => breathingAnimation.stop();
  }, [scaleAnim]);

  const handleConnectToVessel = () => {
    console.log("test");
  };

  function renderVerificationInput() {
    return (
      <View
        style={{
          flex: 1,
          marginTop: spacing.xl,
          borderTopRightRadius: spacing.xl,
          borderTopLeftRadius: spacing.xl,
          backgroundColor: "#F5F6F7",
          paddingHorizontal: spacing.md,
          minHeight: "100%",
          paddingBottom: spacing.xl,
          paddingTop: spacing.xl,
        }}
      >
        <View>
          <Text
            style={{
              ...globalStyles.title,
              textAlign: "center",
            }}
          >
            Join Your Vessel
          </Text>
          <Text
            style={{
              ...globalStyles.subTitle,
              color: colors.text.tertiary,
              marginTop: spacing.md,
              textAlign: "center",
            }}
          >
            You're almost aboard! Just one quick verification step.
          </Text>
          <View
            style={{
              ...styles.inputContainer,
              marginTop: spacing.md,
            }}
          >
            <Feather name="lock" size={24} color={colors.brand.primary} />
            <TextInput
              style={{
                ...globalStyles.smallGreyText,
                flex: 1,
                color: colors.text.primary,
                marginLeft: spacing.sm,
              }}
              placeholder="6-digit vessel code"
              onChangeText={(text) => {
                setVerificationCode(text);
              }}
              value={verificationCode}
              keyboardType="numeric"
              maxLength={6}
            />
          </View>
          <View style={{ marginTop: spacing.md }}>
            <PrimaryButton
              title="Connect to Vessel"
              arrow={true}
              onPress={handleConnectToVessel}
              loading={loading}
              disabled={verificationCode.length !== 6}
            />
          </View>
          <View
            style={{
              marginTop: spacing.lg,
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          ></View>
        </View>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{ flex: 1 }}>
        <WavesBackground />

        <View
          style={{
            flex: 1,
            marginTop: spacing.md,
            paddingHorizontal: spacing.md,
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 50,
              gap: spacing.md,
            }}
          >
            <Animated.View
              style={{
                borderRadius: 40,
                backgroundColor: "#E6EEF5",
                padding: spacing.md,
                justifyContent: "center",
                alignItems: "center",
                transform: [{ scale: scaleAnim }],
              }}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={32}
                color="black"
              />
            </Animated.View>
            <Text
              style={{
                ...globalStyles.title,
                color: colors.ui.white,
                textAlign: "center",
              }}
            >
              Ready to Board?
            </Text>
            <Text
              style={{
                ...globalStyles.subTitle,
                color: "#E5F2FF",
                textAlign: "center",
                width: "80%",
              }}
            >
              Ask your captain for the vessel access code to get started with
              your maritime journey.
            </Text>
          </View>
          {renderVerificationInput()}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AddBoatScreen;

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: 1,
    borderColor: colors.ui.border,
    borderRadius: spacing.borderRadius,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
});
