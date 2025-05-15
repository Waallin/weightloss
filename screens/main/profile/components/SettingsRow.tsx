import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { SettingsRowProps } from "../types";
import { spacing } from "../../../../constants/spacing";
import { colors } from "../../../../constants/colors";
import { Entypo, Feather } from "@expo/vector-icons";
import { globalStyles } from "../../../../constants/globalStyles";
import * as Haptics from "expo-haptics";
const SettingsRow = ({
  title,
  icon,
  index,
  onPress,
  last,
}: SettingsRowProps) => {
  const firstIndex = index === 0;
  const lastIndex = last;

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={handlePress}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: colors.ui.white,
          padding: spacing.md,
          ...globalStyles.cardShadow,
          borderTopLeftRadius: firstIndex ? spacing.xs : 0,
          borderTopRightRadius: firstIndex ? spacing.xs : 0,
          borderBottomLeftRadius: lastIndex ? spacing.xs : 0,
          borderBottomRightRadius: lastIndex ? spacing.xs : 0,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              marginRight: spacing.md,
              backgroundColor: colors.ui.lightBlueBackground,
              padding: spacing.sm,
              borderRadius: spacing.borderRadius,
            }}
          >
            <Feather name={icon as any} size={24} color={colors.ui.darkBlue} />
          </View>
          <Text style={{ ...globalStyles.smallText, fontWeight: "600" }}>
            {title}
          </Text>
        </View>
        <View>
          <Entypo name="chevron-right" size={20} />
        </View>
      </View>
      <View
        style={{
          height: 1,
          backgroundColor: colors.ui.lightGrey,
          marginHorizontal: spacing.md,
        }}
      />
    </TouchableOpacity>
  );
};

export default SettingsRow;

const styles = StyleSheet.create({});
