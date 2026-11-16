import AsyncStorage from "@react-native-async-storage/async-storage";
import type { NavigationProp, ParamListBase } from "@react-navigation/native";
import { trackMixpanelEvent } from "./mixpanel";
import { analyticsEvents } from "../constants/analytics";
import useConfigStore from "../stores/useConfigStore";
import usePremiumStore from "../stores/usePremiumStore";
import useUserStore from "../stores/useUserStore";
import { getPaywallGate, type PaywallPlacement } from "./paywallGate";
import { resetToPaywall, resetToProfileRest } from "./paywallNavigation";

export const FIRST_DAY_GUIDE_STEP_KEY = "first_day_guide_step";

type Nav = Pick<NavigationProp<ParamListBase>, "reset" | "getState"> & { replace: (name: string) => void };

// Slutet på onboardingen. Är den hårda paywallen på och användaren inte premium kommer paywallen här.
export async function finishFirstDayGuide(navigation: Nav, placement: PaywallPlacement) {
  trackMixpanelEvent(analyticsEvents.firstDayGuideCompleted, { placement });
  await AsyncStorage.setItem(FIRST_DAY_GUIDE_STEP_KEY, "done");
  const premium = usePremiumStore.getState();
  const gate = getPaywallGate({
    config: useConfigStore.getState().config,
    user: useUserStore.getState().user,
    isPremium: premium.isPremium,
    premiumLoaded: premium.loaded,
  });
  if (gate !== "allow") {
    // "unknown" (status kunde inte läsas) hamnar också här: paywallen har Restore och Try again
    resetToPaywall(navigation, placement);
    return;
  }
  // Nya konton har bara svarat på åldern; resten av profilen tas innan hemskärmen
  if (useUserStore.getState().user?.profilePending) {
    resetToProfileRest(navigation);
    return;
  }
  navigation.replace("MainNavigator");
}
