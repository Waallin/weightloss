import React, { useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PrimaryButtonComponent from "../../../components/PrimaryButtonComponent";
import { textStyles, typography } from "../../../constants/texts";
import { spacing } from "../../../constants/spacing";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { colors } from "../../../constants/colors";
import useConfettiStore from "../../../stores/useConfettiStore";
import * as haptics from "expo-haptics";
import * as StoreReview from "expo-store-review";
import { trackMixpanelEvent } from "../../../services/mixpanel";
import { useNavigation } from "@react-navigation/native";
import useConfigStore from "../../../stores/useConfigStore";
import TrialSpinWheel, { WHEEL_SEGMENT_ANGLE } from "./TrialSpinWheel";

const FULL_TURNS = 8;
const WINNING_INDEX = 0;
const SPIN_DURATION_MS = 6500;

const formatTrialEndDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date
    .toLocaleDateString("en-US", { month: "short", day: "numeric" })
    .toUpperCase();
};

const ReminderPaywall: React.FC<{
  product: any;
  onCTAPress: (plan: "annual") => void;
  onRestorePurchases: () => void;
}> = ({ product, onCTAPress, onRestorePurchases }) => {
  const { setVisibleConfetti } = useConfettiStore();
  const { config } = useConfigStore();
  const insets = useSafeAreaInsets();
  const [showSpinner] = useState(config?.showSpinner);
  const [activeScreen, setActiveScreen] = useState(config?.showSpinner ? 2 : 3);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const spinAnim = useRef(new Animated.Value(0)).current;
  const ctaPulse = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation();

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (mounted) setReduceMotion(enabled);
    });
    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduceMotion,
    );
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

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
    if (isSpinning) return;
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
        return `Try for ${product?.introPrice?.priceString ?? "0,00 kr"}`;
      case 1:
        return "Continue for FREE";
      case 2:
        return hasSpun ? "Claim My Free Month →" : "Spin the wheel  →";
      case 3:
        return "Claim My Free Month →";
      default:
        return "";
    }
  };

  const handleRestorePurchases = () => {
    onRestorePurchases();
  };

  const askForStoreReview = async () => {
    try {
      const isAvailable = await StoreReview.isAvailableAsync();
      if (isAvailable) {
        await StoreReview.requestReview();
      } else {
        console.log("Store review is not available on this device.");
      }
    } catch (error) {
      console.log("Error requesting store review:", error);
    }
  };

  const finishSpin = () => {
    setIsSpinning(false);
    setHasSpun(true);
    if (!reduceMotion) {
      setVisibleConfetti(true);
    }
    void haptics.notificationAsync(haptics.NotificationFeedbackType.Success);
    void askForStoreReview();
    void trackMixpanelEvent("paywall_spin_wheel");
  };

  const handleSpin = () => {
    if (isSpinning || hasSpun) return;

    setIsSpinning(true);
    // Continuous ease-out: crawl through previous segment, land at start of "1 month".
    const winAngle =
      FULL_TURNS * 360 -
      WINNING_INDEX * WHEEL_SEGMENT_ANGLE -
      WHEEL_SEGMENT_ANGLE / 2 +
      8;

    spinAnim.setValue(0);

    if (reduceMotion) {
      spinAnim.setValue(winAngle);
      finishSpin();
      return;
    }

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
      easing: Easing.bezier(0.08, 0.9, 0.12, 1),
      useNativeDriver: true,
    }).start(() => {
      hapticTimers.forEach(clearTimeout);
      finishSpin();
    });
  };

  const periodLabel = product?.subscriptionPeriod === "P1Y" ? "year" : "month";

  const renderBelowButtonText = () => {
    return `30-day free trial — then ${product?.priceString ?? ""}/${product?.subscriptionPeriod === "P1Y" ? "year" : "month"}`;
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
          flex: 1,
          paddingTop: insets.top + spacing.sm,
          paddingHorizontal: spacing.md,
          paddingBottom: spacing.sm,
        }}
      >
        <View
          accessible
          accessibilityLabel="Your free trial"
          style={{
            alignSelf: "center",
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            backgroundColor: colors.ui.iconContainer,
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: spacing.rounded,
            marginBottom: spacing.md,
          }}
        >
          <MaterialCommunityIcons
            name="gift"
            size={14}
            color={colors.confetti.violet}
          />
          <Text
            style={{
              ...textStyles.onboardingBody,
              fontWeight: "700",
              color: colors.text.primary,
              letterSpacing: 1.2,
            }}
          >
            YOUR FREE TRIAL
          </Text>
        </View>

        <Text
          style={{
            ...textStyles.onboardingTitle,
            textAlign: "center",
            lineHeight: 32,
          }}
        >
          Let’s see how long{"\n"}your{" "}
          <Text style={{ color: colors.ui.primary }}>free</Text> trial will be!
        </Text>

        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            marginVertical: spacing.md,
          }}
        >
          <TrialSpinWheel spinAnim={spinAnim} hasSpun={hasSpun} />
        </View>

        <View
          accessible
          accessibilityLabel="Nothing charged today. You can cancel anytime before your trial ends."
          style={{
            backgroundColor: colors.ui.listRowIconBackground,
            borderRadius: 16,
            paddingVertical: spacing.md,
            paddingHorizontal: spacing.md,
            alignItems: "center",
            marginBottom: spacing.sm,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
          >
            <MaterialCommunityIcons
              name="check-circle"
              size={18}
              color={colors.ui.listRowIconTint}
            />
            <Text
              style={{
                ...textStyles.onboardingBody,
                fontWeight: "700",
                color: colors.text.primary,
              }}
            >
              Nothing charged today
            </Text>
          </View>
          <Text
            style={{
              ...textStyles.onboardingBody,
              color: colors.text.secondary,
              textAlign: "center",
              marginTop: 4,
            }}
          >
            You can cancel anytime before your trial ends.
          </Text>
        </View>
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
    const todayPrice = product?.introPrice?.priceString ?? "$0.00";
    const steps = [
      {
        title: `TODAY — ${todayPrice}`,
        subtitle: "Full access unlocked",
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
        title: `${formatTrialEndDate()} — Only ${product?.pricePerWeekString ?? ""} a week`,
        subtitle: "Billed annually",
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
          accessible
          accessibilityLabel="Your reward"
          style={{
            alignSelf: "center",
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            backgroundColor: colors.ui.iconContainer,
            paddingVertical: 6,
            paddingHorizontal: 12,
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
              letterSpacing: 1.2,
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
          Your <Text style={{ color: colors.ui.primary }}>free</Text> month is ready
     
        </Text>
        <Text
          style={{
            ...textStyles.onboardingBody,
            textAlign: "center",
            color: colors.text.secondary,
            marginTop: spacing.sm,
            paddingHorizontal: spacing.sm,
          }}
        >
          Try everything in Kudoo free for the next 30 days.
        </Text>
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

  const renderLegalLinks = (muted: boolean) => {
    const linkStyle = {
      ...textStyles.onboardingBody,
      textAlign: "center" as const,
      color: muted ? colors.text.secondary : colors.text.primary,
      fontSize: muted ? 12 : undefined,
    };
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <TouchableOpacity
          accessibilityRole="link"
          accessibilityLabel="Privacy"
          onPress={() =>
            Linking.openURL(
              "https://sites.google.com/view/privacypolicy--app/home",
            )
          }
        >
          <Text style={linkStyle}>Privacy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Restore Purchases"
          onPress={handleRestorePurchases}
        >
          <Text style={linkStyle}>Restore Purchases</Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityRole="link"
          accessibilityLabel="Terms"
          onPress={() =>
            Linking.openURL(
              "https://sites.google.com/view/app--termsofuse/home",
            )
          }
        >
          <Text style={linkStyle}>Terms</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderFooter = () => {
    if (activeScreen === 0 || activeScreen === 1) {
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
            ✓ Nothing charged today
          </Text>
          <Animated.View style={{ transform: [{ scale: ctaPulse }] }}>
            <PrimaryButtonComponent
              title={renderCTAText()}
              onPress={handleCTAPress}
            />
          </Animated.View>

          {renderLegalLinks(false)}
        </View>
      );
    }

    const aboveButtonText =
      activeScreen === 3 ? "✓ Nothing charged today" : null;

    return (
      <View
        style={{
          paddingBottom: Math.max(insets.bottom, spacing.md),
          gap: spacing.sm,
          paddingHorizontal: spacing.md,
        }}
      >
        {aboveButtonText ? (
          <Text
            style={{
              ...textStyles.primary,
              textAlign: "center",
              fontWeight: "bold",
              color: colors.ui.primary,
            }}
          >
            {aboveButtonText}
          </Text>
        ) : null}
        <Animated.View style={{ transform: [{ scale: ctaPulse }] }}>
          <PrimaryButtonComponent
            title={renderCTAText()}
            onPress={handleCTAPress}
          />
        </Animated.View>

        {activeScreen === 3 ? (
          <Text
            style={{
              ...typography.small,
              textAlign: "center",
              color: colors.text.secondary,
            }}
          >
            {renderBelowButtonText()}
          </Text>
        ) :         <Text
        style={{
          ...typography.small,
          textAlign: "center",
          color: colors.text.secondary,
        }}
      >
        
      </Text>}

        {renderLegalLinks(true)}
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

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: activeScreen === 2 ? colors.ui.background : undefined,
      }}
    >
      {renderScreens()}
    </View>
  );
};

export default ReminderPaywall;
