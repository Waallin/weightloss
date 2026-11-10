import { Platform } from "react-native";
import { fetchPremiumStatus, identifyRevenueCatUser } from "./revenuecat";
import usePremiumStore from "../stores/usePremiumStore";

// Läser prenumerationsstatus från RevenueCat till premium-storen. Ett långsamt nät får inte hänga appen.
export async function syncPremium() {
  const status = await Promise.race([
    fetchPremiumStatus(),
    new Promise<null>((resolve) => setTimeout(() => resolve(null), 6000)),
  ]);
  if (status !== null) usePremiumStore.getState().setPremium(status);
}

// Kopplar RevenueCat till kontot (Firebase-uid) och uppdaterar status.
// Behövs efter att ett konto skapats eller återställts, så att köp hamnar på rätt användare.
export async function linkRevenueCatToAccount(userId: string) {
  if (Platform.OS !== "ios") return;
  await identifyRevenueCatUser(userId);
  await syncPremium();
}
