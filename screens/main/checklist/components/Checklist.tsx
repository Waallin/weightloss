import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { colors } from "../../../../constants/colors";
import { spacing } from "../../../../constants/spacing";
import { globalStyles } from "../../../../constants/globalStyles";
import { Ionicons } from "@expo/vector-icons";
import ChecklistSection from "./ChecklistSection";
import ProgressBar from "../../../../components/ProgressBar";
const Checklist = ({ checklist }: { checklist: any }) => {
  const [expandedSection, setExpandedSection] = useState(false);

  return (
    <View
      style={{
        backgroundColor: colors.ui.white,
        padding: spacing.md,
        borderRadius: spacing.borderRadius,
        marginBottom: spacing.md,
        ...globalStyles.cardShadow,
      }}
    >
      <TouchableOpacity
        onPress={() => setExpandedSection(!expandedSection)}
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
          <View
            style={{
              backgroundColor: colors.ui.lightBlueBackground,
              padding: spacing.xs,
              borderRadius: spacing.borderRadius,
            }}
          >
            <Ionicons name="calendar" size={24} color={colors.ui.darkBlue} />
          </View>
          <View style={{ gap: spacing.xs }}>
            <Text
              style={{
                ...globalStyles.smallText,
                fontWeight: "bold",
                width: "90%",
              }}
            >
              {checklist.title}
            </Text>
            <Text style={globalStyles.xSmallText}>thu, Jun 15 2025</Text>
          </View>
        </View>
        <View>
          <Ionicons
            name={expandedSection ? "chevron-up" : "chevron-down"}
            size={18}
            color={colors.ui.darkBlue}
          />
        </View>
      </TouchableOpacity>
      <View style={{ marginTop: spacing.md }}>
        <ProgressBar progress={1} />
      </View>
      {expandedSection && (
        <View style={{ marginTop: spacing.md, gap: spacing.sm }}>
          {checklist.sections.map((section: any, key: number) => (
            <ChecklistSection key={key} section={section} />
          ))}
        </View>
      )}
    </View>
  );
};

export default Checklist;

const styles = StyleSheet.create({});
