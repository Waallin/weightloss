import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { TripItem } from "../types";
import { globalStyles } from "../../../../constants/globalStyles";
import { colors } from "../../../../constants/colors";
import { spacing } from "../../../../constants/spacing";

const RecentTripItem = ({ trip }: { trip: TripItem }) => {
  return (
    <View
      style={{
        borderBottomWidth: 1,
        borderBottomColor: colors.ui.lightGrey,
        paddingBottom: spacing.md,
      }}
    >
      <Text style={{ ...globalStyles.smallText }}>{trip.start}</Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: spacing.xs,
        }}
      >
        <Text style={{ ...globalStyles.smallText, fontWeight: "bold" }}>
          {trip.from} - {trip.to}
        </Text>
      </View>
      <View style={{ flexDirection: "row", marginTop: spacing.md }}>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={{ ...globalStyles.smallText, fontWeight: "bold" }}>
            {trip.distance}
          </Text>
          <Text style={{ ...globalStyles.smallText }}>Miles</Text>
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={{ ...globalStyles.smallText, fontWeight: "bold" }}>
            {trip.time}h
          </Text>
          <Text style={{ ...globalStyles.smallText }}>Duration</Text>
        </View>
      </View>
    </View>
  );
};

export default RecentTripItem;

const styles = StyleSheet.create({});
