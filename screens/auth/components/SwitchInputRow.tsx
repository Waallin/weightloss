import { StyleSheet, Text, View, Switch } from "react-native";
import React from "react";
import { colors } from "../../../constants/colors";
import { globalStyles } from "../../../constants/globalStyles";
import { spacing } from "../../../constants/spacing";

interface SwitchInputRowProps {
  title: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

const SwitchInputRow = ({ title, value, onChange }: SwitchInputRowProps) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: spacing.md,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.ui.lightGrey,
      }}
    >
      <Text
        style={{
          ...globalStyles.subTitle,
          color: colors.text.secondary,
          fontWeight: "bold",
        }}
      >
        {title}
      </Text>
      <Switch
        trackColor={{
          true: colors.ui.darkBlue,
          false: colors.ui.lightGrey,
        }}
        value={value}
        onValueChange={onChange}
      />
    </View>
  );
};

export default SwitchInputRow;

const styles = StyleSheet.create({});
