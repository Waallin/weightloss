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

const HalfCircularProgressGaugeComponent: React.FC<HalfCircularProgressGaugeProps> = ({
  fill,
  tintColor,
  backgroundColor,
  showPercentage = true,
  size = 190,
  width = 20,
}) => {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: spacing.sm,
      }}
    >
      <AnimatedCircularProgress
        size={size}
        width={width}
        fill={fill}
        tintColor={tintColor}
        backgroundColor={backgroundColor}
        lineCap="round"
        duration={1000}
        arcSweepAngle={280}
        rotation={220}
      />
      {showPercentage && (
        <Text style={{ fontSize: textSizes.xl, fontWeight: 'bold', marginTop: spacing.md }}>{fill} left</Text>
      )}
    </View>
  );
};

export default HalfCircularProgressGaugeComponent;
