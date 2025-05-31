import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { ForecastItemType } from "../types";
import { colors } from "../../../../constants/colors";
import { Feather } from "@expo/vector-icons";
import { spacing } from "../../../../constants/spacing";
import { globalStyles } from "../../../../constants/globalStyles";

const forecastItem = ({
  item,
  index,
}: {
  item: ForecastItemType;
  index: number;
}) => {
  const conditionIcon = "https:" + item?.condition?.icon;

  const renderDay = () => {
    switch (index) {
      case 0:
        return "Today";
      case 1:
        return "Tomorrow";
      default:
        return item.date;
    }
  };
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
        <Text style={{ ...globalStyles.xSmallText }}>{renderDay()}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.sm,

          width: "40%",
        }}
      >
        <Image
          source={{
            uri: conditionIcon,
          }}
          style={{ width: 26, height: 26 }}
        />
        <Text
          style={{
            ...globalStyles.xSmallText,

            width: "80%",
          }}
        >
          {item?.condition?.text}
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
          {item?.maxtemp_c}°C
        </Text>
        <Text style={{ ...globalStyles.xSmallText, color: colors.ui.darkGrey }}>
          {item?.mintemp_c}°C
        </Text>
      </View>
    </View>
  );
};

export default forecastItem;

const styles = StyleSheet.create({});
