import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { colors } from "../constants/colors";
import { spacing } from "../constants/spacing";
import { typography } from "../constants/texts";

const PrimaryButtonComponent = ({
  title,
  onPress,
  color,
  backgroundColor,
  loading,
}: {
  title: string;
  onPress: () => void;
  color?: string;
  backgroundColor?: string;
  loading?: boolean;
  }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={{
        backgroundColor: backgroundColor || colors.ui.primary,
        paddingVertical: spacing.md,
        borderRadius: spacing.borderRadius,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.ui.white} />
      ) : (
        <Text
          style={{
            ...typography.button,
            color: "#F4F4F4",
          }}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default PrimaryButtonComponent;

const styles = StyleSheet.create({});
