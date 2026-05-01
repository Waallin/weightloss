import React, { useState, useEffect } from "react";
import {
  useNavigation,
  StackActions,
  type NavigationProp,
  type ParamListBase,
} from "@react-navigation/native";
import DefaultPaywall from "./Paywalls/DefaultPaywall";
import ReminderPaywall from "./Paywalls/ReminderPaywall";
import useConfigStore from "../../stores/useConfigStore";
import { getProducts, purchasePlan, restorePurchases } from "../../services/revenuecat";
import { updateDocument } from "../../services/firebase";
import useUserStore from "../../stores/useUserStore";
import useRevCatStore from "../../stores/useRevCatStore";
import { trackMixpanelEvent } from "../../services/mixpanel";

function getPaywallSuccessRoute(
  navigation: NavigationProp<ParamListBase>,
): "MainStack" | "MainNavigator" {
  const routeNames = navigation.getState()?.routeNames ?? [];
  return routeNames.includes("MainStack") ? "MainStack" : "MainNavigator";
}

const PaywallScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { config } = useConfigStore();
  const { user } = useUserStore();
  const [loading, setLoading] = useState(false);
  const { products } = useRevCatStore();

  useEffect(() => {
    trackMixpanelEvent("Paywall", { variant: config?.showPaywall });
  }, []);
  const handleCTAPress = async (plan: any) => {

    const variant = config?.showPaywall;
    
    const purchase = await purchasePlan(plan);
    console.log("🚀 ~ handleCTAPress ~ purchase:", purchase)

    if (purchase) {
      trackMixpanelEvent("purchase_success", { variant, plan });
      updateDocument("users", user?.email, {
        revenuecat: purchase,
      });
      const nextRoute = getPaywallSuccessRoute(navigation);
      navigation.reset({
        index: 0,
        routes: [{ name: nextRoute }],
      });
    } else {
      setLoading(false);
      trackMixpanelEvent("purchase_failed", { variant, plan });
      alert("Purchase failed");
    }
    setLoading(false);
  };

  const handleRestorePurchases = async () => {
    const variant = config?.showPaywall;
    trackMixpanelEvent("paywall_restore_tap", { variant });
    const restored = await restorePurchases();
    if (restored) {
      alert("Purchases restored");
      navigation.dispatch(
        StackActions.replace(getPaywallSuccessRoute(navigation)),
      );
    } else {
      alert("Failed to restore purchases");
    }
  };

  if (config?.showPaywall === "default") {
    return (
      <DefaultPaywall
        products={products}
        onCTAPress={(plan: "weekly" | "annual") =>
          handleCTAPress(plan as "weekly" | "annual")
        }
        onRestorePurchases={() => handleRestorePurchases()}
      />
    );
  }

  if (config?.showPaywall === "reminder") {
    return (
      <ReminderPaywall
        products={products}
        onCTAPress={(plan: "weekly" | "annual") => handleCTAPress(plan as "weekly" | "annual")}
        loading={loading}
        onRestorePurchases={() => handleRestorePurchases()}
      />  
    );
  }

  return <DefaultPaywall onCTAPress={(plan: "weekly" | "annual") => handleCTAPress(plan as "weekly" | "annual")} products={products} />;
};

export default PaywallScreen;
