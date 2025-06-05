import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { colors } from "../../../../constants/colors";
import { spacing } from "../../../../constants/spacing";
import { Ionicons } from "@expo/vector-icons";
import { MaintanceOptionType } from "../types";
import { globalStyles } from "../../../../constants/globalStyles";

const MaintanceOptionItem = ({
  item,
  onPress,
  selected,
}: {
  item: MaintanceOptionType;
  onPress: () => void;
  selected: boolean;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
        justifyContent: "space-between",
        backgroundColor: selected ? colors.ui.lightBlue : colors.ui.white,
        padding: spacing.md,
        borderRadius: spacing.borderRadius,
        ...globalStyles.cardShadow,
      }}
    >
      <Ionicons name={item.icon as any} size={24} color={colors.ui.darkBlue} />
      <Text style={{ ...globalStyles.smallText, fontWeight: "bold" }}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );
};

export default MaintanceOptionItem;

const styles = StyleSheet.create({});
