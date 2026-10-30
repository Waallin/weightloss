import AsyncStorage from "@react-native-async-storage/async-storage";
import * as StoreReview from "expo-store-review";
import { analyticsEvents } from "../constants/analytics";
import { trackMixpanelEvent } from "./mixpanel";

const LAST_ASKED_KEY = "storeReview:lastAskedAt";
const ASK_COUNT_KEY = "storeReview:askCount";
const MEAL_COUNT_KEY = "storeReview:mealLogCount";
// Första loggen får vara i fred (FirstDayGuide), vi frågar från den andra.
const MIN_MEALS_BEFORE_ASK = 2;
const MIN_DAYS_BETWEEN_ASKS = 60;
// Apple visar prompten högst 3 gånger per 365 dagar, så sluta själva efter 3.
const MAX_ASKS = 3;
const DAY_MS = 24 * 60 * 60 * 1000;

export type StoreReviewTrigger = "meal_logged" | "steps_goal";

/**
 * Ber om App Store-recension efter ett positivt ögonblick. Säker att anropa
 * upprepat: den frågar bara om vi inte frågat nyligen och Apple tillåter det.
 * Dröjer lite så att toast, konfetti och navigering hinner landa först.
 */
export const maybeAskForStoreReview = async (trigger: StoreReviewTrigger, delayMs = 1500) => {
  try {
    if (trigger === "meal_logged") {
      const mealCount = (Number(await AsyncStorage.getItem(MEAL_COUNT_KEY)) || 0) + 1;
      await AsyncStorage.setItem(MEAL_COUNT_KEY, String(mealCount));
      if (mealCount < MIN_MEALS_BEFORE_ASK) return;
    }

    const [lastAskedRaw, countRaw] = await Promise.all([
      AsyncStorage.getItem(LAST_ASKED_KEY),
      AsyncStorage.getItem(ASK_COUNT_KEY),
    ]);
    const lastAskedAt = Number(lastAskedRaw) || 0;
    const askCount = Number(countRaw) || 0;

    if (askCount >= MAX_ASKS) return;
    if (lastAskedAt && Date.now() - lastAskedAt < MIN_DAYS_BETWEEN_ASKS * DAY_MS) return;
    if (!(await StoreReview.isAvailableAsync())) return;

    // Markera direkt så att två snabba triggers inte ger dubbla frågor.
    await Promise.all([
      AsyncStorage.setItem(LAST_ASKED_KEY, String(Date.now())),
      AsyncStorage.setItem(ASK_COUNT_KEY, String(askCount + 1)),
    ]);

    setTimeout(() => {
      void StoreReview.requestReview().catch((error) =>
        console.log("Error requesting store review:", error),
      );
    }, delayMs);
    void trackMixpanelEvent(analyticsEvents.storeReviewRequested, { trigger, ask_count: askCount + 1 });
  } catch (error) {
    console.log("Error in maybeAskForStoreReview:", error);
  }
};
