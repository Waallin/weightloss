import { useCallback, useRef, useState } from "react";
import {
  type NavigationProp,
  type ParamListBase,
} from "@react-navigation/native";
import { analyticsEvents } from "../../constants/analytics";
import { updateDocument } from "../../services/firebase";
import { logMetaEvent } from "../../services/metasdk";
import { trackMixpanelEvent } from "../../services/mixpanel";
import { getProducts, purchasePlan, restorePurchases } from "../../services/revenuecat";
import useRevCatStore from "../../stores/useRevCatStore";
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

  if (routeNames.includes("MainStack")) {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: "MainStack",
          state: { routes: [{ name: "FirstDayGuide" }] },
        },
      ],
    });
    return;
  }

  navigation.reset({
    index: 0,
    routes: [{ name: "FirstDayGuide" }],
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
  const inFlight = useRef(false);
  const { setProducts } = useRevCatStore();

  const handleCTAPress = useCallback(
    async (plan: PaywallPlan) => {
      if (inFlight.current) return;
      inFlight.current = true;
      setLoading(true);

      try {
        let currentProducts: any = products;
        if (!currentProducts?.[plan]) {
          try {
            currentProducts = await getProducts();
            setProducts(currentProducts);
          } catch (e) {
            console.log("Reloading products failed:", e);
          }
        }
        const productProps = getPaywallProductAnalytics(currentProducts, plan);

        void trackMixpanelEvent(analyticsEvents.paywallCtaTapped, {
          variant,
          plan,
          product_id: productProps.productIdentifier,
        });

        if (!currentProducts?.[plan]) {
          await trackMixpanelEvent(analyticsEvents.paywallPurchaseFailed, {
            variant,
            plan,
            cancelled: false,
            error_code: "PRODUCTS_NOT_LOADED",
            error_message: "Offerings missing or package not found",
            product_id: productProps.productIdentifier,
            package_id: productProps.packageIdentifier,
            ...productProps,
          });
          alert("We couldn't load the subscription options. Check your connection and try again.");
          return;
        }

        const result = await purchasePlan(plan);

        if (result.status === "success") {
          const baseProps = {
            variant,
            plan,
            ...productProps,
            product_id: result.productId ?? productProps.productIdentifier,
            offering_id: result.offeringId,
            is_trial: result.isTrial,
          };

          await trackMixpanelEvent(analyticsEvents.paywallPurchaseSucceeded, baseProps);
          const definedProps = Object.fromEntries(
            Object.entries(baseProps).filter(([, v]) => v !== undefined),
          ) as Record<string, string | number | boolean>;
          await logMetaEvent("Subscribe", definedProps);
          if (result.isTrial) {
            await logTikTokEvent(TikTokEventName.START_TRIAL, undefined, definedProps);
          }

          if (userEmail) {
            updateDocument("users", userEmail, {
              revenuecat: result.customerInfo,
            });
          }
          resetToApp(navigation);
        } else if (result.status === "cancelled") {
          await trackMixpanelEvent(analyticsEvents.paywallPurchaseCancelled, {
            variant,
            plan,
            cancelled: true,
            ...productProps,
            product_id: result.productId ?? productProps.productIdentifier,
            offering_id: result.offeringId,
          });
        } else {
          await trackMixpanelEvent(analyticsEvents.paywallPurchaseFailed, {
            variant,
            plan,
            cancelled: false,
            ...productProps,
            product_id: result.productId ?? productProps.productIdentifier,
            offering_id: result.offeringId,
            error_code: result.errorCode,
            error_message: result.errorMessage,
          });
          alert("Purchase failed");
        }
      } finally {
        inFlight.current = false;
        setLoading(false);
      }
    },
    [navigation, products, userEmail, variant, setProducts],
  );

  const handleRestorePurchases = useCallback(async () => {
    trackMixpanelEvent(analyticsEvents.paywallRestoreTapped, { variant: showPaywallRaw });
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
