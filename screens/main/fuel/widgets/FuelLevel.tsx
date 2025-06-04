import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { colors } from "../../../../constants/colors";
import { Entypo } from "@expo/vector-icons";
import { spacing } from "../../../../constants/spacing";
import { globalStyles } from "../../../../constants/globalStyles";
import Svg, { Circle } from "react-native-svg";

const FuelLevel = () => {
  const fuelLevel = 50;

  const size = 200;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progressValue = ((100 - fuelLevel) * circumference) / 100;

  const returnDiagram = () => {
    return (
      <View style={{ width: size, height: size, position: "relative" }}>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.ui.grey}
            strokeWidth={strokeWidth}
            fill="transparent"
            opacity={0.2}
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.ui.darkBlue}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={progressValue}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        <View style={styles.centerText}>
          <Text
            style={{
              ...globalStyles.bodyText,
              fontSize: 32,
              fontWeight: "bold",
            }}
          >
            {fuelLevel}%
          </Text>
          <Text style={{ ...globalStyles.smallText }}>Fuel</Text>
        </View>
      </View>
    );
  };

  const returnRange = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.sm,
          backgroundColor: colors.ui.lightGrey,
          padding: spacing.sm,
          borderRadius: spacing.borderRadius,
        }}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
          }}
        >
          <Text style={{ ...globalStyles.smallText }}>range: 100 km</Text>
        </View>
        <View
          style={{
            width: 1,
            height: 10,
            backgroundColor: colors.ui.grey,
            marginHorizontal: spacing.sm,
          }}
        />
        <View
          style={{
            flex: 1,
            alignItems: "centers",
          }}
        >
          <Text style={{ ...globalStyles.smallText }}>Est. time: 100 min</Text>
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        backgroundColor: colors.ui.white,
        padding: spacing.md,
        borderRadius: spacing.borderRadius,
        ...globalStyles.cardShadow,
      }}
    >
      <View>
        <Text style={{ ...globalStyles.smallTitle }}>Fuel Level</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.sm,
          }}
        >
          <Entypo name="calendar" size={18} color={colors.ui.grey} />
          <Text
            style={{
              ...globalStyles.xSmallText,
              color: colors.ui.grey,
            }}
          >
            Last refuel: May 20, 2025
          </Text>
        </View>
      </View>
      <View style={{ marginTop: spacing.md, alignItems: "center" }}>
        {returnDiagram()}
      </View>
      <View style={{ marginTop: spacing.md }}>{returnRange()}</View>
    </View>
  );
};

export default FuelLevel;

const styles = StyleSheet.create({
  centerText: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  percentageText: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.ui.darkBlue,
  },
  labelText: {
    fontSize: 16,
    color: colors.ui.grey,
  },
});
