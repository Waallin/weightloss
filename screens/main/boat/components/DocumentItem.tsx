import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { DocumentItemType } from "../types";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../../constants/colors";
import { spacing } from "../../../../constants/spacing";
import { globalStyles } from "../../../../constants/globalStyles";
import { useState } from "react";
import DocumentInformationItem from "./DocumentInformationItem";
import * as Haptics from "expo-haptics";

const documentItem = ({ item }: { item: DocumentItemType }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const renderContent = () => {
    return (
      <View
        style={{
          marginTop: spacing.md,
          borderTopWidth: 1,
          borderTopColor: colors.ui.lightGrey,
        }}
      >
        <DocumentInformationItem
          title={"document Number"}
          value={item.documentNumber}
        />
        <DocumentInformationItem title={"issue Date"} value={item.issueDate} />
        <DocumentInformationItem title={"type"} value={item.type} />
        <DocumentInformationItem title={"status"} value={item.status} />
      </View>
    );
  };

  const handleExpand = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsExpanded(!isExpanded);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handleExpand}
      style={{
        backgroundColor: colors.ui.white,
        padding: spacing.md,
        borderRadius: spacing.borderRadius,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View
              style={{
                width: 40,
                height: 40,
                backgroundColor: colors.ui.lightBlueBackground,
                borderRadius: 8,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="document-text-outline"
                size={24}
                color={colors.ui.darkBlue}
              />
            </View>
          </View>
        </View>
        <View style={{ flex: 1, marginLeft: spacing.md, gap: 4 }}>
          <Text
            style={{
              ...globalStyles.smallText,
              fontWeight: "bold",
            }}
          >
            {item.title}
          </Text>
          <Text style={{ ...globalStyles.xSmallText }}>
            {item.type} • {item.size} • {item.expires}
          </Text>
        </View>
        <View>
          <View>
            <Ionicons
              name={isExpanded ? "chevron-up-outline" : "chevron-down-outline"}
              size={24}
              color={colors.ui.darkBlue}
            />
          </View>
        </View>
      </View>
      {isExpanded && renderContent()}
    </TouchableOpacity>
  );
};

export default documentItem;

const styles = StyleSheet.create({});
