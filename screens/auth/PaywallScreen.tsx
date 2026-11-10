import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from "react-native";
import {
  useNavigation,
  useRoute,
  type NavigationProp,
  type ParamListBase,
  type RouteProp,
} from "@react-navigation/native";
import Purchases, { type CustomerInfo, type PurchasesOffering } from "react-native-purchases";
import RevenueCatUI from "react-native-purchases-ui";
import { TikTokEventName } from "react-native-tiktok-business-sdk";
import { colors } from "../../constants/colors";
import { analyticsEvents } from "../../constants/analytics";
import { trackMixpanelEvent } from "../../services/mixpanel";
import { logMetaEvent } from "../../services/metasdk";
import { logTikTokEvent } from "../../services/tiktoksdk";
import { updateDocument } from "../../services/firebase";
import { customerHasPremium, PREMIUM_ENTITLEMENT } from "../../services/revenuecat";
import { resetToMain } from "../../services/paywallNavigation";
import usePremiumStore from "../../stores/usePremiumStore";
import useUserStore from "../../stores/useUserStore";
import type { RootStackParamList } from "../navigation/types";

// Hård paywall byggd i RevenueCat (paywallen "Kudoo Premium v1", kopplad till offeringen "default").
// Inget stäng-alternativ: vägen vidare är köp eller restore.
const PAYWALL_VARIANT = "rc_v1";

type LoadState = "loading" | "ready" | "error";

const PaywallScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<RootStackParamList, "Paywall">>();
  const placement = route.params?.placement ?? "app_open";
  const { user } = useUserStore();
  const setPremium = usePremiumStore((s) => s.setPremium);

  const [offering, setOffering] = useState<PurchasesOffering | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const viewedTracked = useRef(false);
  const leaving = useRef(false);

  const loadOffering = useCallback(async () => {
    setLoadState("loading");
    try {
      const offerings = await Purchases.getOfferings();
      if (!offerings.current) throw new Error("No current offering");
      setOffering(offerings.current);
      setLoadState("ready");
    } catch (e) {
      console.log("Could not load offerings:", e);
      void trackMixpanelEvent(analyticsEvents.paywallPurchaseFailed, {
        variant: PAYWALL_VARIANT,
        placement,
        cancelled: false,
        error_code: "OFFERINGS_NOT_LOADED",
      });
      setLoadState("error");
    }
  }, [placement]);

  useEffect(() => {
    void loadOffering();
  }, [loadOffering]);

  useEffect(() => {
    if (loadState !== "ready" || viewedTracked.current) return;
    viewedTracked.current = true;
    void trackMixpanelEvent(analyticsEvents.paywallViewed, {
      variant: PAYWALL_VARIANT,
      placement,
      offering_id: offering?.identifier,
    });
    void logMetaEvent("ViewContent", { content_type: "paywall", variant: PAYWALL_VARIANT });
  }, [loadState, offering, placement]);

  const goIn = useCallback(() => {
    if (leaving.current) return;
    leaving.current = true;
    setPremium(true);
    resetToMain(navigation);
  }, [navigation, setPremium]);

  // Premium kan bli aktivt utanför den här skärmen (kundinfo-lyssnaren). Då ska vi inte sitta kvar.
  const isPremium = usePremiumStore((s) => s.isPremium);
  useEffect(() => {
    if (isPremium) goIn();
  }, [isPremium, goIn]);

  const handlePurchaseCompleted = useCallback(
    async ({ customerInfo }: { customerInfo: CustomerInfo }) => {
      if (!customerHasPremium(customerInfo)) return;
      const entitlement = customerInfo.entitlements.active[PREMIUM_ENTITLEMENT];
      const isTrial = entitlement?.periodType === "TRIAL";
      const props: Record<string, string | number | boolean> = {
        variant: PAYWALL_VARIANT,
        placement,
        product_id: entitlement?.productIdentifier ?? "unknown",
        offering_id: offering?.identifier ?? "unknown",
        is_trial: isTrial,
      };

      void trackMixpanelEvent(analyticsEvents.paywallPurchaseSucceeded, props);
      void logMetaEvent("Subscribe", props);
      if (isTrial) void logTikTokEvent(TikTokEventName.START_TRIAL, undefined, props);
      if (user?.email) {
        updateDocument("users", user.email, { revenuecat: customerInfo });
      }
      goIn();
    },
    [goIn, offering?.identifier, placement, user?.email],
  );

  const handleRestoreCompleted = useCallback(
    ({ customerInfo }: { customerInfo: CustomerInfo }) => {
      if (customerHasPremium(customerInfo)) {
        if (user?.email) updateDocument("users", user.email, { revenuecat: customerInfo });
        goIn();
      } else {
        Alert.alert(
          "No active subscription found",
          "We couldn't find a Kudoo Premium subscription on this Apple ID.",
        );
      }
    },
    [goIn, user?.email],
  );

  if (loadState !== "ready" || !offering) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: 32,
          gap: 16,
          backgroundColor: colors.ui.background,
        }}
      >
        {loadState === "loading" ? (
          <ActivityIndicator size="large" color={colors.ui.primary} />
        ) : (
          <>
            <Text style={{ fontSize: 18, textAlign: "center", color: colors.text.primary }}>
              We couldn't load the subscription options. Check your connection and try again.
            </Text>
            <TouchableOpacity
              onPress={loadOffering}
              style={{
                backgroundColor: colors.ui.primary,
                borderRadius: 14,
                paddingVertical: 14,
                paddingHorizontal: 28,
              }}
            >
              <Text style={{ color: colors.ui.white, fontSize: 17, fontWeight: "600" }}>
                Try again
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <RevenueCatUI.Paywall
        options={{ offering, displayCloseButton: false }}
        onPurchaseStarted={({ packageBeingPurchased }) => {
          void trackMixpanelEvent(analyticsEvents.paywallCtaTapped, {
            variant: PAYWALL_VARIANT,
            placement,
            package_id: packageBeingPurchased.identifier,
            product_id: packageBeingPurchased.product.identifier,
          });
        }}
        onPurchaseCompleted={handlePurchaseCompleted}
        onPurchaseCancelled={() => {
          void trackMixpanelEvent(analyticsEvents.paywallPurchaseCancelled, {
            variant: PAYWALL_VARIANT,
            placement,
            cancelled: true,
          });
        }}
        onPurchaseError={({ error }) => {
          void trackMixpanelEvent(analyticsEvents.paywallPurchaseFailed, {
            variant: PAYWALL_VARIANT,
            placement,
            cancelled: false,
            error_code: String(error?.code ?? "UNKNOWN"),
            error_message: String(error?.message ?? ""),
          });
        }}
        onRestoreStarted={() => {
          void trackMixpanelEvent(analyticsEvents.paywallRestoreTapped, {
            variant: PAYWALL_VARIANT,
            placement,
          });
        }}
        onRestoreCompleted={handleRestoreCompleted}
        onDismiss={() => {
          // Hård paywall: att stänga ger ingen åtkomst. Går bara vidare om användaren redan är premium.
          if (usePremiumStore.getState().isPremium) goIn();
        }}
      />
    </View>
  );
};

export default PaywallScreen;
