import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { colors } from "../../../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import ChecklistItem from "./ChecklistItem";
import { spacing } from "../../../../constants/spacing";
import { globalStyles } from "../../../../constants/globalStyles";
const ChecklistSection = ({ section }: { section: any }) => {
  const [expandedItem, setExpandedItem] = useState(false);
  return (
    <View>
      <View
        style={{
          backgroundColor: colors.ui.lightBlueBackground,
          padding: spacing.md,
          borderRadius: spacing.borderRadius,
        }}
      >
        <TouchableOpacity
          onPress={() => setExpandedItem(!expandedItem)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.sm,
            }}
          >
            <Ionicons
              name={"warning"}
              size={18}
              color={colors.status.warning}
            />
            <Text style={{ ...globalStyles.xSmallText, fontWeight: "bold" }}>
              {section.title}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.sm,
            }}
          >
            <Text style={{ ...globalStyles.xSmallText }}>
              {section.items.length} items
            </Text>

            <Ionicons
              name={expandedItem ? "chevron-up" : "chevron-down"}
              size={18}
              color={colors.ui.darkBlue}
            />
          </View>
        </TouchableOpacity>
      </View>
      {expandedItem && (
        <View>
          {section.items.map((item: any) => (
            <ChecklistItem key={item.id} item={item} />
          ))}
        </View>
      )}
    </View>
  );
};

export default ChecklistSection;

const styles = StyleSheet.create({});
