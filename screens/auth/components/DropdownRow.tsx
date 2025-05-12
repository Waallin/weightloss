import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { colors } from "../../../constants/colors";
import { globalStyles } from "../../../constants/globalStyles";
import { spacing } from "../../../constants/spacing";
import Entypo from "@expo/vector-icons/Entypo";

interface DropdownRowProps {
  title: string;
  value: {
    id: number;
    title: string;
  };
  onChange: (value: any) => void;
  onPress: () => void;
}

const DropdownRow = ({ title, value, onChange, onPress }: DropdownRowProps) => {
  return (
    <View
      style={{
        marginTop: spacing.md,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
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
      <TouchableOpacity
        onPress={onPress}
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            ...globalStyles.subTitle,
            color: colors.text.secondary,
            marginRight: spacing.sm,
          }}
        >
          {value.title}
        </Text>
        <Entypo name="chevron-right" size={20} />
      </TouchableOpacity>
    </View>
  );
};

export default DropdownRow;

const styles = StyleSheet.create({});
