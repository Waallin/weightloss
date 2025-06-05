import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import { globalStyles } from "../../../../constants/globalStyles";
import { colors } from "../../../../constants/colors";
import { spacing } from "../../../../constants/spacing";

const TextInputComponent = ({
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
    <View>
      <Text style={{ ...globalStyles.smallText, fontWeight: "bold" }}>
        {title}
      </Text>
      <TextInput
        style={{
          borderColor: colors.ui.lightGrey,
          borderWidth: 1,
          borderRadius: spacing.borderRadius,
          padding: spacing.sm,
          marginTop: spacing.sm,
        }}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

export default TextInputComponent;

const styles = StyleSheet.create({});
