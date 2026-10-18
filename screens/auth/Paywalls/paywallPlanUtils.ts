const formatLikeStorePrice = (template: string, amount: number) => {
  const match = template.match(/^(\D*)([\d\s.,]+)(\D*)$/);
  if (!match) return null;
  const [, prefix, numeric, suffix] = match;
  const lastComma = numeric.lastIndexOf(",");
  const lastDot = numeric.lastIndexOf(".");
  const decimalIndex = Math.max(lastComma, lastDot);
  const fractionDigits =
    decimalIndex >= 0 ? numeric.length - decimalIndex - 1 : 0;
  const decimalSep = lastComma > lastDot ? "," : ".";
  const fixed = amount.toFixed(fractionDigits);
  const [whole, fraction] = fixed.split(".");
  const formatted =
    fractionDigits > 0 ? `${whole}${decimalSep}${fraction}` : whole;
  return `${prefix}${formatted}${suffix}`;
};

export type SelectablePlan = "monthly" | "weekly";

export const PERIOD_WORD: Record<string, string> = {
  P1W: "week",
  P1M: "month",
  P1Y: "year",
};

// Free trial length in days from the StoreKit intro offer, or null if there is no free trial
export const getFreeTrialDays = (introPrice: any): number | null => {
  if (!introPrice || introPrice.price !== 0) return null;
  const units = introPrice.periodNumberOfUnits ?? 0;
  switch (introPrice.periodUnit) {
    case "DAY":
      return units;
    case "WEEK":
      return units * 7;
    case "MONTH":
      return units * 30;
    case "YEAR":
      return units * 365;
    default:
      return null;
  }
};

export const getComparePrice = (product: any) =>
  typeof product?.price === "number" && product.price > 0 && product.priceString
    ? formatLikeStorePrice(product.priceString, product.price * 2)
    : null;
