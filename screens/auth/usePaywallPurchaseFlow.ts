import { useCallback, useState } from "react";
import {
  type NavigationProp,
  type ParamListBase,
} from "@react-navigation/native";
import { analyticsEvents } from "../../constants/analytics";
import { updateDocument } from "../../services/firebase";
import { logMetaEvent } from "../../services/metasdk";
import { trackMixpanelEvent } from "../../services/mixpanel";
import { purchasePlan, restorePurchases } from "../../services/revenuecat";
import {
  getPaywallProductAnalytics,
  type PaywallOfferProducts,
  type PaywallPlan,
} from "./paywallProductAnalytics";
import { handleReminderNotification } from "../../services/notifications";
import { logTikTokEvent } from "../../services/tiktoksdk";
import { TikTokEventName } from "react-native-tiktok-business-sdk";
function resetToApp(navigation: NavigationProp<ParamListBase>) {
  const routeNames = navigation.getState()?.routeNames ?? [];
  const routeName = routeNames.includes("MainStack")
    ? "MainStack"
    : "MainNavigator";

  navigation.reset({
    index: 0,
    routes: [{ name: routeName }],
  });
}

export type PaywallVariant = "default" | "reminder";

interface UsePaywallPurchaseFlowParams {
  navigation: NavigationProp<ParamListBase>;
  userEmail: string | undefined;
  products: PaywallOfferProducts;
  variant: PaywallVariant;
  showPaywallRaw: string | undefined;
}

export function usePaywallPurchaseFlow({
  navigation,
  userEmail,
  products,
  variant,
  showPaywallRaw,
}: UsePaywallPurchaseFlowParams) {
  const [loading, setLoading] = useState(false);

  const handleCTAPress = useCallback(
    async (plan: PaywallPlan) => {
      
      const productProps = getPaywallProductAnalytics(products, plan);

      setLoading(true);
      try {
        const purchase = await purchasePlan(plan);
        if (purchase) {
          const baseProps = { variant, plan, ...productProps };
       
            await trackMixpanelEvent(
              "paywall_start_subscription",
              baseProps,
            );

            await logMetaEvent("Subscribe", baseProps);
            await logTikTokEvent(TikTokEventName.SUBSCRIBE, undefined, baseProps);

          if (userEmail) {
            updateDocument("users", userEmail, {
              revenuecat: purchase,
            });
          }
          resetToApp(navigation);
        } else {
          await trackMixpanelEvent("Paywall_purchase_failed", {
            variant,
            plan,

          });
          alert("Purchase failed");
        }
      } finally {
        setLoading(false);
      }
    },
    [navigation, products, userEmail, variant],
  );

  const handleRestorePurchases = useCallback(async () => {
    trackMixpanelEvent("Paywall_restore_tap", { variant: showPaywallRaw });
    const restored = await restorePurchases();
    if (restored) {
      alert("Purchases restored");
      resetToApp(navigation);
    } else {
      alert("Failed to restore purchases");
    }
  }, [navigation, showPaywallRaw]);

  return { loading, handleCTAPress, handleRestorePurchases };
}
