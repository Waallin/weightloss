import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import { globalStyles } from "../../../constants/globalStyles";
import { spacing } from "../../../constants/spacing";
import { colors } from "../../../constants/colors";
const ProfileInputRow = ({
  title,
  placeholder,
  value,
  onChangeText,
}: {
  title: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
}) => {
  return (
    <View style={{ marginTop: spacing.md }}>
      <Text style={{ ...globalStyles.subTitle, fontWeight: "600" }}>
        {title}
      </Text>
      <TextInput
        placeholder={placeholder}
        style={{
          ...globalStyles.smallGreyText,
          marginTop: spacing.sm,
          borderWidth: 1,
          borderColor: colors.ui.lightGrey,
          borderRadius: spacing.borderRadius,
          padding: spacing.md,
        }}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

export default ProfileInputRow;

const styles = StyleSheet.create({});
