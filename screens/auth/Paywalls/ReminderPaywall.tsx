import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, Linking, Text, TouchableOpacity, View } from "react-native";
import PrimaryButtonComponent from "../../../components/PrimaryButtonComponent";
import { textStyles } from "../../../constants/texts";
import { spacing } from "../../../constants/spacing";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { colors } from "../../../constants/colors";
import Svg, { Circle, G, Path, Text as SvgText } from "react-native-svg";
import useConfettiStore from "../../../stores/useConfettiStore";
import * as haptics from "expo-haptics";
import { trackMixpanelEvent } from "../../../services/mixpanel";
const WHEEL_SIZE = 260;
const WHEEL_RADIUS = WHEEL_SIZE / 2;
const FULL_TURNS = 8;
const SEGMENT_COUNT = 5;
const SEGMENT_ANGLE = 360 / SEGMENT_COUNT;
const WINNING_INDEX = 0;
const SPIN_DURATION_MS = 6500;
import { useNavigation } from "@react-navigation/native";
import useConfigStore from "../../../stores/useConfigStore";
const WHEEL_SEGMENTS = [
  { id: 0, label: "⭐ 1 Month", color: colors.ui.primary },
  { label: "3 Days", color: "#E5E7EB" },
  { label: "5 Days", color: "#A7F3D0" },
  { label: "7 Days", color: "#6EE7B7" },
  { label: "14 Days", color: "#34D399" },
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

const ReminderPaywall: React.FC<{ onCTAPress: (plan: "annual") => void, onRestorePurchases: () => void }> = ({
  onCTAPress,
  onRestorePurchases,
}) => {
  const [activeScreen, setActiveScreen] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const spinAnim = useRef(new Animated.Value(0)).current;
  const ctaPulse = useRef(new Animated.Value(1)).current;
  const { setVisibleConfetti } = useConfettiStore();
  const { config } = useConfigStore();
  const [showSpinner] = useState(config?.showSpinner);
  const navigation = useNavigation();
  useEffect(() => {
    if (!hasSpun || activeScreen !== 2) {
      ctaPulse.setValue(1);
      return;
    }
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(ctaPulse, {
          toValue: 1.04,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(ctaPulse, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [hasSpun, activeScreen, ctaPulse]);

  const handleCTAPress = () => {
    haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
    if (activeScreen === 0) {
      
      setActiveScreen(showSpinner ? 2 : 3);
    } else if (activeScreen === 1) {
      setActiveScreen(showSpinner ? 2 : 3);
    } else if (activeScreen === 2) {
      hasSpun ? (setActiveScreen(3), setHasSpun(false)) : handleSpin();
    } else {
      onCTAPress("annual");
    }
  };

  const renderCTAText = () => {
    switch (activeScreen) {
      case 0:
        return "Try for $0.00";
      case 1:
        return "Continue for FREE";
      case 2:
        return hasSpun ? "Claim 1 month free" : "Spin the wheel";
      case 3:

      return "Start FREE Trial";
      default:
        return "";
    }
  };

  const handleRestorePurchases = () => {
    onRestorePurchases();
  };
  const handleSpin = async () => {
    if (isSpinning || hasSpun) return;

    await trackMixpanelEvent(
      "paywall_spin_wheel",
    );

    setIsSpinning(true);
    // Continuous ease-out: crawl through previous segment, land at start of "1 month".
    const winAngle = FULL_TURNS * 360 - SEGMENT_ANGLE / 2 + 8;

    spinAnim.setValue(0);

    // Native-driven spin can't drive JS listeners reliably — schedule ticks that thin out.
    const hapticTimers: ReturnType<typeof setTimeout>[] = [];
    let elapsed = 0;
    while (elapsed < SPIN_DURATION_MS - 250) {
      const progress = elapsed / SPIN_DURATION_MS;
      elapsed += 50 + progress * progress * 320;
      const delay = elapsed;
      hapticTimers.push(
        setTimeout(() => {
          void haptics.selectionAsync();
        }, delay),
      );
    }

    Animated.timing(spinAnim, {
      toValue: winAngle,
      duration: SPIN_DURATION_MS,
      easing: Easing.bezier(0.12, 0.75, 0.08, 1),
      useNativeDriver: true,
    }).start(() => {
      hapticTimers.forEach(clearTimeout);
      setIsSpinning(false);
      setHasSpun(true);
      setVisibleConfetti(true);
      void haptics.notificationAsync(haptics.NotificationFeedbackType.Success);
    });
  };

  const spinWheel = () => {
    const rotate = spinAnim.interpolate({
      inputRange: [0, 360],
      outputRange: ["0deg", "360deg"],
    });

    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <View style={{ alignItems: "center" }}>
          {/* Pointer */}
          <View
            style={{
              width: 0,
              height: 0,
              borderLeftWidth: 12,
              borderRightWidth: 12,
              borderTopWidth: 20,
              borderLeftColor: "transparent",
              borderRightColor: "transparent",
              borderTopColor: colors.text.primary,
              zIndex: 2,
              marginBottom: -6,
            }}
          />

          <Animated.View
            style={{
              width: WHEEL_SIZE,
              height: WHEEL_SIZE,
              transform: [{ rotate }],
            }}
          >
            <Svg width={WHEEL_SIZE} height={WHEEL_SIZE}>
              <G>
                {WHEEL_SEGMENTS.map((segment, index) => {
                  const startAngle = index * SEGMENT_ANGLE - SEGMENT_ANGLE / 2;
                  const endAngle = startAngle + SEGMENT_ANGLE;
                  const midAngle = startAngle + SEGMENT_ANGLE / 2;
                  const labelPos = polarToCartesian(
                    WHEEL_RADIUS,
                    WHEEL_RADIUS,
                    WHEEL_RADIUS * 0.58,
                    midAngle,
                  );

                  return (
                    <G key={segment.label}>
                      <Path
                        d={describeSegment(
                          WHEEL_RADIUS,
                          WHEEL_RADIUS,
                          WHEEL_RADIUS - 2,
                          startAngle,
                          endAngle,
                        )}
                        fill={segment.color}
                        stroke={colors.ui.white}
                        strokeWidth={2}
                      />
                      <SvgText
                        x={labelPos.x}
                        y={labelPos.y}
                        fill={colors.text.primary}
                        fontSize={12}
                        fontWeight="700"
                        textAnchor="middle"
                        alignmentBaseline="middle"
                      >
                        {segment.label}
                      </SvgText>
                    </G>
                  );
                })}
                <Circle
                  cx={WHEEL_RADIUS}
                  cy={WHEEL_RADIUS}
                  r={28}
                  fill={colors.ui.white}
                  stroke={colors.ui.cardBorder}
                  strokeWidth={2}
                />
              </G>
            </Svg>
          </Animated.View>
        </View>
      </View>
    );
  };

  const renderBelowButtonText = () => {

    return "No commitments. Cancel anytime.";
  };

  const renderFirstScreen = () => {
    return (
      <View
        style={{
          marginTop: spacing.xxl,
          flex: 1,
          justifyContent: "center",
          paddingHorizontal: spacing.md,
        }}
      >
        <Text style={{ ...textStyles.onboardingTitle, textAlign: "center" }}>
          We want you to try Kudoo for{" "}
          <Text style={{ color: colors.ui.primary }}>free</Text>
        </Text>

        <View
          style={{
            marginTop: spacing.xl,
            padding: spacing.lg,
            backgroundColor: colors.ui.componentBackground,
            borderWidth: 1,
            borderColor: colors.ui.cardBorder,
            borderRadius: spacing.borderRadius + 4,
            alignSelf: "stretch",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 18,
              letterSpacing: 2,
            }}
          >
            ⭐⭐⭐⭐⭐
          </Text>
          <Text
            style={{
              ...textStyles.onboardingBody,
              fontStyle: "italic",
              textAlign: "center",
              marginTop: spacing.sm,
              color: colors.text.secondary,
              lineHeight: 22,
            }}
          >
            “I only planned to try the free trail. Three months later I’m down
            34 lbs.”
          </Text>
        </View>
      </View>
    );
  };

  const renderSecondScreen = () => {
    return (
      <View
        style={{
          marginTop: spacing.xxl,
          flex: 1,
          paddingHorizontal: spacing.md,
        }}
      >
        <Text style={{ ...textStyles.onboardingTitle, textAlign: "center" }}>
          We'll send you a reminder before your trial ends.
        </Text>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            transform: [{ rotate: "-18deg" }],
          }}
        >
          <View>
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: "red",
                position: "absolute",
                zIndex: 100,
                alignItems: "center",
                justifyContent: "center",
                top: 15,
                right: 15,
              }}
            >
              <Text
                style={{
                  ...textStyles.onboardingBody,
                  fontWeight: "700",
                  color: "white",
                  textAlign: "center",
                  fontSize: 16,
                }}
              >
                1
              </Text>
            </View>
            <MaterialCommunityIcons name="bell" size={100} color={"#DBE6E7"} />
          </View>
        </View>
      </View>
    );
  };

  const renderThirdScreen = () => {
    return (
      <View
        style={{
          marginTop: spacing.xxl,
          flex: 1,
          paddingHorizontal: spacing.md,
        }}
      >
        <Text style={{ ...textStyles.onboardingTitle, textAlign: "center" }}>
          Let’s see how long your FREE trial will be!
        </Text>
        {spinWheel()}
      </View>
    );
  };

  const renderTimelineStep = (step: any, isLast: any) => {
    return (
      <View style={{ flexDirection: "row", gap: 16 }}>
        <View style={{ alignItems: "center", width: 40 }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: step.iconBg,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialCommunityIcons name={step.icon} size={20} color="white" />
          </View>
          {!isLast && (
            <View
              style={{
                width: 3,
                flex: 1,
                minHeight: 56,
                backgroundColor: step.lineColor,
                marginTop: 4,
                borderRadius: 999,
              }}
            />
          )}
        </View>
        <View
          style={{ flex: 1, paddingBottom: isLast ? 0 : 20, paddingTop: 2 }}
        >
          <View
            style={
              step.highlight
                ? {
                    backgroundColor: colors.ui.foodPointsChipBackground,
                    borderRadius: spacing.borderRadius,
                    paddingVertical: spacing.sm,
                    paddingHorizontal: spacing.sm + 4,
                  }
                : undefined
            }
          >
            <Text
              style={{
                ...textStyles.onboardingBody,
                fontWeight: "700",
                color: colors.text.primary,
              }}
            >
              {step.title}
            </Text>
            {step.highlight ? (
              <Text
                style={{
                  ...textStyles.onboardingBody,
                  color: colors.text.secondary,
                  marginTop: 4,
                }}
              >
                <Text
                  style={{
                    fontWeight: "700",
                    fontSize: 16,
                    color: colors.ui.primary,
                  }}
                >
                  97%
                </Text>{" "}
                of users start seeing results.
              </Text>
            ) : (
              <Text
                style={{
                  ...textStyles.onboardingBody,
                  color: colors.text.secondary,
                  marginTop: 4,
                }}
              >
                {step.subtitle}
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderFourthScreen = () => {
    const steps = [
      {
        title: "Today",
        subtitle: "Unlock all Kudoo features and start your journey.",
        icon: "lock-open-outline",
        iconBg: colors.ui.primary,
        lineColor: colors.ui.primary,
      },
      {
        title: "In 7 Days",
        subtitle: "97% of users start seeing results.",
        icon: "trending-up",
        iconBg: colors.ui.primary,
        lineColor: "#D1D5DB",
        highlight: true,
      },
      {
        title: "In 30 Days — Only $2.98 a week",
        subtitle: "Billed annually • $154.99",
        icon: "crown-outline",
        iconBg: "#111827",
      },
    ];

    return (
      <View
        style={{
          marginTop: spacing.xl,
          flex: 1,
          paddingHorizontal: spacing.md,
        }}
      >
        <View
          style={{
            alignSelf: "center",
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.sm,
            paddingVertical: spacing.xs + 2,
            paddingHorizontal: spacing.md,
            backgroundColor: colors.ui.componentBackground,
            borderWidth: 1,
            borderColor: colors.ui.cardBorder,
            borderRadius: spacing.rounded,
            marginBottom: spacing.md,
          }}
        >
          <Text style={{ fontSize: 12, letterSpacing: 1 }}>⭐⭐⭐⭐⭐</Text>
          <Text
            style={{
              ...textStyles.onboardingBody,
              fontWeight: "700",
              color: colors.text.primary,
            }}
          >
            4.9 · 5,000+ reviews
          </Text>
        </View>

        <Text
          style={{
            ...textStyles.onboardingTitle,
            textAlign: "center",
            lineHeight: 32,
            paddingHorizontal: spacing.sm,
          }}
        >
          Unlock your full potential with Kudoo
        </Text>

        <View
          style={{
            marginTop: spacing.lg,
            gap: spacing.sm,
            alignSelf: "center",
            alignItems: "flex-start",
          }}
        >
          {[
            "Personalized insights",
            "Track your progress",
            "No calorie counting",
          ].map((benefit) => (
            <View
              key={benefit}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.sm,
              }}
            >
              <MaterialCommunityIcons
                name="check-circle"
                size={18}
                color={colors.ui.primary}
              />
              <Text
                style={{
                  ...textStyles.onboardingBody,
                  fontWeight: "500",
                  color: colors.text.primary,
                }}
              >
                {benefit}
              </Text>
            </View>
          ))}
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: "center",
            paddingHorizontal: spacing.lg,
          }}
        >
          {steps.map((step, index) => (
            <View key={index}>
              {renderTimelineStep(step, index === steps.length - 1)}
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderFooter = () => {
    return (
      <View
        style={{
          marginBottom: spacing.ctaButtonBottomPadding,
          gap: spacing.componentGap,
          paddingHorizontal: spacing.md,
        }}
      >
        <Text
          style={{
            ...textStyles.primary,
            textAlign: "center",
            fontWeight: "bold",
            color: colors.ui.primary,
          }}
        >
          {hasSpun && activeScreen === 2
            ? "🎉 You unlocked 1 month FREE"
            : "✓ Nothing charged today"}
        </Text>
        <Animated.View style={{ transform: [{ scale: ctaPulse }] }}>
          <PrimaryButtonComponent
            title={renderCTAText()}
            onPress={handleCTAPress}
          />
        </Animated.View>

        <Text style={{ ...textStyles.onboardingBody, textAlign: "center" }}>
          {renderBelowButtonText()}
        </Text>

        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <TouchableOpacity onPress={() => Linking.openURL("https://sites.google.com/view/privacypolicy--app/home")}>
            <Text style={{ ...textStyles.onboardingBody, textAlign: "center" }}>
              Privacy
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleRestorePurchases}>
            <Text style={{ ...textStyles.onboardingBody, textAlign: "center" }}>
              Restore Purchases
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL("https://sites.google.com/view/app--termsofuse/home")}>
            <Text style={{ ...textStyles.onboardingBody, textAlign: "center" }}>
              Terms
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderScreens = () => {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          {activeScreen === 0 && renderFirstScreen()}
          {activeScreen === 1 && renderSecondScreen()}
          {activeScreen === 2 && showSpinner && renderThirdScreen()}
          {activeScreen === 3 && renderFourthScreen()}
        </View>
        {renderFooter()}
      </View>
    );
  };

  return <View style={{ flex: 1 }}>{renderScreens()}</View>;
};

export default ReminderPaywall;
