import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { colors } from "../../../../../constants/colors";
import { spacing } from "../../../../../constants/spacing";
import { globalStyles } from "../../../../../constants/globalStyles";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SmartAlertItem as SmartAlertItemType } from "../types";

const SmartAlertItem = ({ item }: { item: SmartAlertItemType }) => {
  const returnIcon = () => {
    switch (item.icon) {
      case "storm":
        return <Ionicons name="alert-circle" size={24} color={"white"} />;
      case "fuel":
        return <MaterialCommunityIcons name="fuel" size={24} color="white" />;
      default:
        return <Ionicons name="alert-circle" size={24} color={"white"} />;
    }
  };

  return (
    <View
      style={{
        backgroundColor: colors.ui.lightBlueBackground,
        padding: spacing.md,
        borderRadius: spacing.borderRadius,
        borderLeftWidth: 3,
        borderLeftColor: item.color,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            backgroundColor: item.color,
            padding: spacing.sm,
            borderRadius: spacing.borderRadius,
          }}
        >
          {returnIcon()}
        </View>
        <View
          style={{
            flex: 1,
            gap: spacing.xs,
            marginLeft: spacing.sm,
          }}
        >
          <Text style={{ ...globalStyles.smallText, fontWeight: "bold" }}>
            {item.title}
          </Text>
          <Text style={{ ...globalStyles.smallText, color: colors.ui.grey }}>
            {item.timestamp}
          </Text>
        </View>
        <View>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="close" size={24} color={colors.ui.darkGrey} />
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <Text
          style={{
            ...globalStyles.smallText,
            marginTop: spacing.sm,
          }}
        >
          {item.description}
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          marginTop: spacing.sm,
          justifyContent: "flex-end",
          alignItems: "flex-start",
        }}
      >
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.ui.lightBlue,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            borderRadius: spacing.borderRadius,
            marginTop: spacing.sm,
          }}
          onPress={() => {
            console.log("item", item);
          }}
        >
          <Text
            style={{
              ...globalStyles.smallText,
              color: colors.text.link,
              fontWeight: "400",
            }}
          >
            View Details
          </Text>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={colors.text.link}
            style={{ marginLeft: spacing.xs }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SmartAlertItem;

const styles = StyleSheet.create({});
