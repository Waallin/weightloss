import { Platform } from "react-native";
import Purchases, { LOG_LEVEL, type CustomerInfo } from "react-native-purchases";

export async function initRevenueCat() {

  // Sätt önskad loggnivå för RevenueCat här
  await Purchases.setLogLevel(LOG_LEVEL.ERROR);

  if (Platform.OS === 'ios') {
    Purchases.configure({
      apiKey: process.env.EXPO_PUBLIC_RC_API_KEY,
    });
  }
}

export async function isCustomerPremium() {
  const customerInfo = await Purchases.getCustomerInfo();
  return customerInfo?.entitlements.active["Kudoo Premium"] !== undefined;
}


export async function identifyRevenueCatUser(userId: string) {
  try {
    await Purchases.logIn(userId);
  } catch (e: any) {
    console.log("RevenueCat logIn error:", e);
  }
}


export async function getProducts() {
  const offerings = await Purchases.getOfferings();
  const weeklyProduct = offerings.current?.availablePackages.find(pkg => pkg.identifier === "$rc_weekly");
  const annualProduct = offerings.current?.availablePackages.find(pkg => pkg.identifier === "$rc_annual");
  const monthlyProduct = offerings.current?.availablePackages.find(pkg => pkg.identifier === "$rc_monthly");
  return { weekly: weeklyProduct, annual: annualProduct, monthly: monthlyProduct };
}


// true = eligible, false = ineligible or unknown (RevenueCat recommends showing non-intro pricing when unknown)
export async function checkTrialEligibility(productIdentifier: string) {
  try {
    const result = await Purchases.checkTrialOrIntroductoryPriceEligibility([productIdentifier]);
    return (
      result[productIdentifier]?.status ===
      Purchases.INTRO_ELIGIBILITY_STATUS.INTRO_ELIGIBILITY_STATUS_ELIGIBLE
    );
  } catch (e: any) {
    console.log("Trial eligibility error:", e);
    return false;
  }
}


export type PurchaseResult =
  | { status: "success"; customerInfo: CustomerInfo; isTrial: boolean; productId?: string; offeringId?: string; packageId?: string }
  | { status: "cancelled"; productId?: string; offeringId?: string; packageId?: string }
  | { status: "error"; errorCode: string; errorMessage: string; productId?: string; offeringId?: string; packageId?: string };

export async function purchasePlan(plan: "weekly" | "annual" | "monthly"): Promise<PurchaseResult> {
  const packageIdentifier =
    plan === "weekly" ? "$rc_weekly" : plan === "annual" ? "$rc_annual" : "$rc_monthly";
  let ids: { productId?: string; offeringId?: string; packageId?: string } = { packageId: packageIdentifier };

  try {
    const offerings = await Purchases.getOfferings();
    const packages = offerings.current?.availablePackages ?? [];
    const selectedPackage = packages.find((pkg) => pkg.identifier === packageIdentifier);
    ids = { ...ids, offeringId: offerings.current?.identifier };

    if (!selectedPackage) {
      console.log("Package not found:", packageIdentifier);
      return {
        status: "error",
        errorCode: "PACKAGE_NOT_FOUND",
        errorMessage: `Package ${packageIdentifier} not found in offering ${offerings.current?.identifier ?? "none"}`,
        ...ids,
      };
    }
    ids = { ...ids, productId: selectedPackage.product.identifier };

    const { customerInfo, productIdentifier } = await Purchases.purchasePackage(selectedPackage);
    if (customerInfo.entitlements.active["Kudoo Premium"] === undefined) {
      return {
        status: "error",
        errorCode: "ENTITLEMENT_NOT_ACTIVE",
        errorMessage: "Purchase completed but entitlement is not active",
        ...ids,
      };
    }
    const isTrial = customerInfo.entitlements.active["Kudoo Premium"].periodType === "TRIAL";
    return { status: "success", customerInfo, isTrial, ...ids, productId: productIdentifier ?? ids.productId };
  } catch (e: any) {
    if (e?.userCancelled) {
      return { status: "cancelled", ...ids };
    }
    console.log("Purchase error:", e);
    return {
      status: "error",
      errorCode: String(e?.code ?? e?.readableErrorCode ?? "UNKNOWN"),
      errorMessage: String(e?.message ?? e),
      ...ids,
    };
  }
}


export async function restorePurchases() {
  try {
   const res =  await Purchases.restorePurchases();
     
   if (res.entitlements.active["Kudoo Premium"]) {
    return true;
   } else {
    return false;
   }
  } catch (e: any) {
    if (!e.userCancelled) {
      console.log("Restore purchases error:", e);
    }

    return false;
  }
}

export async function getRevenueCatCustomerInfo() {
  const customerInfo = await Purchases.getCustomerInfo();
  return customerInfo;
}