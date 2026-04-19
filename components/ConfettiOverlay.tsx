import React, { useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  ReduceMotion,
} from "react-native-reanimated";
import { confettiPalette } from "../constants/colors";

const PIECE_COUNT = 52;

export interface ConfettiOverlayProps {
  /** When true, confetti is shown until pieces finish (or until hidden). */
  visible?: boolean;
  /** Bump this on each celebration so a new burst runs even if `visible` was already true. */
  burstNonce?: number;
  /** Called once after the last piece has finished (optional). */
  onComplete?: () => void;
}

interface PieceConfig {
  id: number;
  startX: number;
  delay: number;
  duration: number;
  drift: number;
  rotationTo: number;
  wobblePhase: number;
  color: string;
  width: number;
  height: number;
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function pickColor(): string {
  const i = Math.floor(Math.random() * confettiPalette.length);
  return confettiPalette[i] ?? confettiPalette[0] ?? "#FFD93D";
}

function generatePieces(screenWidth: number): PieceConfig[] {
  return Array.from({ length: PIECE_COUNT }, (_, id) => ({
    id,
    startX: randomBetween(-8, screenWidth + 8),
    delay: randomBetween(0, 1100),
    duration: randomBetween(2400, 4200),
    drift: randomBetween(-90, 90),
    rotationTo: randomBetween(-640, 640),
    wobblePhase: randomBetween(0, Math.PI * 2),
    color: pickColor(),
    width: randomBetween(6, 11),
    height: randomBetween(8, 16),
  }));
}

const ConfettiPiece = React.memo(function ConfettiPiece({
  config,
  screenHeight,
  active,
}: {
  config: PieceConfig;
  screenHeight: number;
  active: boolean;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (!active) {
      progress.value = 0;
      return;
    }
    progress.value = 0;
    progress.value = withDelay(
      config.delay,
      withTiming(1, {
        duration: config.duration,
        easing: Easing.out(Easing.quad),
        reduceMotion: ReduceMotion.Never,
      }),
    );
  }, [active, config.delay, config.duration, config.id, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const t = progress.value;
    const y = interpolate(t, [0, 1], [-50, screenHeight + 80]);
    const wobble =
      Math.sin(config.wobblePhase + t * Math.PI * 5) * (16 + config.width);
    const x = config.startX + config.drift * t + wobble;
    const rotateDeg = interpolate(t, [0, 1], [0, config.rotationTo]);
    return {
      transform: [
        { translateX: x },
        { translateY: y },
        { rotate: `${rotateDeg}deg` },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: 0,
          top: 0,
          width: config.width,
          height: config.height,
          backgroundColor: config.color,
          borderRadius: 2,
        },
        animatedStyle,
      ]}
    />
  );
});

const ConfettiOverlay: React.FC<ConfettiOverlayProps> = ({
  visible = false,
  burstNonce = 0,
  onComplete,
}) => {
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  const [burstKey, setBurstKey] = useState(0);

  useEffect(() => {
    if (visible) {
      setBurstKey((k) => k + 1);
    }
  }, [visible, burstNonce]);

  const pieces = useMemo(
    () => generatePieces(screenWidth),
    [screenWidth, burstKey],
  );

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!visible || !onCompleteRef.current) {
      return;
    }
    const end =
      Math.max(...pieces.map((p) => p.delay + p.duration), 0) + 200;
    const timer = setTimeout(() => {
      onCompleteRef.current?.();
    }, end);
    return () => clearTimeout(timer);
  }, [visible, burstKey, pieces]);

  if (!visible) {
    return null;
  }

  return (
    <View
      pointerEvents="none"
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
      }}
    >
      {pieces.map((config) => (
        <ConfettiPiece
          key={`${burstKey}-${config.id}`}
          config={config}
          screenHeight={screenHeight}
          active={visible}
        />
      ))}
    </View>
  );
};

export default ConfettiOverlay;