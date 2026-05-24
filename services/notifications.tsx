import * as Notifications from "expo-notifications";
const ACTIVE_NOTIFICATION_DAYS = 3;

const dailyNotifications = [
  {
    hour: 7,
    minute: 0,
    title: "Start with water 💧",
    body: 'One glass is an easy first win today.',
  },
  {
    hour: 12,
    minute: 0,
    title: "Lunch walk? 🚶",
    body: 'A short walk helps you get closer to 5k',
  },
  {
    hour: 20,
    minute: 0,
    title: "Finish strong 💪",
    body: 'Check your points and mark today as done.',
  }
]

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

export async function scheduleActiveUserNotifications() {

  const now = new Date();

 // Cancel all old active-window notifications
 const scheduled = await Notifications.getAllScheduledNotificationsAsync();

  for (const notification of scheduled) {
    if (notification.content.data?.group === "daily_notifications") {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  }

  for (let day = 0; day < ACTIVE_NOTIFICATION_DAYS; day++) {

    for (const item of dailyNotifications) {
      const triggerDate = new Date(now);
      triggerDate.setDate(now.getDate() + day);
      triggerDate.setHours(item.hour, item.minute, 0, 0);

      if (triggerDate <= now) continue;
      await Notifications.scheduleNotificationAsync({
        content: {
          title: item.title,
          body: item.body,
          data: { group: "daily_notifications" },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: triggerDate,
        },
      });
    }
  }
}

export const handleReminderNotification = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Your trial is still free",
      body: "Try Kudoo today and see how simple staying on track can feel.",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 24 * 60 * 60,
      repeats: false,
    },
  });
};