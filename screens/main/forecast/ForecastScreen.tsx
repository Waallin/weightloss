import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { globalStyles } from "../../../constants/globalStyles";
import { colors } from "../../../constants/colors";
import { spacing } from "../../../constants/spacing";
import { Feather } from "@expo/vector-icons";
import ForecastItem from "./components/forecastItem";
import MarineCondtionItem from "./components/MarineCondtionItem";
import useWeatherStore from "../../../stores/useWeatherStore";
import { ForecastItemType } from "./types";

const ForecastScreen = () => {
  const { weather } = useWeatherStore();
  const [forecast, setForecast] = useState<any>([]);
  const conditionIcon = "https:" + weather?.current?.condition?.icon;
  const [marineConditions, setMarineConditions] = useState<any>([]);
  useEffect(() => {
    setForecastFunction();
    setMarineConditionsFunction();
  }, [weather]);

  const setForecastFunction = () => {
    setForecast(
      weather?.forecast?.forecastday?.map((day: any) => ({
        ...day.day,
        date: new Date(day.date).toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
        }),
        dayInWeek: new Date(day.date).toLocaleDateString("sv-SE", {
          weekday: "long",
        }),
      }))
    );
  };

  const setMarineConditionsFunction = () => {
    setMarineConditions([
      {
        type: "Wind",
        text: "Wind",
        value: `${weather.current.wind_kph} km/h`,
        icon: "wind",
      },
      {
        type: "Visibility",
        text: "Visibility",
        value: `${weather.current.vis_km} km`,
        icon: "cloud",
      },
      {
        type: "Temperature",
        text: "Feels Like",
        value: `${weather.current.feelslike_c}°C`,
        icon: "thermometer",
      },
      {
        type: "Humidity",
        text: "Humidity",
        value: `${weather.current.humidity}%`,
        icon: "droplet",
      },
      {
        type: "Pressure",
        text: "Pressure",
        value: `${weather.current.pressure_mb} mb`,
        icon: "bar-chart",
      },
      {
        type: "UV Index",
        text: "UV Index",
        value: `${weather.current.uv}`,
        icon: "sun",
      },
    ]);
  };

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
          <Image
            source={{ uri: conditionIcon }}
            style={{ width: 40, height: 40 }}
          />
        </View>
        <View
          style={{
            marginTop: spacing.md,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ ...globalStyles.bodyText, fontWeight: "bold" }}>
            {weather?.current?.temp_c}°C
          </Text>
          <Text style={{ ...globalStyles.smallText }}>
            {weather?.current?.condition?.text}
          </Text>
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
              {weather?.current?.wind_kph} km/h
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
              {weather?.current?.wind_dir}
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
              {weather?.current?.humidity}%
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
          3-day Forecast
        </Text>
        <View style={{ marginTop: spacing.md }}>
          {forecast?.map((item: ForecastItemType, index: number) => (
            <ForecastItem key={index} item={item} index={index} />
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
          {marineConditions.map((item: any, index: number) => (
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
