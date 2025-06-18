import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "../../../../constants/colors";
import { spacing } from "../../../../constants/spacing";
import { globalStyles } from "../../../../constants/globalStyles";
import { Ionicons } from "@expo/vector-icons";
import ChecklistSection from "./ChecklistSection";
import ProgressBar from "../../../../components/ProgressBar";
import PrimaryButton from "../../../../components/PrimaryButton";
const Checklist = ({ checklist }: { checklist: any }) => {
  const [expandedSection, setExpandedSection] = useState(false);

  const returnDate = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const countProgress = () => {
    let totalItems = 0;
    let completedItems = 0;

    checklist.sections.forEach((section: any) => {
      section.items.forEach((item: any) => {
        totalItems++;
        if (item.responses && item.responses.length > 0) {
          completedItems++;
        }
      });
    });

    const result = totalItems > 0 ? completedItems / totalItems : 0;
    return result;
  };

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
            <Text style={globalStyles.xSmallText}>
              {returnDate(checklist.date)}
            </Text>
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
        <ProgressBar progress={countProgress()} />
      </View>
      {expandedSection && (
        <View style={{ marginTop: spacing.md, gap: spacing.sm }}>
          {checklist.sections.map((section: any, key: number) => (
            <ChecklistSection key={key} section={section} />
          ))}
          <View style={{ marginTop: spacing.md }}>
            <PrimaryButton
              disabled={countProgress() < 1}
              title="Sign and Complete"
              onPress={() => {}}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default Checklist;

const styles = StyleSheet.create({});
