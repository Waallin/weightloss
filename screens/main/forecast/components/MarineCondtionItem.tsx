import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { MarineConditionItem } from "../types";
import { colors } from "../../../../constants/colors";
import { Feather } from "@expo/vector-icons";
import { spacing } from "../../../../constants/spacing";

const MarineCondtionItem = ({ item }: { item: MarineConditionItem }) => {
  return (
    <View
      style={{
        backgroundColor: colors.ui.lightBlueBackground,
        width: "46%",
        borderRadius: spacing.borderRadius,
        padding: spacing.md,
        gap: spacing.sm,
      }}
    >
      <Feather name={item.icon} size={20} color={colors.ui.darkBlue} />
      <Text style={{ color: colors.ui.darkBlue }}>{item.text}</Text>
      <Text style={{ color: colors.ui.darkBlue, fontWeight: "bold" }}>
        {item.value}
      </Text>
    </View>
  );
};

export default MarineCondtionItem;

const styles = StyleSheet.create({});
