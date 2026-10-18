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
import { analyticsEvents } from "../../../constants/analytics";
import { useNavigation } from "@react-navigation/native";
import {
  Easing as ReanimatedEasing,
  ReduceMotion,
  runOnJS,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import useConfigStore from "../../../stores/useConfigStore";
import TrialSpinWheel, { WHEEL_SEGMENT_ANGLE } from "./TrialSpinWheel";
import { checkTrialEligibility } from "../../../services/revenuecat";
import SocialProofItem, {
  SocialProofTestimonial,
} from "../components/SocialProofItem";
import {
  getComparePrice,
  getFreeTrialDays,
  PERIOD_WORD,
  SelectablePlan,
} from "./paywallPlanUtils";

const FULL_TURNS = 8;
const WINNING_INDEX = 0;
const SPIN_DURATION_MS = 6500;

const paywallTestimonial: SocialProofTestimonial = {
  name: "Sara L.",
  role: "Kudoo user",
  rating: 4.9,
  ratingMax: 5,
  headline: "Feeling lighter in the first week",
  quote:
    "“I only planned to try the free trail. Three months later I’m down 34 lbs.”",
  avatarColor: colors.ui.listRowIconBackground,
  avatarImage: require("../../../assets/users/sara.jpg"),
};

const formatTrialEndDate = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date
    .toLocaleDateString("en-US", { month: "short", day: "numeric" })
    .toUpperCase();
};

const ReminderPaywall: React.FC<{
  products: any;
  onCTAPress: (plan: SelectablePlan) => void;
  onRestorePurchases: () => void;
}> = ({ products, onCTAPress, onRestorePurchases }) => {
  const { setVisibleConfetti } = useConfettiStore();
  const { config } = useConfigStore();
  const insets = useSafeAreaInsets();
  const showSpinner = config?.showSpinner === true;
  const [activeScreen, setActiveScreen] = useState(showSpinner ? 2 : 3);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const spinAnim = useSharedValue(0);
  const ctaPulse = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation();
  const [selectedPlan, setSelectedPlan] = useState<SelectablePlan>("monthly");
  const [trialEligible, setTrialEligible] = useState<boolean | null>(null);

  const monthlyProduct = products?.monthly?.product;
  const weeklyProduct = products?.weekly?.product;
  const product = selectedPlan === "monthly" ? monthlyProduct : weeklyProduct;
  const monthlyTrialDays =
    trialEligible === false ? null : getFreeTrialDays(monthlyProduct?.introPrice);
  const trialDays = selectedPlan === "monthly" ? monthlyTrialDays : null;
  const periodLabel = PERIOD_WORD[product?.subscriptionPeriod] ?? "month";

  useEffect(() => {
    const productId = monthlyProduct?.identifier;
    if (!productId) return;
    let mounted = true;
    checkTrialEligibility(productId).then((eligible) => {
      if (mounted) setTrialEligible(eligible);
    });
    return () => {
      mounted = false;
    };
  }, [monthlyProduct?.identifier]);

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
    if (!showSpinner && activeScreen === 2) {
      setActiveScreen(3);
    }
  }, [showSpinner, activeScreen]);

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
      if (!showSpinner) {
        setActiveScreen(3);
        return;
      }
      hasSpun ? (setActiveScreen(3), setHasSpun(false)) : handleSpin();
    } else {
      onCTAPress(selectedPlan);
    }
  };

  const renderCTAText = () => {
    switch (activeScreen) {
      case 0:
        return `Try for ${monthlyProduct?.introPrice?.priceString ?? "0,00 kr"}`;
      case 1:
        return "Continue for FREE";
      case 2:
        return hasSpun ? "Claim My Free Month →" : "Spin the wheel  →";
      case 3:
        return trialDays != null
          ? `Claim My ${trialDays}-Day Free Trial`
          : "Unlock Premium Now";
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
    if (!showSpinner) return;
    setIsSpinning(false);
    setHasSpun(true);

    setVisibleConfetti(true);

    void haptics.notificationAsync(haptics.NotificationFeedbackType.Success);
    setTimeout(() => {
      void askForStoreReview();
    }, 1500);
    void trackMixpanelEvent(analyticsEvents.paywallWheelSpun);
  };

  const handleSpin = () => {
    if (!showSpinner || isSpinning || hasSpun) return;

    setIsSpinning(true);
    // Continuous ease-out: crawl through previous segment, land at start of "1 month".
    const winAngle =
      FULL_TURNS * 360 -
      WINNING_INDEX * WHEEL_SEGMENT_ANGLE -
      WHEEL_SEGMENT_ANGLE / 2 +
      5;

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

    const onSpinComplete = () => {
      hapticTimers.forEach(clearTimeout);
      finishSpin();
    };

    spinAnim.value = 0;
    spinAnim.value = withTiming(
      winAngle,
      {
        duration: SPIN_DURATION_MS,
        easing: ReanimatedEasing.bezier(0.08, 0.9, 0.12, 1),
        reduceMotion: ReduceMotion.Never,
      },
      (finished) => {
        if (!finished) return;
        runOnJS(onSpinComplete)();
      },
    );
  };

  const renderBelowButtonText = () => {
    const priceString = product?.priceString ?? "";
    const comparePrice = getComparePrice(product);

    return (
      <>
        {trialDays != null
          ? `${trialDays}-day free trial — then only `
          : "Billed today — then only "}
        {comparePrice ? (
          <Text style={{ textDecorationLine: "line-through" }}>
            {comparePrice}
          </Text>
        ) : null}
        {comparePrice ? " " : ""}
        {`${priceString}/${periodLabel}`}
        {trialDays != null ? "" : `, renews every ${periodLabel === "week" ? "7 days" : periodLabel}`}
      </>
    );
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

        <View style={{ marginTop: spacing.xl, alignSelf: "stretch" }}>
          <SocialProofItem item={paywallTestimonial} />
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
            paddingHorizontal: spacing.lg,
            lineHeight: 32,
          }}
        >
          {hasSpun ? (
            <>
              You got the best one! 🎉
              {"\n"}
              <Text style={{
                ...textStyles.onboardingTitle,
                fontWeight: "400",
                fontSize: 14,
                opacity: 0.7,
                textAlign: "center",
              }}>
                You won the best prize — 1 month FREE!
              </Text>


            </>
          ) : (
            <>
              Let’s see how long{"\n"}your{" "}
              <Text style={{ color: colors.ui.primary }}>free</Text> trial will
              be!
            </>
          )}
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

  const renderAnchoredPrice = (prod: any) => {
    const comparePrice = getComparePrice(prod);
    return (
      <>
        {comparePrice ? (
          <Text
            style={{
              textDecorationLine: "line-through",
              color: colors.ui.delete,
            }}
          >
            {comparePrice}
          </Text>
        ) : null}
        {comparePrice ? " " : ""}
        <Text style={{ color: colors.ui.primary, fontWeight: "700" }}>
          {prod?.priceString ?? ""}
        </Text>
      </>
    );
  };

  const renderPlanOption = (plan: SelectablePlan) => {
    const isSelected = selectedPlan === plan;
    const optionProduct = plan === "monthly" ? monthlyProduct : weeklyProduct;
    const optionTrialDays = plan === "monthly" ? monthlyTrialDays : null;
    const optionPeriod = PERIOD_WORD[optionProduct?.subscriptionPeriod] ?? plan.replace("ly", "");
    const title = plan === "monthly" ? "Monthly Premium" : "Weekly Premium";
    return (
      <TouchableOpacity
        accessibilityRole="radio"
        accessibilityState={{ selected: isSelected }}
        accessibilityLabel={title}
        activeOpacity={0.8}
        onPress={() => {
          if (isSelected) return;
          void haptics.selectionAsync();
          setSelectedPlan(plan);
        }}
        style={{
          flex: 1,
          flexDirection: "row",
          gap: spacing.sm,
          backgroundColor: colors.ui.componentBackground,
          borderRadius: spacing.borderRadius,
          borderWidth: 2,
          borderColor: isSelected ? colors.ui.primary : colors.ui.cardBorder,
          paddingVertical: spacing.sm + 2,
          paddingHorizontal: spacing.sm + 2,
        }}
      >
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: isSelected ? colors.ui.primary : colors.ui.cardBorder,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 1,
          }}
        >
          {isSelected ? (
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: colors.ui.primary,
              }}
            />
          ) : null}
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              ...textStyles.onboardingBody,
              fontWeight: "700",
              color: colors.text.primary,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              ...typography.small,
              color: optionTrialDays != null ? colors.ui.primary : colors.text.secondary,
              marginTop: 2,
            }}
          >
            {optionTrialDays != null
              ? `${optionTrialDays}-day free trial`
              : "No free trial"}
          </Text>
          <Text
            style={{
              ...typography.small,
              color: colors.text.secondary,
              marginTop: 2,
            }}
          >
            {optionProduct?.priceString
              ? `${optionProduct.priceString}/${optionPeriod}`
              : ""}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFourthScreen = () => {
    const steps =
      trialDays != null
        ? [
          {
            title: `TODAY — ${product?.introPrice?.priceString ?? "$0.00"}`,
            subtitle: "Full access unlocked",
            icon: "lock-open-outline",
            iconBg: colors.ui.primary,
            lineColor: colors.ui.primary,
          },
          {
            title: `${trialDays}-day free trial`,
            subtitle: "97% of users start seeing results.",
            icon: "trending-up",
            iconBg: colors.ui.primary,
            lineColor: "#D1D5DB",
            highlight: true,
          },
          {
            title: (
              <>
                {`After ${trialDays} days — Only `}
                {renderAnchoredPrice(product)}
                {` a ${periodLabel}`}
              </>
            ),
            subtitle: `Monthly subscription begins ${formatTrialEndDate(trialDays)}`,
            icon: "crown-outline",
            iconBg: "#111827",
          },
        ]
        : [
          {
            title: (
              <>
                {"TODAY — "}
                {renderAnchoredPrice(product)}
              </>
            ),
            subtitle: `${periodLabel === "week" ? "Weekly" : "Monthly"} subscription payment`,
            icon: "lock-open-outline",
            iconBg: colors.ui.primary,
            lineColor: colors.ui.primary,
          },
          {
            title: "Premium access unlocked immediately",
            subtitle: "97% of users start seeing results.",
            icon: "trending-up",
            iconBg: colors.ui.primary,
            lineColor: "#D1D5DB",
            highlight: true,
          },
          {
            title: `Renews every ${periodLabel === "week" ? "7 days" : periodLabel}`,
            subtitle: `Billed ${periodLabel === "week" ? "weekly" : "monthly"}`,
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
          {trialDays != null ? (
            <>
              Your <Text style={{ color: colors.ui.primary }}>free</Text>{" "}
              {trialDays === 7 ? "week" : "trial"} is ready
            </>
          ) : (
            "Your Premium is ready"
          )}

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
          {trialDays != null
            ? `Try everything in Kudoo free for the next ${trialDays} days.`
            : "Get full access to everything in Kudoo today."}
        </Text>
        <View
          style={{
            flex: 1,

            justifyContent: "center",
            
          }}
        >
          {steps.map((step, index) => (
            <View key={index}>
              {renderTimelineStep(step, index === steps.length - 1)}
            </View>
          ))}
          <View style={{ marginTop: spacing.lg, marginBottom: spacing.md }}>
            <SocialProofItem item={paywallTestimonial} />
          </View>
          <View
            accessibilityRole="radiogroup"
            style={{
              flexDirection: "row",
              gap: spacing.sm,
            }}
          >
            {renderPlanOption("monthly")}
            {renderPlanOption("weekly")}
          </View>
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
    const chargeNoteText =
      trialDays != null ? "✓ Nothing charged today" : "✓ Instant access. Cancel anytime.";

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
            {chargeNoteText}
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
      activeScreen === 3 ? chargeNoteText : null;

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
            disabled={isSpinning}
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
        ) : <Text
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
