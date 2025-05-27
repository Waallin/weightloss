import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import { globalStyles } from "../../../../constants/globalStyles";
import { colors } from "../../../../constants/colors";
import { Entypo } from "@expo/vector-icons";
import { spacing } from "../../../../constants/spacing";
import ForecastDayItem from "./components/ForecastDayItem";

const dummyData = [
  {
    title: "Today",
    date: "May 24",
    temperature: 18,
    weather: "sunny",
    icon: "sun",
    description: "Soligt",
    humidity: 45,
    wind: 8,
  },
  {
    title: "Tomorrow",
    date: "May 25",
    temperature: 16,
    weather: "cloudy",
    icon: "cloud",
    description: "Molnigt",
    humidity: 60,
    wind: 12,
  },
  {
    title: "Thursday",
    date: "May 26",
    temperature: 15,
    weather: "rainy",
    icon: "cloud-rain",
    description: "Regnigt",
    humidity: 75,
    wind: 15,
  },
  {
    title: "Friday",
    date: "May 27",
    temperature: 17,
    weather: "partly-cloudy",
    icon: "cloud-sun",
    description: "Delvis molnigt",
    humidity: 55,
    wind: 10,
  },
  {
    title: "Saturday",
    date: "May 28",
    temperature: 19,
    weather: "sunny",
    icon: "sun",
    description: "Soligt",
    humidity: 50,
    wind: 7,
  },
];
const WeatherFocast = () => {
  return (
    <View style={globalStyles.widgetContainer}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            ...globalStyles.bodyText,
            fontWeight: "bold",
            color: colors.ui.darkBlue,
          }}
        >
          Forecast
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.sm,
          }}
        >
          <Text
            style={{ ...globalStyles.smallText, color: colors.ui.darkBlue }}
          >
            View More
          </Text>
          <Entypo name="chevron-right" size={24} color={colors.ui.darkBlue} />
        </View>
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: spacing.md,
          paddingTop: spacing.md,
        }}
        data={dummyData}
        renderItem={({ item }) => <ForecastDayItem item={item} />}
      />
    </View>
  );
};

export default WeatherFocast;

const styles = StyleSheet.create({});
