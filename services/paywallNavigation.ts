import type { NavigationProp, ParamListBase } from "@react-navigation/native";
import type { PaywallPlacement } from "./paywallGate";

type ResettableNavigation = Pick<NavigationProp<ParamListBase>, "reset" | "getState">;

// Appen har två rotnavigatorer: AuthNavigator (nya användare, MainStack ligger som en route)
// och MainStack direkt (inloggade). Samma logik som den gamla resetToApp.
function resetTo(navigation: ResettableNavigation, name: string, params?: object) {
  const routeNames = navigation.getState()?.routeNames ?? [];
  const route = { name, ...(params ? { params } : {}) };

  if (routeNames.includes("MainStack")) {
    navigation.reset({
      index: 0,
      routes: [{ name: "MainStack", state: { routes: [route] } }],
    });
    return;
  }

  navigation.reset({ index: 0, routes: [route] });
}

export function resetToPaywall(navigation: ResettableNavigation, placement: PaywallPlacement) {
  resetTo(navigation, "Paywall", { placement });
}

export function resetToMain(navigation: ResettableNavigation) {
  resetTo(navigation, "MainNavigator");
}
