import * as Notifications from "expo-notifications";


export const requestNotificationPermission = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
 
  return status === "granted";
};

export const getNotificationToken = async () => {
  try {
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      throw new Error("Notification permissions saknas");
    }

    const token = await Notifications.getExpoPushTokenAsync();
    return token.data;
  } catch (error) {
    console.error("Fel vid hämtning av notification token:", error);
    throw error;
  }
};

// Konfigurera hur notifications ska hanteras när appen är öppen
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
    severity: "default",
  }),
});
