import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { globalStyles } from "../../../../constants/globalStyles";
import { colors } from "../../../../constants/colors";
import { Entypo } from "@expo/vector-icons";
import { spacing } from "../../../../constants/spacing";
import ForecastDayItem from "./components/ForecastDayItem";
import useWeatherStore from "../../../../stores/useWeatherStore";
import { useNavigation } from "@react-navigation/native";

const WeatherFocast = () => {
  const { weather } = useWeatherStore();
  const navigation = useNavigation();
  const [forecast, setForecast] = useState<any>([]);

  useEffect(() => {
    setForecastFunction();
  }, [weather]);

  const setForecastFunction = () => {
    setForecast(
      weather?.forecast?.forecastday?.map((day: any) => ({
        ...day.day,
        date: new Date(day.date).toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
        }),
        dayInWeek: new Date(day.date).toLocaleDateString("en-US", {
          weekday: "long",
        }),
      }))
    );
  };

  const handleViewMore = () => {
    navigation.navigate("Forecast");
  };
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
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.sm,
          }}
          onPress={handleViewMore}
        >
          <Text
            style={{ ...globalStyles.smallText, color: colors.ui.darkBlue }}
          >
            View More
          </Text>
          <Entypo name="chevron-right" size={24} color={colors.ui.darkBlue} />
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: spacing.md,
          paddingTop: spacing.md,
        }}
        data={forecast}
        renderItem={({ item, index }) => (
          <ForecastDayItem item={item} index={index} />
        )}
      />
    </View>
  );
};

export default WeatherFocast;

const styles = StyleSheet.create({});
