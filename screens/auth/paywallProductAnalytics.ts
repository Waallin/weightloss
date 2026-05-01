export type PaywallPlan = "weekly" | "annual";

export type PaywallOfferPackage = {
  identifier: string;
  product: {
    identifier?: string;
    price?: number;
    priceString?: string;
    currencyCode?: string;
    subscriptionPeriod?: {
      unit?: string;
      value?: number;
    } | null;
  };
};

export type PaywallOfferProducts = {
  weekly?: PaywallOfferPackage | null;
  annual?: PaywallOfferPackage | null;
} | null;

export type PaywallProductAnalytics = {
  price?: number;
  priceString?: string;
  currencyCode?: string;
  productIdentifier?: string;
  packageIdentifier?: string;
};

const PACKAGE_IDS: Record<PaywallPlan, string> = {
  weekly: "$rc_weekly",
  annual: "$rc_annual",
};

export function getPaywallProductAnalytics(
  products: PaywallOfferProducts,
  plan: PaywallPlan,
): PaywallProductAnalytics {
  const pkg = plan === "annual" ? products?.annual : products?.weekly;
  if (!pkg) {
    return { packageIdentifier: PACKAGE_IDS[plan] };
  }
  const p = pkg.product;
  return {
    price: p?.price,
    priceString: p?.priceString,
    currencyCode: p?.currencyCode,
    productIdentifier: p?.identifier,
    packageIdentifier: pkg.identifier ?? PACKAGE_IDS[plan],
  };
}
