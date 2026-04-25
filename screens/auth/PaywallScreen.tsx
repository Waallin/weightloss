import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import DefaultPaywall from "./Paywalls/DefaultPaywall";
import ReminderPaywall from "./Paywalls/ReminderPaywall";
import useConfigStore from "../../stores/useConfigStore";
import { getProducts, purchasePlan } from "../../services/revenuecat";
import { updateDocument } from "../../services/firebase";
import useUserStore from "../../stores/useUserStore";

const PaywallScreen: React.FC = () => {
  const navigation = useNavigation();
  const { config } = useConfigStore();
  const { user } = useUserStore();
  const [loading, setLoading] = useState(false);
  const handleCTAPress = async (plan: any) => {

    const purchase = await purchasePlan(plan);

    if (purchase) {
      updateDocument("users", user?.email, {
        revenuecat: purchase,
      });
      navigation.replace("MainStack" as never);
    } else {
      setLoading(false);
      alert("Purchase failed");
    }
    setLoading(false);
  };

  if (config?.showPaywall === "default") {
    return (
      <DefaultPaywall
        onCTAPress={(plan: "weekly" | "annual") =>
          handleCTAPress(plan as "weekly" | "annual")
        }
      />
    );
  }

  if (config?.showPaywall === "reminder") {
    return (
      <ReminderPaywall
        onCTAPress={(() => handleCTAPress("annual"))}
        loading={loading}
      />  
    );
  }

  return <DefaultPaywall onCTAPress={handleCTAPress} loading={loading} />;
};

export default PaywallScreen;
