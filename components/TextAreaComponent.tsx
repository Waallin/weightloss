import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import { spacing } from "../constants/spacing";
import { globalStyles } from "../constants/globalStyles";
import { colors } from "../constants/colors";

const TextAreaComponent = ({
  title,
  placeholder,
  value,
  onChangeText,
  disabled,
}: {
  title: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  disabled?: boolean;
}) => {
  return (
    <View>
      <Text
        style={{
          ...globalStyles.smallText,
          fontWeight: "bold",
          marginTop: spacing.sm,
        }}
      >
        {title}
      </Text>
      <TextInput
        multiline={true}
        numberOfLines={4}
        style={{
          borderColor: colors.ui.lightGrey,
          borderWidth: 1,
          color: disabled ? colors.ui.grey : colors.ui.darkBlue,
          borderRadius: spacing.borderRadius,
          padding: spacing.sm,
          marginTop: spacing.sm,
          height: 100,
        }}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        editable={!disabled}
      />
    </View>
  );
};

export default TextAreaComponent;

const styles = StyleSheet.create({});
