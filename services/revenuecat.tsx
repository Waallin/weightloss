import { Platform } from "react-native";
import Purchases, { LOG_LEVEL } from "react-native-purchases";

export async function initRevenueCat() {

  await Purchases.setLogLevel(LOG_LEVEL.WARN);

  if (Platform.OS === 'ios') {
    Purchases.configure({
      apiKey: process.env.EXPO_PUBLIC_RC_API_KEY,
    });
  }
}

export async function isCustomerPremium() {
  const customerInfo = await Purchases.getCustomerInfo();
  console.log("🐱 ~ customerInfo?.entitlements", customerInfo?.entitlements)
  return customerInfo?.entitlements.active["Kudoo Premium"] !== undefined;
}


export async function getProducts() {
  const offerings = await Purchases.getOfferings();
  const product = offerings?.current?.availablePackages[0];
  return product;
}


export async function purchasePlan(plan: "weekly" | "annual") {
  try {
    const offerings = await Purchases.getOfferings();
    const packages = offerings.current?.availablePackages ?? [];
    const packageIdentifier =
      plan === "weekly" ? "$rc_weekly" : "$rc_annual";

    const selectedPackage = packages.find(
      (pkg) => pkg.identifier === packageIdentifier
    );

    if (!selectedPackage) {
      console.log("Package not found:", packageIdentifier);
      return false;
    }

    const { customerInfo } = await Purchases.purchasePackage(selectedPackage);

    return customerInfo;
  } catch (e: any) {
    if (!e.userCancelled) {
      console.log("Purchase error:", e);
    }

    return false;
  }
}

