import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { globalStyles } from "../../../constants/globalStyles";
import { colors } from "../../../constants/colors";
import { spacing } from "../../../constants/spacing";
import { Feather } from "@expo/vector-icons";
import ForecastItem from "./components/forecastItem";
import MarineCondtionItem from "./components/MarineCondtionItem";

const dummyforecast = [
  {
    day: "Today",
    date: "May 20",
    weather: "Partly cloudy",
    temperatureHigh: "24°C",
    temperatureLow: "18°C",
    icon: "sun",
  },
  {
    day: "Tomorrow",
    date: "May 21",
    weather: "Rain",
    temperatureHigh: "22°C",
    temperatureLow: "16°C",
    icon: "cloud-rain",
  },
  {
    day: "Wednesday",
    date: "May 22",
    weather: "Sunny",
    temperatureHigh: "25°C",
    temperatureLow: "19°C",
    icon: "sun",
  },
  {
    day: "Thursday",
    date: "May 23",
    weather: "Cloudy",
    temperatureHigh: "23°C",
    temperatureLow: "17°C",
    icon: "cloud",
  },
  {
    day: "Friday",
    date: "May 24",
    weather: "Rain",
    temperatureHigh: "21°C",
    temperatureLow: "15°C",
    icon: "cloud-rain",
  },
];

const dummyMarineConditions = [
  {
    type: "Wind",
    text: "Wind Speed",
    value: "15 knots",
    icon: "wind",
  },
  {
    type: "Wave",
    text: "Wave Height",
    value: "2.5 m",
    icon: "wind",
  },
  {
    type: "Tide",
    text: "Tide",
    value: "+0.5 m",
    icon: "wind",
  },
  {
    type: "Visibility",
    text: "Visibility",
    value: "10 km",
    icon: "cloud",
  },
  {
    type: "Water",
    text: "Water Temp",
    value: "18°C",
    icon: "droplet",
  },
  {
    type: "Sunrise/Sunset",
    text: "Sunrise/Sunset",
    value: "06:00/18:00",
    icon: "sun",
  },
];

const ForecastScreen = () => {
  const sun = require("../../../assets/sun.png");

  const renderWeatherInfo = () => {
    return (
      <View
        style={{
          backgroundColor: colors.ui.white,
          padding: spacing.md,
          marginTop: spacing.md,
          borderRadius: spacing.borderRadius,
          ...globalStyles.cardShadow,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <Text style={{ ...globalStyles.bodyText, fontWeight: "bold" }}>
              Marina Bay
            </Text>
            <Text style={{ ...globalStyles.smallText }}>Today, May 20</Text>
          </View>
          <Image source={sun} style={{ width: 40, height: 40 }} />
        </View>
        <View
          style={{
            marginTop: spacing.md,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ ...globalStyles.bodyText, fontWeight: "bold" }}>
            24°C
          </Text>
          <Text style={{ ...globalStyles.smallText }}>Partly Cloudy</Text>
        </View>
        <View
          style={{
            backgroundColor: colors.ui.darkBlue,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            marginTop: spacing.md,
            flexDirection: "row",
            borderRadius: spacing.borderRadius,
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              alignItems: "center",
              gap: spacing.xs,
              justifyContent: "center",
              flex: 1,
            }}
          >
            <Feather name="wind" size={24} color="white" />
            <Text
              style={{ ...globalStyles.smallText, color: colors.ui.lightBlue }}
            >
              10 km/h
            </Text>
            <Text
              style={{ ...globalStyles.smallText, color: colors.ui.lightBlue }}
            >
              Wind
            </Text>
          </View>
          <View
            style={{
              width: 1,
              height: "100%",
              backgroundColor: colors.ui.lightBlue,
            }}
          />
          <View
            style={{
              alignItems: "center",
              gap: spacing.xs,
              justifyContent: "center",
              flex: 1,
            }}
          >
            <Feather name="compass" size={24} color="white" />
            <Text
              style={{ ...globalStyles.smallText, color: colors.ui.lightBlue }}
            >
              Wind Dir
            </Text>
            <Text
              style={{ ...globalStyles.smallText, color: colors.ui.lightBlue }}
            >
              NE
            </Text>
          </View>
          <View
            style={{
              width: 1,
              height: "100%",
              backgroundColor: colors.ui.lightBlue,
            }}
          />
          <View
            style={{
              alignItems: "center",
              gap: spacing.xs,
              justifyContent: "center",
              flex: 1,
            }}
          >
            <Feather name="cloud-rain" size={24} color="white" />
            <Text
              style={{ ...globalStyles.smallText, color: colors.ui.lightBlue }}
            >
              Humidity
            </Text>
            <Text
              style={{ ...globalStyles.smallText, color: colors.ui.lightBlue }}
            >
              75%
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderForecast = () => {
    return (
      <View
        style={{
          backgroundColor: colors.ui.white,
          padding: spacing.md,
          marginTop: spacing.md,
          borderRadius: spacing.borderRadius,
          ...globalStyles.cardShadow,
        }}
      >
        <Text style={{ ...globalStyles.bodyText, fontWeight: "bold" }}>
          5-day Forecast
        </Text>
        <View style={{ marginTop: spacing.md }}>
          {dummyforecast.map((item, index) => (
            <ForecastItem key={index} item={item} />
          ))}
        </View>
      </View>
    );
  };

  const renderMarineConditions = () => {
    return (
      <View
        style={{
          backgroundColor: colors.ui.white,
          padding: spacing.md,
          marginTop: spacing.md,
          borderRadius: spacing.borderRadius,
          ...globalStyles.cardShadow,
        }}
      >
        <Text style={{ ...globalStyles.bodyText, fontWeight: "bold" }}>
          Marine Conditions
        </Text>
        <View
          style={{
            marginTop: spacing.md,
            flexDirection: "row",
            flexWrap: "wrap",
            gap: spacing.md,
          }}
        >
          {dummyMarineConditions.map((item, index) => (
            <MarineCondtionItem key={index} item={item} />
          ))}
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        ...globalStyles.container,
        backgroundColor: colors.ui.lightBlueBackground,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: spacing.scrollViewBottomPadding,
        }}
      >
        {renderWeatherInfo()}
        {renderForecast()}
        {renderMarineConditions()}
      </ScrollView>
    </View>
  );
};

export default ForecastScreen;

const styles = StyleSheet.create({});
