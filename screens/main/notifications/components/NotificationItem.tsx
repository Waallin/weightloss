import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NotificationItemType } from "../types";
import { colors } from "../../../../constants/colors";
import { spacing } from "../../../../constants/spacing";
import { globalStyles } from "../../../../constants/globalStyles";
import { FontAwesome } from "@expo/vector-icons";

const NotificationItem = ({
  notification,
}: {
  notification: NotificationItemType;
}) => {
  const renderIcon = () => {
    switch (notification.type) {
      case "weather":
        return (
          <View
            style={{
              borderRadius: spacing.borderRadius,
              backgroundColor: colors.notificationColor.weather,
              padding: spacing.sm,
              ...globalStyles.cardShadow,
            }}
          >
            <FontAwesome name="cloud" size={24} color="white" />
          </View>
        );
      case "maintenance":
        return (
          <View
            style={{
              borderRadius: spacing.borderRadius,
              backgroundColor: colors.notificationColor.maintenance,
              padding: spacing.sm,
              ...globalStyles.cardShadow,
            }}
          >
            <FontAwesome name="wrench" size={24} color="white" />
          </View>
        );
      default:
        return (
          <View
            style={{
              borderRadius: spacing.borderRadius,
              backgroundColor: colors.notificationColor.default,
              padding: spacing.sm,
              ...globalStyles.cardShadow,
            }}
          >
            <FontAwesome name="info" size={24} color="white" />
          </View>
        );
    }
  };
  return (
    <View
      style={{
        backgroundColor: colors.ui.white,
        padding: spacing.md,
        borderRadius: spacing.borderRadius,
        ...globalStyles.cardShadow,
      }}
    >
      {!notification.read && (
        <View
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            width: 10,
            height: 10,
            backgroundColor: "red",
            borderRadius: spacing.rounded,
          }}
        />
      )}
      <View
        style={{ flexDirection: "row", gap: spacing.md, alignItems: "center" }}
      >
        {renderIcon()}
        <View style={{ gap: spacing.sm }}>
          <Text style={{ ...globalStyles.smallText, fontWeight: "bold" }}>
            {notification.type}
          </Text>
          <Text
            style={{
              ...globalStyles.xSmallText,
              color: colors.ui.grey,
              flexWrap: "wrap",
              width: "60%",
            }}
          >
            {notification.description}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default NotificationItem;

const styles = StyleSheet.create({});
