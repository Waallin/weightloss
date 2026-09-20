import React, { useEffect, useRef } from "react";
import { Animated as RNAnimated, Easing, Text, useWindowDimensions, View } from "react-native";
import Animated, { useAnimatedStyle, type SharedValue } from "react-native-reanimated";
import Svg, { Circle, G, Path, Polygon } from "react-native-svg";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { colors, confettiPalette } from "../../../constants/colors";
import { fonts } from "../../../constants/fonts";
import { typography } from "../../../constants/texts";

export const WHEEL_SEGMENT_COUNT = 5;
export const WHEEL_SEGMENT_ANGLE = 360 / WHEEL_SEGMENT_COUNT;

const WHEEL_SEGMENTS = [
  {
    id: 0,
    label: "1 Month",
    color: colors.confetti.coral,
    textColor: colors.ui.white,
    bestPrize: true,
  },
  {
    label: "3 Days",
    color: "#FFC53D",
    textColor: colors.text.primary,
  },
  {
    label: "5 Days",
    color: "#22C55E",
    textColor: colors.ui.white,
  },
  {
    label: "7 Days",
    color: colors.confetti.sky,
    textColor: colors.ui.white,
  },
  {
    label: "14 Days",
    color: "#A78BFA",
    textColor: colors.ui.white,
  },
];

const SPARKS = [
  { x: 0.06, y: 0.2, rotate: "28deg", w: 9, h: 3, color: 0 },
  { x: 0.9, y: 0.16, rotate: "-22deg", w: 8, h: 3, color: 1 },
  { x: 0.02, y: 0.55, rotate: "12deg", w: 7, h: 3, color: 2 },
  { x: 0.94, y: 0.48, rotate: "-35deg", w: 8, h: 3, color: 3 },
  { x: 0.12, y: 0.86, rotate: "40deg", w: 6, h: 3, color: 4 },
  { x: 0.84, y: 0.84, rotate: "-14deg", w: 7, h: 3, color: 5 },
];

const polarToCartesian = (
  cx: number,
  cy: number,
  r: number,
  angleDeg: number,
) => {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
};

const describeSegment = (
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
) => {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
};

const TrialSpinWheel: React.FC<{
  spinAnim: SharedValue<number>;
  hasSpun: boolean;
}> = ({ spinAnim, hasSpun }) => {
  const { width, height } = useWindowDimensions();
  const size = Math.round(
    Math.min(330, Math.max(260, Math.min(width - 48, height * 0.38))),
  );
  const radius = size / 2;
  const rim = 8;
  const hubSize = Math.round(size * 0.26);
  const labelBox = Math.round(size * 0.34);
  const outer = size + rim * 2;
  const glow = useRef(new RNAnimated.Value(0.4)).current;

  useEffect(() => {
    if (!hasSpun) {
      glow.setValue(0);
      return;
    }
    glow.setValue(0.45);
    const pulse = RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(glow, {
          toValue: 0.9,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        RNAnimated.timing(glow, {
          toValue: 0.35,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [hasSpun, glow]);

  const wheelStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spinAnim.value}deg` }],
  }));
  const labelStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${-spinAnim.value}deg` }],
  }));

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel="Prize wheel with free trial lengths"
      style={{ alignItems: "center", justifyContent: "center" }}
    >
      <View style={{ width: outer + 28, height: outer + 36, alignItems: "center" }}>
        {SPARKS.map((spark, index) => (
          <View
            key={index}
            pointerEvents="none"
            style={{
              position: "absolute",
              left: spark.x * (outer + 28),
              top: spark.y * (outer + 36),
              width: spark.w,
              height: spark.h,
              borderRadius: 2,
              backgroundColor: confettiPalette[spark.color],
              transform: [{ rotate: spark.rotate }],
              opacity: 0.85,
            }}
          />
        ))}

        <View
          style={{
            zIndex: 3,
            marginBottom: -12,
            shadowColor: colors.confetti.violet,
            shadowOpacity: 0.28,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
            elevation: 6,
          }}
        >
          <Svg width={28} height={22}>
            <Polygon
              points="14,20 1.5,2 26.5,2"
              fill={colors.confetti.violet}
              stroke={colors.ui.white}
              strokeWidth={2.5}
              strokeLinejoin="round"
            />
          </Svg>
        </View>

        <View style={{ alignItems: "center", justifyContent: "center" }}>
          {hasSpun ? (
            <RNAnimated.View
              pointerEvents="none"
              style={{
                position: "absolute",
                width: outer + 14,
                height: outer + 14,
                borderRadius: (outer + 14) / 2,
                borderWidth: 3,
                borderColor: "rgba(255,107,107,0.55)",
                opacity: glow,
              }}
            />
          ) : null}

          <View
            style={{
              width: outer,
              height: outer,
              borderRadius: outer / 2,
              backgroundColor: colors.ui.white,
              padding: rim,
              shadowColor: colors.ui.shadow,
              shadowOpacity: hasSpun ? 0.22 : 0.12,
              shadowRadius: hasSpun ? 22 : 16,
              shadowOffset: { width: 0, height: 10 },
              elevation: 10,
            }}
          >
          <View style={{ width: size, height: size }}>
            <Animated.View
              style={[
                {
                  width: size,
                  height: size,
                },
                wheelStyle,
              ]}
            >
              <Svg width={size} height={size}>
                <G>
                  {WHEEL_SEGMENTS.map((segment, index) => {
                    const startAngle =
                      index * WHEEL_SEGMENT_ANGLE - WHEEL_SEGMENT_ANGLE / 2;
                    const endAngle = startAngle + WHEEL_SEGMENT_ANGLE;
                    return (
                      <Path
                        key={segment.label}
                        d={describeSegment(
                          radius,
                          radius,
                          radius - 1,
                          startAngle,
                          endAngle,
                        )}
                        fill={segment.color}
                        stroke={colors.ui.white}
                        strokeWidth={3}
                      />
                    );
                  })}
                  {hasSpun && (
                    <Path
                      d={describeSegment(
                        radius,
                        radius,
                        radius - 1,
                        -WHEEL_SEGMENT_ANGLE / 2,
                        WHEEL_SEGMENT_ANGLE / 2,
                      )}
                      fill="rgba(255,255,255,0.16)"
                      stroke={colors.ui.white}
                      strokeWidth={4}
                    />
                  )}
                  <Circle cx={radius} cy={radius} r={hubSize / 2 + 2} fill={colors.ui.white} />
                </G>
              </Svg>

              {WHEEL_SEGMENTS.map((segment, index) => {
                const midAngle = index * WHEEL_SEGMENT_ANGLE;
                const labelPos = polarToCartesian(
                  radius,
                  radius,
                  radius * 0.62,
                  midAngle,
                );
                return (
                  <Animated.View
                    key={segment.label}
                    pointerEvents="none"
                    style={[
                      {
                        position: "absolute",
                        left: labelPos.x - labelBox / 2,
                        top: labelPos.y - labelBox / 2,
                        width: labelBox,
                        height: labelBox,
                        alignItems: "center",
                        justifyContent: "center",
                      },
                      labelStyle,
                    ]}
                  >
                    {segment.bestPrize ? (
                      <MaterialCommunityIcons
                        name="crown"
                        size={Math.round(size * 0.055)}
                        color={colors.ui.white}
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name="gift-outline"
                        size={Math.round(size * 0.048)}
                        color={segment.textColor}
                      />
                    )}
                    <Text
                      style={{
                        fontFamily: fonts.primary.bold,
                        fontSize: Math.round(size * 0.042),
                        fontWeight: "700",
                        color: segment.textColor,
                        textAlign: "center",
                        marginTop: 1,
                      }}
                    >
                      {segment.label}
                    </Text>
                    {segment.bestPrize ? (
                      <Text
                        style={{
                          ...typography.captionSemiBold,
                          color: "rgba(255,255,255,0.92)",
                          letterSpacing: 0.6,
                          fontSize: 8,
                          marginTop: 1,
                        }}
                      >
                        BEST PRIZE
                      </Text>
                    ) : null}
                  </Animated.View>
                );
              })}
            </Animated.View>

            <View
              style={{
                position: "absolute",
                top: (size - hubSize) / 2,
                left: (size - hubSize) / 2,
                width: hubSize,
                height: hubSize,
                borderRadius: hubSize / 2,
                backgroundColor: colors.ui.white,
                alignItems: "center",
                justifyContent: "center",
                shadowColor: colors.ui.shadow,
                shadowOpacity: 0.14,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 3 },
                elevation: 5,
                zIndex: 4,
              }}
            >
              <MaterialCommunityIcons
                name="gift"
                size={Math.round(hubSize * 0.46)}
                color={colors.confetti.violet}
              />
            </View>
          </View>
        </View>
        </View>
      </View>
    </View>
  );
};

export default TrialSpinWheel;
