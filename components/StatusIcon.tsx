import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { colors } from "../constants/colors";

const StatusIcon = ({ status }: { status: string }) => {
  return (
    <View
      style={{
        backgroundColor:
          status === "Upcoming"
            ? colors.status.warning
            : status === "In Progress"
            ? colors.status.info
            : colors.status.success,
        width: 10,
        height: 10,
        borderRadius: 10,
      }}
    />
  );
};

export default StatusIcon;

const styles = StyleSheet.create({});
