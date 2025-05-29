import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { colors } from "../../../../constants/colors";
import { spacing } from "../../../../constants/spacing";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { globalStyles } from "../../../../constants/globalStyles";
import SmartAlertItem from "./components/SmartAlertItem";

const dummyData = [
  {
    title: "Storm Warning",
    description:
      "A storm is approaching the area. Please be aware of the weather conditions.",
    icon: "storm",
    color: "red",
    severity: "high",
    timestamp: "19m ago",
    location: "New York, NY",
  },
  {
    title: "Low fuel alert",
    description: "Your fuel level is low. Please refuel your vehicle.",
    icon: "fuel",
    color: "#FF9500",
    severity: "medium",
    timestamp: "1h ago",
    location: "Los Angeles, CA",
  },
];

const SmartAlert = () => {
  return (
    <View
      style={{
        backgroundColor: colors.ui.white,
        padding: spacing.md,
        borderRadius: spacing.borderRadius,
        gap: spacing.md,
      }}
    >
      {dummyData.map((item, index) => (
        <SmartAlertItem key={index} item={item} />
      ))}
    </View>
  );
};

export default SmartAlert;

const styles = StyleSheet.create({});
