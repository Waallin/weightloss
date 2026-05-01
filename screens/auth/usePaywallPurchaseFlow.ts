import { useCallback, useState } from "react";
import {
  StackActions,
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
function getPaywallSuccessRoute(
  navigation: NavigationProp<ParamListBase>,
): "MainStack" | "MainNavigator" {
  const routeNames = navigation.getState()?.routeNames ?? [];
  return routeNames.includes("MainStack") ? "MainStack" : "MainNavigator";
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

 
          if (plan === "annual") {
            await trackMixpanelEvent(
              analyticsEvents.paywallStartTrail,
              baseProps,
            );
            await handleReminderNotification();
            await logMetaEvent("StartTrial", baseProps);
          } else {
            await trackMixpanelEvent(
              analyticsEvents.paywallPurchaseSuccess,
              baseProps,
            );
            await logMetaEvent("Subscribe", baseProps);
          }
          if (userEmail) {
            updateDocument("users", userEmail, {
              revenuecat: purchase,
            });
          }
          const nextRoute = getPaywallSuccessRoute(navigation);
          navigation.reset({
            index: 0,
            routes: [{ name: nextRoute }],
          });
        } else {
          await trackMixpanelEvent(analyticsEvents.paywallPurchaseFailed, {
            variant,
            plan,
            ...productProps,
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
    trackMixpanelEvent("paywall_restore_tap", { variant: showPaywallRaw });
    const restored = await restorePurchases();
    if (restored) {
      alert("Purchases restored");
      navigation.dispatch(
        StackActions.replace(getPaywallSuccessRoute(navigation)),
      );
    } else {
      alert("Failed to restore purchases");
    }
  }, [navigation, showPaywallRaw]);

  return { loading, handleCTAPress, handleRestorePurchases };
}
