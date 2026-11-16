import { Platform } from "react-native";
import { fetchPremiumStatus, identifyRevenueCatUser } from "./revenuecat";
import usePremiumStore from "../stores/usePremiumStore";

// Väntar högst ms millisekunder; ger null om löftet inte hunnit klart
export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  return Promise.race([
    promise,
    new Promise<null>((resolve) => setTimeout(() => resolve(null), ms)),
  ]);
}

// Läser prenumerationsstatus från RevenueCat till premium-storen. Ett långsamt nät får inte hänga appen.
export async function syncPremium() {
  const status = await withTimeout(fetchPremiumStatus(), 6000);
  if (status !== null) usePremiumStore.getState().setPremium(status);
}

// Kopplar RevenueCat till kontot (Firebase-uid) och uppdaterar status.
// Behövs efter att ett konto skapats eller återställts, så att köp hamnar på rätt användare.
export async function linkRevenueCatToAccount(userId: string) {
  if (Platform.OS !== "ios") return;
  await withTimeout(identifyRevenueCatUser(userId), 4000);
  await syncPremium();
}
