import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { InformationItemType } from "../types";
import { spacing } from "../../../../constants/spacing";
import { colors } from "../../../../constants/colors";
import { globalStyles } from "../../../../constants/globalStyles";

const InformationItem = ({ item }: { item: InformationItemType }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.ui.lightGrey,
        backgroundColor: colors.ui.white,
        borderRadius: spacing.borderRadius,
      }}
    >
      <View
        style={{
          backgroundColor: colors.ui.lightBlueBackground,
          padding: spacing.sm,
          borderRadius: spacing.borderRadius,
        }}
      >
        {item.icon}
      </View>
      <View style={{ marginLeft: spacing.sm }}>
        <Text style={{ ...globalStyles.smallText }}>{item.title}</Text>
        <Text style={{ ...globalStyles.smallText, fontWeight: "bold" }}>
          {item.value}
        </Text>
      </View>
    </View>
  );
};

export default InformationItem;

const styles = StyleSheet.create({});
