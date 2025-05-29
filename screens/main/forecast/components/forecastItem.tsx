import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { ForecastItem } from "../types";
import { colors } from "../../../../constants/colors";
import { Feather } from "@expo/vector-icons";
import { spacing } from "../../../../constants/spacing";
import { globalStyles } from "../../../../constants/globalStyles";

const forecastItem = ({ item }: { item: ForecastItem }) => {
  const sun = require("../../../../assets/sun.png");
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: colors.ui.lightBlue,
        paddingVertical: spacing.md,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.sm,
          width: "35%",
        }}
      >
        <Feather name="calendar" size={24} color={colors.ui.lightBlue} />
        <Text style={{ ...globalStyles.xSmallText }}>{item.day}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.sm,

          width: "40%",
        }}
      >
        <Image source={sun} style={{ width: 24, height: 24 }} />
        <Text
          style={{
            ...globalStyles.xSmallText,

            width: "80%",
          }}
        >
          {item.weather}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.sm,
          flex: 1,
          justifyContent: "flex-end",
        }}
      >
        <Text style={{ ...globalStyles.xSmallText, fontWeight: "bold" }}>
          {item.temperatureHigh}
        </Text>
        <Text style={{ ...globalStyles.xSmallText, color: colors.ui.darkGrey }}>
          {item.temperatureLow}
        </Text>
      </View>
    </View>
  );
};

export default forecastItem;

const styles = StyleSheet.create({});
