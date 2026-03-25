import { createNavigationContainerRef } from "@react-navigation/native";

// Skapa en navigation ref för globalt bruk
export const navigationRef = createNavigationContainerRef();

/**
 * Global navigeringsfunktion.
 * 
 * Använd: navigation("DietListScreen")
 */
export function navigation(screenName: string, params?: object) {
    if (navigationRef.isReady()) {
        // params är valfri, så vi skickar bara med om det finns
        navigationRef.navigate(screenName as never, params as never);
    }
}