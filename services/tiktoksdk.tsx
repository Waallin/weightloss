import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import {
  TikTokBusiness,
  TikTokContentEventContentsParameter,
  TikTokContentEventName,
  TikTokContentEventParameter,
  TikTokEventName,
} from "react-native-tiktok-business-sdk";

const TIKTOK_APP_ID = "7648979607294722055";
const TIKTOK_ACCESS_TOKEN = "TT6rsMVV9Xtf1GYB8tQpiqi1pjtIQmR6";

const getAppId = () =>
  Platform.select({
    ios: "6761327514",
    android: "com.devember.kudoo",
    default: "com.devember.kudoo",
  })!;

export const initializeTikTokTracking = async () => {
  try {
    await TikTokBusiness.initializeSdk(
      getAppId(),
      TIKTOK_APP_ID,
      TIKTOK_ACCESS_TOKEN,
      __DEV__
    );
    console.log("TikTok SDK initialized");
  } catch (error) {
    console.log("Error initializing TikTok SDK:", error);
  }
};

export const identifyTikTokUser = async (
  externalId: string,
  externalUserName: string,
  phoneNumber: string,
  email: string
) => {
  try {
    await TikTokBusiness.identify(
      externalId,
      externalUserName,
      phoneNumber,
      email
    );
  } catch (error) {
    console.log("Error identifying TikTok user:", error);
  }
};

export const logTikTokEvent = async (
  event: TikTokEventName,
  eventId?: string,
  properties?: Record<string, string | number | boolean>
) => {
  try {
    await TikTokBusiness.trackEvent(event, eventId, properties);
  } catch (error) {
    console.log("Error tracking TikTok event:", error);
  }
};

export const logTikTokCustomEvent = async (
  eventName: string,
  properties?: Record<string, string | number | boolean>
) => {
  try {
    await TikTokBusiness.trackCustomEvent(eventName, properties ?? {});
  } catch (error) {
    console.log("Error tracking TikTok custom event:", error);
  }
};

/** Betalt köp (inte gratis provperiod) med värde och valuta, så att TikTok kan optimera mot betalande. */
export const logTikTokPurchase = async (params: {
  value?: number;
  currency?: string;
  productId?: string;
}) => {
  if (params.value == null || !params.currency) return;
  try {
    await TikTokBusiness.trackContentEvent(TikTokContentEventName.PURCHASE, {
      [TikTokContentEventParameter.CURRENCY]: params.currency,
      [TikTokContentEventParameter.VALUE]: String(params.value),
      [TikTokContentEventParameter.CONTENT_TYPE]: "product",
      [TikTokContentEventParameter.CONTENTS]: [
        {
          [TikTokContentEventContentsParameter.CONTENT_ID]: params.productId ?? "unknown",
          [TikTokContentEventContentsParameter.PRICE]: params.value,
          [TikTokContentEventContentsParameter.QUANTITY]: 1,
        },
      ],
    });
  } catch (error) {
    console.log("Error tracking TikTok purchase:", error);
  }
};

const CHECKOUT_SENT_KEY = "tiktok_checkout_sent";

/** Användaren nådde betalväggen. Skickas en gång per installation, så att eventet inte blåser upp siffrorna. */
export const logTikTokCheckoutOnce = async (params?: { productId?: string }) => {
  try {
    if ((await AsyncStorage.getItem(CHECKOUT_SENT_KEY)) === "true") return;
    await AsyncStorage.setItem(CHECKOUT_SENT_KEY, "true");
    await TikTokBusiness.trackContentEvent(TikTokContentEventName.CHECK_OUT, {
      [TikTokContentEventParameter.CONTENT_TYPE]: "paywall",
      [TikTokContentEventParameter.DESCRIPTION]: "paywall_viewed",
      ...(params?.productId
        ? { [TikTokContentEventParameter.CONTENT_ID]: params.productId }
        : {}),
    });
  } catch (error) {
    console.log("Error tracking TikTok checkout:", error);
  }
};

export const logoutTikTokUser = async () => {
  try {
    await TikTokBusiness.logout();
  } catch (error) {
    console.log("Error logging out TikTok user:", error);
  }
};
