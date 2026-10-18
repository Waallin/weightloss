import { View } from "react-native";
import React, { useEffect } from "react";
import { MotiText, MotiView } from "moti";
import { useVideoPlayer, VideoView } from "expo-video";
import { colors } from "./constants/colors";
import { textStyles } from "./constants/texts";
import { ReduceMotion } from "react-native-reanimated";

interface CustomSplashScreenProps {
  onFinish?: () => void;
}

const CustomSplashScreen: React.FC<CustomSplashScreenProps> = ({
  onFinish,
}) => {
  const player = useVideoPlayer(require("./assets/mascot/doLess.mp4"), (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onFinish?.();
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [onFinish]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.ui.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: "timing", duration: 800, reduceMotion: ReduceMotion.Never }}
        style={{ alignItems: "center" }}
      >
        <View
          style={{
            width: 300,
            height: 300,
            borderRadius: 99999,
            overflow: "hidden",
            marginBottom: 20,
          }}
        >
          <VideoView
            player={player}
            contentFit="cover"
            nativeControls={false}
            style={{ width: 300, height: 300 }}
          />
        </View>
        <MotiText
          from={{ opacity: 0, translateY: 6 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 650, delay: 150, reduceMotion: ReduceMotion.Never }}
          style={{
            ...textStyles.onboardingTitle,
            textAlign: "center",
          }}
        >
          Kudoo
        </MotiText>
        <MotiText
          from={{ opacity: 0, translateY: 6 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 650, delay: 250, reduceMotion: ReduceMotion.Never }}
          style={{
            ...textStyles.onboardingBody,
            textAlign: "center",
            lineHeight: 22,
          }}
        >
          Do less, lose more
        </MotiText>
      </MotiView>
    </View>
  );
};

export default CustomSplashScreen;
