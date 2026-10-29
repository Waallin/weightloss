import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { MotiView } from "moti";
import { ReduceMotion } from "react-native-reanimated";
import { colors } from "../../../constants/colors";
import { spacing } from "../../../constants/spacing";
import { typography } from "../../../constants/texts";

const TRACK_HEIGHT = 10;
const TRACK_COLOR = "#E8E8EE";

interface EndowedProgressBarProps {
  /** 0–1. Should start above zero: the user is credited for what they have already done. */
  progress: number;
  label: string;
}

/**
 * Progress bar built on the endowed progress effect: it never starts at 0%.
 * On first render it fills up from empty to its head start, so the user sees
 * they are already on their way before answering anything.
 */
const EndowedProgressBar: React.FC<EndowedProgressBarProps> = ({
  progress,
  label,
}) => {
  const [trackWidth, setTrackWidth] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), 350);
    return () => clearTimeout(timer);
  }, []);

  const clamped = Math.min(Math.max(progress, 0), 1);

  return (
    <View style={{ width: "100%", marginTop: spacing.md, gap: 8 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{ ...typography.bodySemiBold, fontSize: 14, color: colors.text.secondary }}
        >
          {label}
        </Text>
        <Text
          style={{ ...typography.bodySemiBold, fontSize: 14, color: colors.ui.primary }}
        >
          {Math.round(clamped * 100)}%
        </Text>
      </View>
      <View
        onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
        style={{
          height: TRACK_HEIGHT,
          borderRadius: TRACK_HEIGHT / 2,
          backgroundColor: TRACK_COLOR,
          overflow: "hidden",
        }}
      >
        <MotiView
          animate={{ width: started ? trackWidth * clamped : 0 }}
          transition={{
            type: "timing",
            duration: 700,
            reduceMotion: ReduceMotion.Never,
          }}
          style={{
            height: "100%",
            borderRadius: TRACK_HEIGHT / 2,
            backgroundColor: colors.ui.primary,
          }}
        />
      </View>
    </View>
  );
};

export default EndowedProgressBar;
