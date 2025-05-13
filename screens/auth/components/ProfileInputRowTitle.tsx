import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { colors } from "../../../constants/colors";
import { spacing } from "../../../constants/spacing";
import { globalStyles } from "../../../constants/globalStyles";

const ProfileInputRowTitle = ({
  title,
  icon,
}: {
  title: string;
  icon: string;
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginTop: spacing.lg,
      }}
    >
      <View
        style={{
          backgroundColor: colors.ui.lightGrey,
          padding: spacing.sm,
          borderRadius: spacing.borderRadius,
        }}
      >
        <Feather name={icon as any} size={24} color={colors.ui.darkBlue} />
      </View>
      <Text
        style={{
          ...globalStyles.subTitle,
          fontWeight: "800",
          marginLeft: spacing.md,
        }}
      >
        {title}
      </Text>
    </View>
  );
};

export default ProfileInputRowTitle;

const styles = StyleSheet.create({});
