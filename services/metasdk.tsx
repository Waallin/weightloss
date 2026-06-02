import { Platform } from "react-native";
import { AppEventsLogger, Settings } from "react-native-fbsdk-next";
import * as TrackingTransparency from "expo-tracking-transparency";

export const initializeMetaTracking = async () => {
  if (Platform.OS === "ios") {
    const { status } = await TrackingTransparency.getTrackingPermissionsAsync();

    let granted = status === "granted";
    if (status === "undetermined") {
      const { status: newStatus } =
        await TrackingTransparency.requestTrackingPermissionsAsync();
      granted = newStatus === "granted";
    }

    await Settings.setAdvertiserTrackingEnabled(granted);
    Settings.setAdvertiserIDCollectionEnabled(granted);
  } else {
    Settings.setAdvertiserIDCollectionEnabled(true);
  }
};

export const logMetaEvent = async (event: string, properties?: any) => {
  AppEventsLogger.logEvent(event, properties);
};