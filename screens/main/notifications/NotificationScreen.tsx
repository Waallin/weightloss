import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import { colors } from "../../../constants/colors";
import { globalStyles } from "../../../constants/globalStyles";
import { spacing } from "../../../constants/spacing";
import NotificationItem from "./components/NotificationItem";
import { NotificationItemType } from "./types";

const dummyNotifications: NotificationItemType[] = [
  {
    id: 1,
    title: "Notification 1",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
    type: "weather",
    read: false,
  },
  {
    id: 2,
    title: "Notification 2",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
    type: "maintenance",
    read: true,
  },
];
const NotificationScreen = () => {
  return (
    <View style={{ ...globalStyles.container, padding: spacing.md }}>
      <Text style={{ ...globalStyles.bodyText, fontWeight: "bold" }}>
        Notifications
      </Text>
      <View style={{ flex: 1, marginTop: spacing.md }}>
        <FlatList
          data={dummyNotifications}
          contentContainerStyle={{
            gap: spacing.md,
          }}
          renderItem={({ item }) => <NotificationItem notification={item} />}
        />
      </View>
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({});
