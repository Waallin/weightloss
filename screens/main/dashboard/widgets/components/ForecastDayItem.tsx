import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { colors } from "../../../../../constants/colors";
import { spacing } from "../../../../../constants/spacing";
import { globalStyles } from "../../../../../constants/globalStyles";

const ForecastDayItem = ({ item }: { item: any }) => {
  const sun = require("../../../../../assets/sun.png");
  return (
    <View
      style={{
        backgroundColor: colors.ui.lightBlueBackground,
        padding: spacing.md,
        borderRadius: spacing.borderRadius,
        width: 150,
        gap: spacing.md,
        alignItems: "center",
      }}
    >
      <View style={{ alignItems: "center", gap: spacing.xs }}>
        <Text
          style={{
            ...globalStyles.smallText,
            color: colors.ui.darkBlue,
            fontWeight: "bold",
          }}
        >
          {item.title}
        </Text>
        <Text style={{ ...globalStyles.smallText, color: colors.ui.darkBlue }}>
          {item.date}
        </Text>
      </View>
      <Image source={sun} style={{ width: 42, height: 42 }} />
      <Text
        style={{
          ...globalStyles.bodyText,

          fontWeight: "bold",
        }}
      >
        {item.temperature}°C
      </Text>
      <Text
        onPress={() => console.log("item", item)}
        style={{
          ...globalStyles.smallText,
          color: colors.ui.darkBlue,
        }}
      >
        {item.weather}
      </Text>
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: colors.ui.border,
        }}
      />
      <View style={{ gap: spacing.md, width: "100%" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",

            justifyContent: "space-between",
            gap: spacing.sm,
          }}
        >
          <Text
            style={{
              ...globalStyles.smallText,
              color: colors.ui.darkBlue,
              fontWeight: "bold",
            }}
          >
            25%
          </Text>
          <Feather name="cloud-rain" size={16} color={colors.ui.darkBlue} />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.sm,
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              ...globalStyles.smallText,
              color: colors.ui.darkBlue,
              fontWeight: "bold",
            }}
          >
            12/km h
          </Text>
          <Feather name="wind" size={16} color={colors.ui.darkBlue} />
        </View>
      </View>
    </View>
  );
};

export default ForecastDayItem;

const styles = StyleSheet.create({});
