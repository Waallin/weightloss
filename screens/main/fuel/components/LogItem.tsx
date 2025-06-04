import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { FuelLogType } from "../types";
import { colors } from "../../../../constants/colors";
import { spacing } from "../../../../constants/spacing";
import { globalStyles } from "../../../../constants/globalStyles";
import { AntDesign, Entypo } from "@expo/vector-icons";
import ProgressBar from "../../../../components/ProgressBar";

const LogItem = ({ log }: { log: FuelLogType }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: colors.ui.white,
        padding: spacing.md,
        borderRadius: spacing.borderRadius,
        ...globalStyles.cardShadow,
        borderBottomWidth: 1,
        borderBottomColor: colors.ui.lightGrey,
      }}
    >
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.sm,
            marginBottom: spacing.sm,
          }}
        >
          <Entypo name="calendar" size={18} color={colors.ui.grey} />
          <Text
            style={{
              ...globalStyles.xSmallText,
              color: colors.ui.grey,
            }}
          >
            May 20, 2025
          </Text>
        </View>
        <View style={{ marginBottom: spacing.md }}>
          <ProgressBar progress={0.8} />
          <Text style={{ ...globalStyles.smallText, marginTop: spacing.xs }}>
            {log.destination}
          </Text>
          <Text style={{ ...globalStyles.smallText, marginTop: spacing.xs }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.xs,
              }}
            >
              <AntDesign name="clockcircleo" size={16} />
              <Text style={{ ...globalStyles.smallText }}>
                {log.engineHours} engine hours ago
              </Text>
            </View>
          </Text>
        </View>
        <View
          style={{
            width: "100%",
            height: 1,
            backgroundColor: colors.ui.lightGrey,
            marginBottom: spacing.md,
          }}
        />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <Text style={{ ...globalStyles.smallText }}>Total</Text>
            <Text style={{ ...globalStyles.smallText, fontWeight: "bold" }}>
              $320
            </Text>
          </View>
          <View>
            <Text style={{ ...globalStyles.smallText }}>Price</Text>
            <Text style={{ ...globalStyles.smallText, fontWeight: "bold" }}>
              4.00/gal
            </Text>
          </View>
          <View>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.xs,
              }}
            >
              <Text style={{ ...globalStyles.smallText }}>Details</Text>
              <Entypo name="chevron-right" size={20} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LogItem;

const styles = StyleSheet.create({});
