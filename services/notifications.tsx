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

export async function scheduleDailyNotifications() {
  console.log("Schedule daily push notification");
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Start with water 💧",
      body: 'One glass is an easy first win today.',
      data: { type: "dashboard" },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      hour: 8,
      minute: 0,
      repeats: true,
    },
  });

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Lunch walk? 🚶",
      body: 'A short walk helps you closer to 10k',
      data: { type: "dashboard" },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      hour: 12,
      minute: 0,
      repeats: true,
    },
  });
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Finish strong 💪",
      body: 'Check your points and mark today as done.',
      data: { type: "dashboard" },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      hour: 20,
      minute: 0,
      repeats: true,
    },
  });
}
