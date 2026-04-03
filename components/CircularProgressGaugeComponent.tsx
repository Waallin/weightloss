import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { colors } from "../constants/colors";
import { spacing } from "../constants/spacing";
import { textSizes } from "../constants/texts";

interface HalfCircularProgressGaugeProps {
  fill: number;
  tintColor: string;
  backgroundColor: string;
  showPercentage?: boolean;
  size?: number;
  width?: number;
}

const CircularProgressGaugeComponent: React.FC<HalfCircularProgressGaugeProps> = ({
  fill,
  tintColor,
  backgroundColor,
  showPercentage = true,
  size = 120,
  width = 25,
}) => {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: spacing.sm,
      }}
    >
      {/* Halvcirkel: börja 180°, visa 180° */}
      <AnimatedCircularProgress
        size={size}
        width={width}
        fill={fill}
        tintColor={tintColor}
        backgroundColor={backgroundColor}
        rotation={0}
        lineCap="round"
        duration={1000}
      />
      {showPercentage && (
        <Text style={{ fontSize: textSizes.xxxl, fontWeight: '800', marginTop: spacing.md }}>
          {fill}%
        </Text>
      )}
    </View>
  );
};

export default CircularProgressGaugeComponent;
