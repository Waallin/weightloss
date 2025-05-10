import { StyleSheet, View, Dimensions } from "react-native";
import React from "react";
import Svg, { Path } from "react-native-svg";

const WavesBackground = () => {
  const { width, height } = Dimensions.get("window");

  return (
    <View style={styles.container}>
      <Svg
        height={height}
        width={width}
        viewBox={`0 0 ${width} ${height}`}
        style={styles.wavesContainer}
      >
        <Path
          d={`
            M0 ${height * 0.15}
            C ${width * 0.15} ${height * 0.1}
            ${width * 0.85} ${height * 0.2}
            ${width} ${height * 0.15}
            L${width} ${height}
            L0 ${height}
            Z
          `}
          fill="rgba(255, 255, 255, 0.03)"
        />
        <Path
          d={`
            M0 ${height * 0.25}
            C ${width * 0.25} ${height * 0.2}
            ${width * 0.75} ${height * 0.3}
            ${width} ${height * 0.25}
            L${width} ${height}
            L0 ${height}
            Z
          `}
          fill="rgba(255, 255, 255, 0.05)"
        />
        <Path
          d={`
            M0 ${height * 0.3}
            C ${width * 0.2} ${height * 0.25}
            ${width * 0.8} ${height * 0.35}
            ${width} ${height * 0.3}
            L${width} ${height}
            L0 ${height}
            Z
          `}
          fill="rgba(18, 48, 82, 0.15)"
        />
        <Path
          d={`
            M0 ${height * 0.4}
            C ${width * 0.3} ${height * 0.35}
            ${width * 0.7} ${height * 0.45}
            ${width} ${height * 0.4}
            L${width} ${height}
            L0 ${height}
            Z
          `}
          fill="rgba(18, 48, 82, 0.2)"
        />
        <Path
          d={`
            M0 ${height * 0.5}
            C ${width * 0.25} ${height * 0.45}
            ${width * 0.75} ${height * 0.55}
            ${width} ${height * 0.5}
            L${width} ${height}
            L0 ${height}
            Z
          `}
          fill="rgba(18, 48, 82, 0.25)"
        />
      </Svg>
    </View>
  );
};

export default WavesBackground;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#123052",
  },
  wavesContainer: {
    position: "absolute",
    bottom: 0,
  },
});
