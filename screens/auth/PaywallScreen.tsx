import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import DefaultPaywall from "./Paywalls/DefaultPaywall";
import ReminderPaywall from "./Paywalls/ReminderPaywall";
import useConfigStore from "../../stores/useConfigStore";
import { getProducts, purchasePlan, restorePurchases } from "../../services/revenuecat";
import { updateDocument } from "../../services/firebase";
import useUserStore from "../../stores/useUserStore";
import useRevCatStore from "../../stores/useRevCatStore";
import { trackMixpanelEvent } from "../../services/mixpanel";
import { useEffect } from "react";
const PaywallScreen: React.FC = () => {
  const navigation = useNavigation();
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

    if (purchase) {
      trackMixpanelEvent("purchase_success", { variant, plan });
      updateDocument("users", user?.email, {
        revenuecat: purchase,
      });
      navigation.replace("MainStack" as never);
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

    // restored är ett objekt. Kolla så restored innehåller entitlements eller purchases för att bestämma om det lyckades.
    if (restored && (restored.entitlements?.active || (Array.isArray(restored.purchases) && restored.purchases.length > 0))) {
      alert("Purchases restored");
      navigation.replace("MainStack" as never);
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
