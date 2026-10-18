import React from "react";
import { View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../constants/colors";

interface GoalRingProps {
  /** 0–100 */
  fill: number;
  color: string;
  size?: number;
  width?: number;
  trackColor?: string;
  done?: boolean;
  doneColor?: string;
  children?: React.ReactNode;
}

const GoalRing: React.FC<GoalRingProps> = ({
  fill,
  color,
  size = 116,
  width = 10,
  trackColor = colors.goals.ringTrack,
  done = false,
  doneColor,
  children,
}) => {
  const clamped = Math.min(Math.max(fill, 0), 100);

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <AnimatedCircularProgress
        style={{ position: "absolute" }}
        size={size}
        width={width}
        fill={clamped}
        tintColor={color}
        backgroundColor={trackColor}
        rotation={0}
        lineCap="round"
        duration={900}
      />
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        {children}
      </View>
      {done ? (
        <View
          style={{
            position: "absolute",
            right: 2,
            top: 2,
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: doneColor ?? color,
            borderWidth: 3,
            borderColor: colors.ui.white,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="checkmark" size={16} color={colors.ui.white} />
        </View>
      ) : null}
    </View>
  );
};

export default GoalRing;
