export type NotificationItemType = {
  id: number;
  title: string;
  description: string;
  type: "weather" | "maintenance";
  read: boolean;
};
