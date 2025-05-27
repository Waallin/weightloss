import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { colors } from "../../../../constants/colors";
import { globalStyles } from "../../../../constants/globalStyles";

const WeatherCondition = () => {
  return (
    <View style={globalStyles.widgetContainer}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={globalStyles.bodyText}>Weather</Text>
        <Text style={globalStyles.bodyText}>24°C</Text>
        <Text style={globalStyles.bodyText}>Clear</Text>
      </View>
    </View>
  );
};

export default WeatherCondition;

const styles = StyleSheet.create({});
