// Beslutslogik för den hårda paywallen. Ren funktion utan React/RevenueCat-beroenden så att den går att testa.
//
// Styrs från Firestore-dokumentet config/app:
//   hardPaywall: true                         slår på paywallen (av om fältet saknas)
//   hardPaywallGrandfatherBefore: "2026-11-10" konton skapade före detta datum slipper paywallen
// Båda fälten saknas som standard, så appen är gratis tills du slår på det.

export type PaywallPlacement =
  | "after_first_scan"
  | "after_skip"
  | "app_open"
  | "expired"
  | "unknown";

export type PaywallGate = "allow" | "paywall" | "unknown";

export interface PaywallGateInput {
  config: any;
  user: any;
  isPremium: boolean;
  // false så länge vi inte har kunnat läsa prenumerationsstatus från RevenueCat
  premiumLoaded: boolean;
}

export function isHardPaywallEnabled(config: any): boolean {
  const flag = config?.hardPaywall;
  return flag === true || flag === "true" || flag === "on";
}

// Firestore Timestamp, Date, millisekunder eller ISO-sträng. null om värdet inte går att tolka
// (t.ex. ett serverTimestamp som ännu inte skrivits). Då räknas kontot som nytt.
export function toMillis(value: any): number | null {
  if (value == null) return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (value instanceof Date) {
    const ms = value.getTime();
    return Number.isFinite(ms) ? ms : null;
  }
  if (typeof value === "string") {
    const ms = Date.parse(value);
    return Number.isFinite(ms) ? ms : null;
  }
  if (typeof value.toMillis === "function") {
    try {
      const ms = value.toMillis();
      return Number.isFinite(ms) ? ms : null;
    } catch {
      return null;
    }
  }
  if (typeof value.seconds === "number") return value.seconds * 1000;
  return null;
}

export function isGrandfathered(user: any, config: any): boolean {
  const cutoff = toMillis(config?.hardPaywallGrandfatherBefore);
  if (cutoff == null) return false; // inget datum satt: ingen slipper undan
  const created = toMillis(user?.createdAt);
  if (created == null) return false; // okänt skapandedatum: räkna som nytt konto
  return created < cutoff;
}

export function getPaywallGate(input: PaywallGateInput): PaywallGate {
  const { config, user, isPremium, premiumLoaded } = input;
  if (!isHardPaywallEnabled(config)) return "allow";
  if (isPremium) return "allow";
  if (isGrandfathered(user, config)) return "allow";
  if (!premiumLoaded) return "unknown";
  return "paywall";
}
