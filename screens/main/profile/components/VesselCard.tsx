import {
  Image,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import React from "react";
import { colors } from "../../../../constants/colors";
import { spacing } from "../../../../constants/spacing";

const VesselCard = ({ vessel }: { vessel: any }) => {
  const { width } = useWindowDimensions();
  return (
    <View
      style={{
        width: width - spacing.md * 10,
        height: 160,
        borderRadius: spacing.borderRadius,
        overflow: "hidden",
      }}
    >
      <Image
        source={vessel.image}
        style={{ flex: 1, width: "100%", height: 200 }}
      />
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          padding: 10,
        }}
      >
        <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
          {vessel.name}
        </Text>
        <Text style={{ color: "white" }}>{vessel.type}</Text>
      </View>
    </View>
  );
};

export default VesselCard;

const styles = StyleSheet.create({});
