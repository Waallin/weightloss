import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { ServiceItemType } from "../types";
import { colors } from "../../../../constants/colors";
import { spacing } from "../../../../constants/spacing";
import { globalStyles } from "../../../../constants/globalStyles";
import { Entypo } from "@expo/vector-icons";
import StatusIcon from "../../../../components/StatusIcon";

const ServiceItem = ({ item }: { item: ServiceItemType }) => {
  return (
    <View
      style={{
        backgroundColor: colors.ui.white,
        padding: spacing.md,
        borderRadius: spacing.borderRadius,
        ...globalStyles.cardShadow,
        flex: 1,
      }}
    >
      <View>
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ ...globalStyles.smallText, fontWeight: "bold" }}>
              {item.title}
            </Text>
            <Entypo name="chevron-right" size={20} color={colors.ui.darkBlue} />
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.sm,
            marginTop: spacing.sm,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.sm,
            }}
          >
            <Entypo name="calendar" size={18} color={colors.ui.grey} />
            <Text
              style={{
                ...globalStyles.xSmallText,
                color: colors.ui.grey,
              }}
            >
              {item.date}
            </Text>
            <StatusIcon status={item.status} />
            <Text style={{ ...globalStyles.xSmallText, color: colors.ui.grey }}>
              {item.status}
            </Text>
          </View>
        </View>
        <View style={{ marginTop: spacing.sm }}>
          <Text style={{ ...globalStyles.xSmallText, color: colors.ui.grey }}>
            {item.description}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ServiceItem;

const styles = StyleSheet.create({});
