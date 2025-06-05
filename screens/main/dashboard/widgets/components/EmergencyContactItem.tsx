import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { EmergencyContactItemType } from "../types";
import { colors } from "../../../../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { spacing } from "../../../../../constants/spacing";
import { globalStyles } from "../../../../../constants/globalStyles";

const EmergencyContactItem = ({
  contact,
}: {
  contact: EmergencyContactItemType;
}) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: colors.ui.lightGrey,
        paddingBottom: spacing.sm,
      }}
    >
      <View style={{ gap: spacing.xs }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.xs,
          }}
        >
          <Ionicons name="person-circle" size={24} color={colors.ui.darkBlue} />
          <Text style={{ ...globalStyles.smallText, fontWeight: "bold" }}>
            {contact.name}
          </Text>
        </View>

        <Text style={{ ...globalStyles.smallText }}>{contact.phone}</Text>
      </View>
      <View>
        <Ionicons name="call" size={20} color={colors.ui.darkBlue} />
      </View>
    </TouchableOpacity>
  );
};

export default EmergencyContactItem;

const styles = StyleSheet.create({});
