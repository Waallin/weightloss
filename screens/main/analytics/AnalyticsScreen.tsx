import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { globalStyles } from "../../../constants/globalStyles";
import { spacing } from "../../../constants/spacing";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { colors } from "../../../constants/colors";
import KeyIndicatiorItem from "./components/KeyIndicatiorItem";
import { KeyIndicatorType, CostBreakdownType } from "../analytics/types";
import CostBreakdownItem from "../analytics/components/CostBreakdownItem";

const dummyKeyIndicators = [
  {
    title: "Total Trips",
    value: "103",
    color: "#33C45A",
    info: "Avg: 1.2 trips/day",
    icon: <FontAwesome name="plane" size={20} color="#33C45A" />,
  },
  {
    title: "Fuel Used",
    value: "2,450L",
    color: "#FF9500",
    info: "Avg: 245L/day",
    icon: <FontAwesome name="tint" size={20} color="#FF9500" />,
  },
  {
    title: "Distance",
    value: "1,847km",
    color: "#28537E",
    info: "Avg: 184km/day",
    icon: <FontAwesome name="map" size={20} color="#28537E" />,
  },
  {
    title: "Avg Speed",
    value: "23kt",
    color: "#8957F4",
    info: "Avg: 23kt/day",
    icon: <FontAwesome name="tachometer" size={20} color="#8957F4" />,
  },
];

const dummyCostBreakdown = [
  {
    title: "Fuel",
    value: "€1,200",
    color: "#33C45A",
  },
  {
    title: "Maintenance",
    value: "€1,200",
    color: "#28537E",
  },
  {
    title: "Insurance",
    value: "€1,200",
    color: "#8957F4",
  },
  {
    title: "Other",
    value: "€1,200",
    color: "#FF9500",
  },
  {
    title: "Total Cost",
    value: "€1,200",
    color: colors.ui.darkBlue,
  },
];

const CrewScreen = () => {
  const renderKeyIndicators = () => {
    return (
      <View
        style={{
          ...styles.container,
        }}
      >
        <Text style={{ ...globalStyles.smallText, fontWeight: "bold" }}>
          Key Indicators
        </Text>
        <View style={{ gap: spacing.md }}>
          {dummyKeyIndicators.map((item, index) => (
            <KeyIndicatiorItem key={index} item={item as KeyIndicatorType} />
          ))}
        </View>
      </View>
    );
  };

  const renderCostBreakdown = () => {
    return (
      <View style={{ ...styles.container }}>
        <Text style={{ ...globalStyles.smallText, fontWeight: "bold" }}>
          Cost Breakdown
        </Text>
        <View style={{ gap: spacing.md }}>
          {dummyCostBreakdown.map((item, index) => (
            <CostBreakdownItem key={index} item={item as CostBreakdownType} />
          ))}
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        ...globalStyles.container,
        paddingTop: spacing.md,
        backgroundColor: colors.ui.lightBlueBackground,
        gap: spacing.md,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          gap: spacing.md,
          paddingBottom: spacing.scrollViewBottomPadding,
        }}
      >
        {renderKeyIndicators()}
        {renderCostBreakdown()}
      </ScrollView>
    </View>
  );
};

export default CrewScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.ui.white,
    padding: spacing.md,
    borderRadius: spacing.borderRadius,
    gap: spacing.md,
  },
});
