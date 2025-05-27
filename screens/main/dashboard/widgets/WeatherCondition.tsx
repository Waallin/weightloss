import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { colors } from "../../../../constants/colors";
import { spacing } from "../../../../constants/spacing";
import { globalStyles } from "../../../../constants/globalStyles";
import { Entypo, Feather, FontAwesome5 } from "@expo/vector-icons";

const WeatherCondition = () => {
  const sun = require("../../../../assets/sun.png");

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
            Marina Bay
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
            24°C
          </Text>
          <Text
            style={{ ...globalStyles.smallText, color: colors.ui.darkBlue }}
          >
            Partly Cloudy
          </Text>
        </View>
        <View>
          <Image source={sun} style={{ width: 36, height: 36 }} />
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
            10 km/h
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
            75%
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
