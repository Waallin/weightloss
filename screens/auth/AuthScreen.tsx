import React, { useState, useEffect } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import { MotiText, MotiView } from "moti";
import { ReduceMotion } from "react-native-reanimated";
import { globalStyles } from "../../constants/globalStyles";
import { colors } from "../../constants/colors";
import { spacing } from "../../constants/spacing";
import { typography } from "../../constants/texts";
import { useNavigation } from "@react-navigation/native";
import * as haptics from "expo-haptics";
import * as AppleAuthentication from "expo-apple-authentication";
import { signInWithCredential, OAuthProvider } from "firebase/auth";
import { auth } from "../../services/firebaseConfig";
import useUserStore from "../../stores/useUserStore";
import Constants from "expo-constants";
import { setDocument } from "../../services/firebase";
const IMAGE_SIZE = 250;
import AsyncStorage from "@react-native-async-storage/async-storage";
import useConfigStore from "../../stores/useConfigStore";

const AuthScreen = () => {
  const [appleToken, setAppleToken] = useState<string | undefined>(undefined);
  const navigation = useNavigation();
  const { user, setUser } = useUserStore();
  const { config } = useConfigStore();
  useEffect(() => {
    if (appleToken) {

      const provider = new OAuthProvider("apple.com");
      const credential = provider.credential({ idToken: appleToken as string });

      signInWithCredential(auth, credential)
        .then((result) => {
          console.log("Signed in with Apple:", result.user);
          handleCreateAccount(result.user.email as string);
        })
        .catch((error) => {
          console.log("Error signing in with Apple:", error);
          Alert.alert("Fel", "Kunde inte verifiera Apple-inloggningen");
        });
    }
  }, [appleToken]);

  const handleAppleLogin = async () => {
    haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      if (credential.identityToken) {
        setAppleToken(credential.identityToken);
      } else {
        setAppleToken(undefined);
      }
    } catch (e: any) {
      if (e.code === 'ERR_REQUEST_CANCELED') {
      } else {
        Alert.alert("Error", "Failed to verify Apple login");
      }
    }
  };

  const handleCreateAccount = async (email: string) => {   
    try {
      const userObj = {
        ...user,
        email: email,
        createdAt: new Date(),
        lastActiveAt: new Date(),
        platform: Constants.platform?.ios ? "ios" : "android",
        version: Constants.expoConfig?.version || "",
        totalAppsOpen: 1,
      }
      const result = await setDocument("users", email, userObj);
      if (result) {
        await AsyncStorage.setItem("user", email);
        setUser(userObj);

        if (!config?.showPaywall) {
          navigation.replace("MainStack");
        } else {
        navigation.replace("Paywall");
        }
      }
    } catch (e: any) {
      console.log("Error creating account:", e);
    }
  };

  const renderImage = () => {
    return (
      <MotiView
        from={{ opacity: 0, translateY: 10, scale: 0.98 }}
        animate={{ opacity: 1, translateY: 0, scale: 1 }}
        transition={{
          type: "timing",
          duration: 450,
          reduceMotion: ReduceMotion.Never,
        }}
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        <MotiView
          from={{ opacity: 0, translateY: 14, scale: 0.96 }}
          animate={{ opacity: 1, translateY: 0, scale: 1 }}
          transition={{
            type: "timing",
            duration: 520,
            delay: 60,
            reduceMotion: ReduceMotion.Never,
          }}
          style={[
            {
              width: IMAGE_SIZE,
              height: IMAGE_SIZE,
              borderRadius: IMAGE_SIZE / 2,
              backgroundColor: colors.ui.secondaryBackground,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: spacing.xl,
              ...globalStyles.shadow,
              overflow: "hidden",
              alignSelf: "center",
            },
          ]}
        >
          <Image
            source={require("../../assets/mascot/thumbsUp.png")}
            resizeMode="cover"
            style={{ width: "100%", height: "100%" }}
          />
        </MotiView>
      </MotiView>
    );
  };

  const renderText = () => {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MotiText
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{
            type: "timing",
            duration: 380,
            delay: 120,
            reduceMotion: ReduceMotion.Never,
          }}
          style={{
            ...typography.screenTitle,
            color: colors.text.primary,
            textAlign: "center",
            marginBottom: spacing.sm,
          }}
        >
          You're almost ready
        </MotiText>
        <MotiText
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{
            type: "timing",
            duration: 380,
            delay: 170,
            reduceMotion: ReduceMotion.Never,
          }}
          style={{
            ...typography.body,
            color: colors.text.secondary,
            textAlign: "center",
            marginBottom: spacing.sm,
          }}
        >
          Create your account in seconds
        </MotiText>
      </View>
    );
  };

  const renderCTA = () => {
    return (
      <MotiView
        from={{ opacity: 0, translateY: 10, scale: 0.98 }}
        animate={{ opacity: 1, translateY: 0, scale: 1 }}
        transition={{
          type: "timing",
          duration: 450,
          delay: 220,
          reduceMotion: ReduceMotion.Never,
        }}
        style={{ width: "100%" }}
      >
        <AppleAuthentication.AppleAuthenticationButton

          buttonType={
            AppleAuthentication.AppleAuthenticationButtonType.CONTINUE
          }
          buttonStyle={
            AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
          }
          cornerRadius={10}
          style={{ width: "100%", height: 50 }}
          onPress={handleAppleLogin}
        />
      </MotiView>
    );
  };

  return (
    <View
      style={globalStyles.container}
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {renderImage()}
        {renderText()}
      </View>
      <View style={{ paddingBottom: spacing.ctaButtonBottomPadding }}>
        {renderCTA()}
      </View>
    </View>
  );
};

export default AuthScreen;
