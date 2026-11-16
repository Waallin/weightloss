import React, { useState, useEffect, useRef } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { MotiText, MotiView } from "moti";
import { ReduceMotion } from "react-native-reanimated";
import { globalStyles } from "../../constants/globalStyles";
import { colors } from "../../constants/colors";
import { spacing } from "../../constants/spacing";
import { typography } from "../../constants/texts";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as haptics from "expo-haptics";
import * as AppleAuthentication from "expo-apple-authentication";
import useUserStore from "../../stores/useUserStore";
import Constants from "expo-constants";
import { getDocuments, setDocument, updateDocument } from "../../services/firebase";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConfig";
import { identifyAdPlatforms, refreshSuperProperties } from "../../services/tracking";
import PlanSummary from "./components/PlanSummary";
import SocialProofItem from "./components/SocialProofItem";
import { loadingTestimonial } from "../../constants/socialProof";
import { paywallCopy } from "../../constants/texts";
import PrimaryButtonComponent from "../../components/PrimaryButtonComponent";
import { restoreFromApple, startAnonymousSession } from "../../services/accounts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getNotificationToken,
  scheduleActiveUserNotifications,
} from "../../services/notifications";
import { identifyMixpanel, trackMixpanelEvent } from "../../services/mixpanel";
import { linkRevenueCatToAccount } from "../../services/premiumSync";
import { analyticsEvents } from "../../constants/analytics";
import { FIRST_DAY_GUIDE_STEP_KEY } from "../main/home/FirstDayGuideScreen";
import { getDateKey } from "../../utils/dateUtils";
import useTodayDietStore from "../../stores/useTodayDietStore";
import { logTikTokEvent } from "../../services/tiktoksdk";
import { TikTokEventName } from "react-native-tiktok-business-sdk";

const currentYear = new Date().getFullYear();
// Standardvärden tills användaren svarat på profilfrågorna efter paywallen (profilePending)
const DEFAULT_PROFILE = {
  birthYear: currentYear - 35,
  gender: "Male",
  height: 175,
  startWeight: 100,
  goalWeight: 90,
  currentWeight: 100,
  profilePending: true,
};

const MIN_SETUP_VIEW_MS = 4500;

const AuthScreen = () => {
  const [busy, setBusy] = useState(false);
  const navigation = useNavigation<any>();
  const { user, setUser } = useUserStore();
  const { setTodayDiet } = useTodayDietStore();
  const route = useRoute<any>();
  // autoStart: nya flödet. Kontot skapas direkt efter åldersfrågan, utan planskärm eller Start-knapp.
  const autoStart = route.params?.autoStart === true;
  // restore: "Already have an account? Sign in" från åldersfrågan
  const restoreMode = route.params?.mode === "restore";
  const [failed, setFailed] = useState(false);
  const startedRef = useRef(false);
  const setupStartedAtRef = useRef(0);

  useEffect(() => {
    if (autoStart) {
      if (startedRef.current) return;
      startedRef.current = true;
      void handleStart();
      return;
    }
    trackMixpanelEvent(analyticsEvents.authViewed);
    if (!restoreMode) trackMixpanelEvent(analyticsEvents.planReadyViewed);
  }, []);

  const goToGuide = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: "MainStack",
          state: { routes: [{ name: "FirstDayGuide" }] },
        },
      ],
    });
  };

  /** Skapar ett anonymt konto med profilen från onboardingen. Apple kopplas på senare. */
  const handleStart = async () => {
    if (busy) return;
    haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
    setBusy(true);
    setupStartedAtRef.current = Date.now();
    trackMixpanelEvent(analyticsEvents.startTapped);
    try {
      const firebaseUser = await startAnonymousSession();
      const docId = firebaseUser.uid;
      const userObj = {
        ...(autoStart ? DEFAULT_PROFILE : {}),
        ...user,
        email: docId,
        isAnonymous: true,
        createdAt: new Date(),
        lastActiveAt: new Date(),
        platform: Constants.platform?.ios ? "ios" : "android",
        version: Constants.expoConfig?.version || "",
        totalAppsOpen: 1,
      };
      const result = await setDocument("users", docId, userObj);
      if (!result) throw new Error("setDocument failed");

      await AsyncStorage.setItem("user", docId);
      setUser(userObj);
      try {
        const notificationToken = await getNotificationToken();
        await updateDocument("users", docId, { notificationToken });
        setUser({ ...userObj, notificationToken });
      } catch {
        // Notiser nekade eller otillgängliga – fortsätt utan token
      }
      scheduleActiveUserNotifications();

      await identifyMixpanel(docId);
      await linkRevenueCatToAccount(docId);
      await refreshSuperProperties(userObj);
      await identifyAdPlatforms(docId);
      await trackMixpanelEvent(analyticsEvents.userRegistered, { anonymous: true });
      await logTikTokEvent(TikTokEventName.REGISTRATION);

      // Nya konton börjar i FirstDayGuide; "pending" gör att guiden även återupptas vid appstart
      await AsyncStorage.setItem(FIRST_DAY_GUIDE_STEP_KEY, "pending");
      // Social proof-vyn får synas en stund även om kontot gick snabbt
      if (autoStart) {
        const wait = MIN_SETUP_VIEW_MS - (Date.now() - setupStartedAtRef.current);
        if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
      }
      goToGuide();
    } catch (e: any) {
      console.log("Error starting anonymous session:", e);
      Alert.alert("Couldn't start", "Check your connection and try again.");
      setFailed(true);
    } finally {
      setBusy(false);
    }
  };

  /** Återställer ett befintligt konto efter ominstallation eller ny telefon. */
  const handleRestore = async () => {
    if (busy) return;
    haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
    trackMixpanelEvent(analyticsEvents.appleLoginTapped);
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [AppleAuthentication.AppleAuthenticationScope.EMAIL],
      });
      if (!credential.identityToken) {
        trackMixpanelEvent(analyticsEvents.appleLoginFailed);
        return;
      }
      setBusy(true);
      const restored = await restoreFromApple(credential.identityToken);
      if (!restored) {
        await signOut(auth); // Annars återanvänds Apple-sessionen när användaren trycker Start
        Alert.alert("No account found", "We couldn't find an account for this Apple ID. Tap Start to create one.");
        return;
      }
      await AsyncStorage.setItem("user", restored.docId);
      await AsyncStorage.setItem(FIRST_DAY_GUIDE_STEP_KEY, "done");
      setUser(restored.user);
      setTodayDiet(
        await getDocuments(`users/${restored.docId}/days/${getDateKey()}/foodEntries`),
      );
      await identifyMixpanel(restored.docId);
      await linkRevenueCatToAccount(restored.docId);
      await refreshSuperProperties(restored.user);
      navigation.reset({ index: 0, routes: [{ name: "MainStack" }] });
    } catch (e: any) {
      if (e?.code === "ERR_REQUEST_CANCELED") {
        trackMixpanelEvent(analyticsEvents.appleLoginCanceled);
      } else {
        trackMixpanelEvent(analyticsEvents.appleLoginFailed);
        Alert.alert("Sign in failed", "Couldn't verify your Apple ID. Try again.");
      }
    } finally {
      setBusy(false);
    }
  };

  const renderCTA = () => (
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
      <PrimaryButtonComponent title="Start" onPress={handleStart} loading={busy} />
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handleRestore}
        style={{ height: 44, alignItems: "center", justifyContent: "center", marginTop: spacing.xs }}
      >
        <Text style={{ ...typography.cardTitle, color: colors.text.secondary }}>
          Already have an account? Sign in
        </Text>
      </TouchableOpacity>
    </MotiView>
  );

  if (restoreMode) {
    return (
      <View style={globalStyles.container}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.sm }}>
          <Text style={{ ...typography.screenTitle, color: colors.text.primary, textAlign: "center" }}>
            Welcome back
          </Text>
          <Text style={{ ...typography.bodyMedium, color: colors.text.secondary, textAlign: "center" }}>
            Sign in with the Apple ID you used before.
          </Text>
        </View>
        <View style={{ paddingBottom: spacing.ctaButtonBottomPadding, gap: spacing.sm }}>
          <PrimaryButtonComponent title="Sign in with Apple" onPress={handleRestore} loading={busy} />
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
            style={{ height: 44, alignItems: "center", justifyContent: "center" }}
          >
            <Text style={{ ...typography.cardTitle, color: colors.text.secondary }}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (autoStart) {
    return (
      <View style={globalStyles.container}>
        {failed ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ ...typography.bodyMedium, color: colors.text.secondary, textAlign: "center" }}>
              We couldn't set things up. Check your connection and try again.
            </Text>
          </View>
        ) : (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.lg }}>
            <MotiView
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 450, reduceMotion: ReduceMotion.Never }}
              style={{ alignItems: "center", gap: 6 }}
            >
              <Text style={{ ...typography.displayNumeric, fontSize: 56, lineHeight: 62, color: colors.text.primary }}>
                {paywallCopy.socialProofRating}
              </Text>
              <Text style={{ ...typography.cardTitle, color: colors.text.primary, textAlign: "center" }}>
                {paywallCopy.socialProofHeadline}
              </Text>
              <Text style={{ ...typography.bodyMedium, color: colors.text.secondary, textAlign: "center" }}>
                {paywallCopy.socialProofMembers}
              </Text>
            </MotiView>
            <MotiView
              from={{ opacity: 0, translateY: 16 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 500, delay: 250, reduceMotion: ReduceMotion.Never }}
              style={{ width: "100%" }}
            >
              <SocialProofItem item={loadingTestimonial} variant="premium" />
            </MotiView>
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
              <ActivityIndicator size="small" color={colors.ui.primary} />
              <Text style={{ ...typography.bodyMedium, color: colors.text.secondary }}>Setting things up…</Text>
            </View>
          </View>
        )}
        {failed ? (
          <View style={{ paddingBottom: spacing.ctaButtonBottomPadding }}>
            <PrimaryButtonComponent title="Try again" onPress={handleStart} loading={busy} />
          </View>
        ) : null}
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingVertical: spacing.md,
        }}
      >
        <PlanSummary />
      </ScrollView>
      <View style={{ paddingBottom: spacing.ctaButtonBottomPadding, gap: spacing.sm }}>
        {renderCTA()}
      </View>
    </View>
  );
};

export default AuthScreen;
