import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { globalStyles } from "../../../../constants/globalStyles";
import { DocumentItemType } from "../types";
import { spacing } from "../../../../constants/spacing";
import { colors } from "../../../../constants/colors";

const DocumentInformationItem = ({
  title,
  value,
}: {
  title: string;
  value: string;
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        justifyContent: "space-between",
        padding: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.ui.lightGrey,
      }}
    >
      <Text style={{ ...globalStyles.smallText }}>{title}</Text>
      <Text style={{ ...globalStyles.xSmallText, fontWeight: "bold" }}>
        {value}
      </Text>
    </View>
  );
};

export default DocumentInformationItem;

const styles = StyleSheet.create({});
