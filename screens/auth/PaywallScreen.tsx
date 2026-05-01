import React, { useEffect } from "react";
import {
  useNavigation,
  type NavigationProp,
  type ParamListBase,
} from "@react-navigation/native";
import DefaultPaywall from "./Paywalls/DefaultPaywall";
import ReminderPaywall from "./Paywalls/ReminderPaywall";
import useConfigStore from "../../stores/useConfigStore";
import useUserStore from "../../stores/useUserStore";
import useRevCatStore from "../../stores/useRevCatStore";
import { trackMixpanelEvent } from "../../services/mixpanel";
import { logMetaEvent } from "../../services/metasdk";
import { usePaywallPurchaseFlow } from "./usePaywallPurchaseFlow";

const PaywallScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { config } = useConfigStore();
  const { user } = useUserStore();
  const { products } = useRevCatStore();

  useEffect(() => {
    trackMixpanelEvent("onboarding_completed");
  }, []);

  const variant = config?.showPaywall === "reminder" ? "reminder" : "default";

  const { loading, handleCTAPress, handleRestorePurchases } =
    usePaywallPurchaseFlow({
      navigation,
      userEmail: user?.email,
      products,
      variant,
      showPaywallRaw: config?.showPaywall,
    });

  useEffect(() => {
    trackMixpanelEvent("Paywall", { variant: config?.showPaywall });
    logMetaEvent("ViewContent", { content_type: "paywall", variant });
  }, [config?.showPaywall, variant]);

  if (config?.showPaywall === "reminder") {
    return (
      <ReminderPaywall
        products={products}
        onCTAPress={handleCTAPress}
        loading={loading}
        onRestorePurchases={handleRestorePurchases}
      />
    );
  }

  return (
    <DefaultPaywall
      products={products}
      onCTAPress={handleCTAPress}
      onRestorePurchases={handleRestorePurchases}
    />
  );
};

export default PaywallScreen;
