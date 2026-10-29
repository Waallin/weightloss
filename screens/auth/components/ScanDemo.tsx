import React from "react";
import { Image, Text, View } from "react-native";
import { MotiView } from "moti";
import { ReduceMotion } from "react-native-reanimated";
import { colors } from "../../../constants/colors";
import { globalStyles } from "../../../constants/globalStyles";
import { typography } from "../../../constants/texts";
import { calculateFoodPoints } from "../../../services/dietPoints";

// banana.png is 1200x896; the frame uses its proportions so the photo fills it without a visible box
const PHOTO_ASPECT = 1200 / 896;
const CARD_PADDING = 14;
const CORNER = 22;
const CORNER_THICKNESS = 3;

const Corner = ({
  top,
  left,
}: {
  top?: boolean;
  left?: boolean;
}) => (
  <View
    style={{
      position: "absolute",
      width: CORNER,
      height: CORNER,
      top: top ? 10 : undefined,
      bottom: top ? undefined : 10,
      left: left ? 10 : undefined,
      right: left ? undefined : 10,
      borderColor: colors.ui.primary,
      borderTopWidth: top ? CORNER_THICKNESS : 0,
      borderBottomWidth: top ? 0 : CORNER_THICKNESS,
      borderLeftWidth: left ? CORNER_THICKNESS : 0,
      borderRightWidth: left ? 0 : CORNER_THICKNESS,
      borderRadius: 4,
    }}
  />
);

// A medium banana, scored with the same formula the real scan uses
const BANANA_POINTS = calculateFoodPoints({
  calories: 105,
  protein: 1.3,
  fiber: 3.1,
  estimatedGrams: 118,
});

/** Mini version of the scan result, shown in onboarding to demonstrate "snap a photo" */
const ScanDemo: React.FC<{ width: number }> = ({ width }) => {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 14, scale: 0.97 }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      transition={{ type: "timing", duration: 450, reduceMotion: ReduceMotion.Never }}
      style={{
        width,
        backgroundColor: colors.ui.white,
        borderRadius: 24,
        padding: CARD_PADDING,
        ...globalStyles.shadow,
        shadowOpacity: 0.08,
      }}
    >
      <View
        style={{
          height: (width - CARD_PADDING * 2) / PHOTO_ASPECT,
          borderRadius: 16,
          overflow: "hidden",
          backgroundColor: colors.ui.secondaryBackground,
        }}
      >
        <Image
          source={require("../../../assets/banana.png")}
          resizeMode="cover"
          style={{ width: "100%", height: "100%" }}
        />
        <Corner top left />
        <Corner top />
        <Corner left />
        <Corner />
      </View>

      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{
          type: "timing",
          duration: 420,
          delay: 700,
          reduceMotion: ReduceMotion.Never,
        }}
        style={{
          marginTop: 14,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text style={{ ...typography.cardTitle, fontSize: 17, color: colors.text.primary }}>
            Banana
          </Text>
          <Text style={{ ...typography.body, fontSize: 14, color: colors.goals.muted }}>
            Scanned in a second
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "baseline", gap: 4 }}>
          <Text style={{ ...typography.displayNumeric, fontSize: 40, lineHeight: 46, color: colors.goals.eat }}>
            {BANANA_POINTS}
          </Text>
          <Text style={{ ...typography.cardTitle, fontSize: 15, color: colors.goals.eat }}>
            {BANANA_POINTS === 1 ? "point" : "points"}
          </Text>
        </View>
      </MotiView>
    </MotiView>
  );
};

export default ScanDemo;
