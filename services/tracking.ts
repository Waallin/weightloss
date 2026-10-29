import { Platform } from "react-native";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TikTokEventName } from "react-native-tiktok-business-sdk";
import { analyticsEvents } from "../constants/analytics";
import {
  incrementMixpanelPeople,
  registerMixpanelSuperProperties,
  setMixpanelPeopleOnce,
  setMixpanelPeopleProperties,
  trackMixpanelEvent,
} from "./mixpanel";
import { identifyTikTokUser, logTikTokCustomEvent, logTikTokEvent } from "./tiktoksdk";
import { logMetaEvent } from "./metasdk";
import { updateDocument } from "./firebase";
import useUserStore from "../stores/useUserStore";

/**
 * Byt när flödet ändras stort, så går före/efter att jämföra med en fråga.
 * Se docs/tracking-plan.md.
 */
export const FLOW_VERSION = "onb_v3_free_anon";

const toMillis = (value: any): number | null => {
  if (!value) return null;
  if (typeof value.toMillis === "function") return value.toMillis();
  if (typeof value.seconds === "number") return value.seconds * 1000;
  const ms = new Date(value).getTime();
  return Number.isNaN(ms) ? null : ms;
};

const deviceRegion = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().locale.split("-").pop() ?? "unknown";
  } catch {
    return "unknown";
  }
};

export const accountType = (user: any) =>
  user?.isAnonymous === true ? "anonymous" : "apple";

/** Egenskaper som följer med varje event. Anropas efter inloggning, vid appstart och efter kopplad Apple. */
export const refreshSuperProperties = async (user: any) => {
  const createdMs = toMillis(user?.createdAt);
  const daysSinceSignup =
    createdMs != null ? Math.floor((Date.now() - createdMs) / 86_400_000) : undefined;
  await registerMixpanelSuperProperties({
    platform: Platform.OS,
    app_version: Constants.expoConfig?.version ?? "",
    flow_version: FLOW_VERSION,
    account_type: accountType(user),
    device_region: deviceRegion(),
    is_internal: __DEV__,
    ...(createdMs != null
      ? {
          signup_date: new Date(createdMs).toISOString().slice(0, 10),
          days_since_signup: daysSinceSignup,
        }
      : {}),
  });
};

/** Grupper i stället för rå hälsodata. */
export const goalFromWeights = (startKg: number, goalKg: number) => {
  const diff = goalKg - startKg;
  const goal_type = Math.abs(diff) < 1 ? "maintain" : diff < 0 ? "lose" : "gain";
  const abs = Math.abs(diff);
  const weight_goal_band = abs < 1 ? "none" : abs < 5 ? "1-5" : abs < 10 ? "5-10" : abs < 20 ? "10-20" : "20+";
  return { goal_type, weight_goal_band };
};

/**
 * Milstolpar skickas till Mixpanel, TikTok och Meta från samma ställe så att de inte glider isär.
 * Ändra mappningen här efter att du har kollat vad Events Manager kan optimera mot.
 */
type Milestone = "first_meal_logged" | "returned_after_signup" | "account_linked";

const milestoneToAds: Record<Milestone, (eventId: string) => Promise<void>> = {
  first_meal_logged: async (id) => {
    await logTikTokEvent(TikTokEventName.COMPLETE_TUTORIAL, id);
    await logMetaEvent("CompleteTutorial", { fb_success: 1 });
  },
  returned_after_signup: async (id) => {
    await logTikTokEvent(TikTokEventName.ACHIEVE_LEVEL, id);
  },
  account_linked: async (id) => {
    await logTikTokCustomEvent("AccountLinked", { event_id: id });
  },
};

export const trackMilestone = async (
  milestone: Milestone,
  properties?: Record<string, any>,
  userId?: string,
) => {
  const id = `${userId ?? "anon"}_${milestone}`;
  const names: Record<Milestone, string> = {
    first_meal_logged: analyticsEvents.firstMealLogged,
    returned_after_signup: analyticsEvents.returnedAfterSignup,
    account_linked: analyticsEvents.accountLinked,
  };
  await trackMixpanelEvent(names[milestone], properties);
  try {
    await milestoneToAds[milestone](id);
  } catch (error) {
    console.log("Error sending milestone to ad platforms:", error);
  }
};

/** Kopplar användaren till annonsplattformarna. E-post skickas först efter Apple-koppling. */
export const identifyAdPlatforms = async (userId: string, email?: string) => {
  await identifyTikTokUser(userId, "", "", email ?? "");
};

export type MealMethod = "scan" | "manual" | "recipe" | "food";

/** Ett event för all matloggning. Första måltiden skickar också en milstolpe. */
export const trackMealLogged = async (params: {
  method: MealMethod;
  points: number;
  slot?: string;
  title?: string;
}) => {
  const { user, setUser } = useUserStore.getState();
  const isFirst = !!user && user.firstMealAt == null && user.isAnonymous !== undefined;

  await trackMixpanelEvent(analyticsEvents.mealLogged, {
    method: params.method,
    points: params.points,
    meal_slot: params.slot,
    is_first_meal: isFirst,
  });
  incrementMixpanelPeople("meals_logged_total");

  if (!isFirst) return;
  const createdMs = toMillis(user.createdAt);
  const firstMealAt = new Date();
  setUser({ ...user, firstMealAt });
  updateDocument("users", user.email, { firstMealAt }).catch(() => {});
  setMixpanelPeopleOnce({ first_meal_at: firstMealAt.toISOString(), first_meal_method: params.method });
  await trackMilestone(
    "first_meal_logged",
    {
      method: params.method,
      hours_since_signup:
        createdMs != null ? Math.round((Date.now() - createdMs) / 3_600_000) : undefined,
    },
    user.email,
  );
};

const STEPS_DETECTED_KEY = "steps_first_detected";

export const trackStepsFirstDetected = async () => {
  if ((await AsyncStorage.getItem(STEPS_DETECTED_KEY)) === "true") return;
  await AsyncStorage.setItem(STEPS_DETECTED_KEY, "true");
  trackMixpanelEvent(analyticsEvents.stepsFirstDetected);
  setMixpanelPeopleProperties({ steps_connected: true });
};

const RETURNED_KEY = "returned_after_signup_sent";

/** Skickas en gång: första gången appen öppnas en senare kalenderdag än registreringsdagen. */
export const trackReturnIfNeeded = async (user: any) => {
  const createdMs = toMillis(user?.createdAt);
  if (createdMs == null || user?.isAnonymous === undefined) return;
  const days = Math.floor((Date.now() - createdMs) / 86_400_000);
  const sameDay = new Date(createdMs).toDateString() === new Date().toDateString();
  if (sameDay || (await AsyncStorage.getItem(RETURNED_KEY)) === "true") return;
  await AsyncStorage.setItem(RETURNED_KEY, "true");
  await trackMilestone("returned_after_signup", { days_since_signup: days }, user.email);
};
