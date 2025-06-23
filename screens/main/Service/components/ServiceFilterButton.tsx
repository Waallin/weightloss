import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { MaintanceFilterButtonType } from "../types";
import { colors } from "../../../../constants/colors";
import { spacing } from "../../../../constants/spacing";
import { globalStyles } from "../../../../constants/globalStyles";
import * as Haptics from "expo-haptics";

const ServiceFilterButton = ({
  item,
  onPress,
  selectedFilter,
}: {
  item: MaintanceFilterButtonType;
  onPress: () => void;
  selectedFilter: string;
}) => {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      style={{
        backgroundColor:
          selectedFilter === item.title
            ? colors.ui.darkBlue
            : colors.ui.lightBlue,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: spacing.borderRadius,
      }}
    >
      <Text
        style={{
          ...globalStyles.xSmallText,
          color:
            selectedFilter === item.title
              ? colors.ui.white
              : colors.ui.darkBlue,
        }}
      >
        {item.title}
      </Text>
    </TouchableOpacity>
  );
};

export default ServiceFilterButton;

const styles = StyleSheet.create({});
