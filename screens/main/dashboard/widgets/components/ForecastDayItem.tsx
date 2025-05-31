import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { colors } from "../../../../../constants/colors";
import { spacing } from "../../../../../constants/spacing";
import { globalStyles } from "../../../../../constants/globalStyles";
import { ForecastItemType } from "../../../forecast/types";

const ForecastDayItem = ({
  item,
  index,
}: {
  item: ForecastItemType;
  index: number;
}) => {
  const conditionIcon = "https:" + item.condition.icon;

  const returnDay = () => {
    switch (index) {
      case 0:
        return "Today";
      case 1:
        return "Tomorrow";
      default:
        return item.dayInWeek;
    }
  };
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
          {returnDay()}
        </Text>
        <Text style={{ ...globalStyles.smallText, color: colors.ui.darkBlue }}>
          {item.date}
        </Text>
      </View>
      <Image
        source={{ uri: conditionIcon }}
        style={{ width: 42, height: 42 }}
      />
      <Text
        style={{
          ...globalStyles.bodyText,

          fontWeight: "bold",
        }}
      >
        {item?.maxtemp_c}°C
      </Text>
      <View style={{ width: "100%", alignItems: "center", flex: 1 }}>
        <Text
          style={{
            ...globalStyles.smallText,
            color: colors.ui.darkBlue,
            textAlign: "center",
          }}
        >
          {item?.condition?.text}
        </Text>
      </View>
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
            {item?.daily_chance_of_rain}%
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
            {item?.maxwind_kph} km/h
          </Text>
          <Feather name="wind" size={16} color={colors.ui.darkBlue} />
        </View>
      </View>
    </View>
  );
};

export default ForecastDayItem;

const styles = StyleSheet.create({});
