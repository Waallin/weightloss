import { Platform } from "react-native";
import {
  TikTokBusiness,
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

export const logoutTikTokUser = async () => {
  try {
    await TikTokBusiness.logout();
  } catch (error) {
    console.log("Error logging out TikTok user:", error);
  }
};
