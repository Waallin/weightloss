import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { colors } from "../../../../constants/colors";
import { spacing } from "../../../../constants/spacing";
import { globalStyles } from "../../../../constants/globalStyles";
import { Entypo, Feather, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import useWeatherStore from "../../../../stores/useWeatherStore";

const WeatherCondition = () => {
  const { weather } = useWeatherStore();

  const conditionIcon = "https:" + weather?.current?.condition?.icon;

  const navigation = useNavigation();
  const handleNavigation = () => {
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
          Weather
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.xs,
            marginTop: spacing.xs,
          }}
        >
          <FontAwesome5
            name="location-arrow"
            size={10}
            color={colors.ui.darkBlue}
          />
          <Text
            style={{
              ...globalStyles.smallText,
              color: colors.ui.darkBlue,
            }}
          >
            {weather?.location?.name}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: spacing.sm,
        }}
      >
        <View>
          <Text
            style={{
              ...globalStyles.title,
              fontWeight: "bold",
              color: colors.ui.darkBlue,
            }}
          >
            {weather?.current?.temp_c}°C
          </Text>
          <Text
            style={{ ...globalStyles.smallText, color: colors.ui.darkBlue }}
          >
            {weather?.current?.condition?.text}
          </Text>
        </View>
        <View>
          <Image
            source={{ uri: conditionIcon }}
            style={{ width: 36, height: 36 }}
          />
        </View>
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
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.sm,
            justifyContent: "center",
            flex: 1,
          }}
        >
          <Feather name="wind" size={24} color="white" />
          <Text style={{ ...globalStyles.smallText, color: colors.ui.white }}>
            {weather?.current?.wind_kph} km/h
          </Text>
        </View>
        <View
          style={{
            width: 1,
            height: 24,
            backgroundColor: colors.ui.white,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.sm,
            justifyContent: "center",
            flex: 1,
          }}
        >
          <Feather name="cloud-rain" size={24} color="white" />
          <Text style={{ ...globalStyles.smallText, color: colors.ui.white }}>
            {weather?.current?.humidity}%
          </Text>
        </View>
      </View>
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: colors.ui.lightGrey,
          marginTop: spacing.md,
        }}
      />
      <View
        style={{
          alignItems: "flex-end",
          marginTop: spacing.md,
        }}
      >
        <TouchableOpacity
          onPress={handleNavigation}
          style={{
            flexDirection: "row",
            gap: spacing.sm,
            alignItems: "center",
          }}
        >
          <Text
            style={{ ...globalStyles.smallText, color: colors.ui.darkBlue }}
          >
            View Forecast
          </Text>
          <Entypo name="chevron-right" size={24} color={colors.ui.darkBlue} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WeatherCondition;

const styles = StyleSheet.create({});
