import { StyleSheet, Text, View, Animated } from "react-native";
import React, { useEffect, useRef } from "react";
import { colors } from "../constants/colors";
import { spacing } from "../constants/spacing";

const ProgressBar = ({ progress }: { progress: number }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const animatedPercentage = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animatedValue, {
        toValue: progress,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(animatedPercentage, {
        toValue: progress * 100,
        duration: 500,
        useNativeDriver: false,
      }),
    ]).start();
  }, [progress]);

  const returnColor = () => {
    if (progress === 1) {
      return colors.progressBar.oneHundred;
    } else if (progress >= 0.75) {
      return colors.progressBar.fifty;
    } else if (progress >= 0.5) {
      return colors.progressBar.twentyFive;
    }
    return colors.progressBar.zero;
  };

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Animated.View
          style={{
            flex: animatedValue,
            height: 10,
            backgroundColor: returnColor(),
            borderRadius: spacing.borderRadius,
          }}
        />
        <View
          style={{
            position: "absolute",
            right: 0,
            width: "100%",
            zIndex: -1,
            height: 10,
            backgroundColor: colors.ui.lightGrey,
            borderBottomRightRadius: spacing.borderRadius,
            borderTopRightRadius: spacing.borderRadius,
            borderBottomLeftRadius: spacing.borderRadius,
            borderTopLeftRadius: spacing.borderRadius,
          }}
        />
      </View>
      <Text
        style={{
          fontSize: 12,
          color: colors.ui.darkBlue,
          marginTop: spacing.sm,
          textAlign: "right",
        }}
      >
        {Math.round(progress * 100)}% completed
      </Text>
    </View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({});
