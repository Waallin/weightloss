import React, { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import * as haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../../constants/colors";
import { spacing } from "../../../../constants/spacing";
import { typography } from "../../../../constants/texts";
import { analyticsEvents } from "../../../../constants/analytics";
import { trackMixpanelEvent, identifyMixpanel, setMixpanelPeopleProperty, setMixpanelPeopleProperties } from "../../../../services/mixpanel";
import { identifyAdPlatforms, refreshSuperProperties, trackMilestone } from "../../../../services/tracking";
import { isAnonymousUser, linkAppleToAnonymous } from "../../../../services/accounts";
import useUserStore from "../../../../stores/useUserStore";
import useTodayProgressStore from "../../../../stores/useTodayProgressStore";
import useTodayDietStore from "../../../../stores/useTodayDietStore";
import useToastStore from "../../../../stores/useToastStore";

const DISMISSED_KEY = "save_progress_dismissed_at";
const REMIND_AFTER_MS = 3 * 24 * 60 * 60 * 1000;

/** Ber anonyma användare koppla Apple efter att de kommit igång. Visas aldrig för riktiga konton. */
const SaveProgressCard = ({ eligible }: { eligible: boolean }) => {
  const { user, setUser } = useUserStore();
  const { showToast } = useToastStore();
  const { setTodayProgress } = useTodayProgressStore();
  const { setTodayDiet } = useTodayDietStore();
  const [dismissed, setDismissed] = useState(true);
  const [busy, setBusy] = useState(false);

  const show = isAnonymousUser(user) && eligible && !dismissed;

  useEffect(() => {
    AsyncStorage.getItem(DISMISSED_KEY)
      .then((value) => {
        const at = value ? Number(value) : 0;
        setDismissed(Date.now() - at < REMIND_AFTER_MS);
      })
      .catch(() => setDismissed(false));
  }, []);

  useEffect(() => {
    if (show) trackMixpanelEvent(analyticsEvents.saveProgressViewed);
  }, [show]);

  if (!show) return null;

  const handleDismiss = async () => {
    haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
    trackMixpanelEvent(analyticsEvents.saveProgressDismissed);
    setDismissed(true);
    await AsyncStorage.setItem(DISMISSED_KEY, String(Date.now())).catch(() => {});
  };

  const handleSave = async () => {
    if (busy) return;
    haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [AppleAuthentication.AppleAuthenticationScope.EMAIL],
      });
      if (!credential.identityToken) return;
      setBusy(true);
      const linked = await linkAppleToAnonymous(user.email, credential.identityToken);
      if (!linked) throw new Error("no-account");
      await AsyncStorage.setItem("user", linked.docId);
      if (linked.docId !== user.email) {
        // Inloggad på ett annat, redan befintligt konto: släng den gamla kontots dagsdata
        setTodayProgress(null);
        setTodayDiet([]);
      }
      setUser(linked.user);
      await identifyMixpanel(linked.docId);
      if (linked.user.appleEmail) await setMixpanelPeopleProperty("email", linked.user.appleEmail);
      await refreshSuperProperties(linked.user);
      setMixpanelPeopleProperties({ account_type: "apple" });
      identifyAdPlatforms(linked.docId, linked.user.appleEmail);
      trackMilestone("account_linked", undefined, linked.docId);
      showToast("Progress saved");
    } catch (e: any) {
      if (e?.code === "ERR_REQUEST_CANCELED") return;
      trackMixpanelEvent(analyticsEvents.appleLoginFailed);
      Alert.alert("Couldn't save", "Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <View
      style={{
        backgroundColor: colors.ui.white,
        borderRadius: 24,
        padding: spacing.md,
        gap: 12,
        shadowColor: colors.goals.dark,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 24,
        elevation: 4,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: colors.goals.eatSoft,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="cloud-upload-outline" size={22} color={colors.goals.eat} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ ...typography.bodySemiBold, fontSize: 16, color: colors.text.primary }}>
            Save your progress
          </Text>
          <Text style={{ ...typography.body, fontSize: 14, color: colors.goals.muted, marginTop: 2 }}>
            Sign in with Apple to keep your meals if you switch phones.
          </Text>
        </View>
      </View>
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={10}
        style={{ width: "100%", height: 46 }}
        onPress={handleSave}
      />
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handleDismiss}
        style={{ height: 36, alignItems: "center", justifyContent: "center" }}
      >
        <Text style={{ ...typography.cardTitle, color: colors.goals.muted }}>Later</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SaveProgressCard;
