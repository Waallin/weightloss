import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../../../constants/colors";
import { spacing } from "../../../../constants/spacing";
import { globalStyles } from "../../../../constants/globalStyles";
const InputRow = ({
  label,
  placeholder,
  icon,
}: {
  label: string;
  placeholder: string;
  icon: string;
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: spacing.md,
        backgroundColor: colors.ui.white,
        ...globalStyles.cardShadow,
        padding: spacing.md,
        borderRadius: spacing.borderRadius,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          flex: 1,
        }}
      >
        <MaterialIcons
          name={icon as any}
          size={24}
          color={colors.brand.primary}
        />
        <View style={{ marginLeft: spacing.md }}>
          <Text style={{ ...globalStyles.smallText, fontWeight: "700" }}>
            {label}
          </Text>
          <TextInput
            style={{
              ...globalStyles.smallGreyText,
              width: "100%",

              marginTop: spacing.sm,
              //   padding: spacing.sm,
            }}
            placeholder={"placeholder"}
          />
        </View>
      </View>
    </View>
  );
};

export default InputRow;

const styles = StyleSheet.create({});
