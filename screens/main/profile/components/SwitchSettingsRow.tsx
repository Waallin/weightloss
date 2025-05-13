import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { colors } from "../../../../constants/colors";
import { spacing } from "../../../../constants/spacing";
import { globalStyles } from "../../../../constants/globalStyles";
import { Feather, Entypo } from "@expo/vector-icons";
import { SwitchSettingsRowProps } from "../types";

const SwitchSettingsRow = ({
  title,
  icon,
  onPress,
  value,
  onValueChange,
}: SwitchSettingsRowProps) => {
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: colors.ui.white,
          padding: spacing.md,
          ...globalStyles.cardShadow,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
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
              backgroundColor: colors.ui.background,
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
          <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{
              true: colors.ui.darkBlue,
              false: colors.ui.lightGrey,
            }}
          />
        </View>
      </View>
      <View
        style={{
          height: 1,
          backgroundColor: colors.ui.lightGrey,
          marginHorizontal: spacing.md,
        }}
      />
    </View>
  );
};

export default SwitchSettingsRow;

const styles = StyleSheet.create({});
