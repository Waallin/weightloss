import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, Pressable, Text, TouchableOpacity, View } from "react-native";
import { globalStyles } from "../../../constants/globalStyles";
import PrimaryButtonComponent from "../../../components/PrimaryButtonComponent";
import { Entypo } from "@expo/vector-icons";
import { colors } from "../../../constants/colors";
import { spacing } from "../../../constants/spacing";
import { useNavigation } from "@react-navigation/native";
import { paywallCopy, reminderPaywallCopy, typography } from "../../../constants/texts";
import useConfigStore from "../../../stores/useConfigStore";

type RevenueCatPackage = {
    identifier: string;
    product: {
        price?: number;
        priceString?: string;
        currencyCode?: string;
        subscriptionPeriod?: {
            unit?: "DAY" | "WEEK" | "MONTH" | "YEAR" | string;
            value?: number;
        } | null;
    };
};

type ReminderPaywallProps = {
    onCTAPress?: (plan: "weekly" | "annual") => void;
    loading?: boolean;
    products?: {
        weekly?: RevenueCatPackage | null;
        annual?: RevenueCatPackage | null;
    } | null;
};

type PlanKey = "yearly" | "weekly";

const ReminderPaywall: React.FC<ReminderPaywallProps> = ({ onCTAPress, loading, products }) => {
    const [activeScreen, setActiveScreen] = useState(0);
    const [selectedPlan, setSelectedPlan] = useState<PlanKey>("yearly");
    const navigation = useNavigation();
    const ctaPulse = useRef(new Animated.Value(1)).current;
    const { config } = useConfigStore();
    const benefits = useMemo(() => reminderPaywallCopy.screen3.benefits, []);

    const getPeriodLabel = useMemo(() => {
        return (pkg?: RevenueCatPackage | null): string | null => {
            const unit = pkg?.product?.subscriptionPeriod?.unit;
            if (!unit) return null;
            if (unit === "WEEK") return "/ week";
            if (unit === "MONTH") return "/ month";
            if (unit === "YEAR") return "/ year";
            if (unit === "DAY") return "/ day";
            return null;
        };
    }, []);

    const weeklyPrice = products?.weekly?.product?.priceString ?? paywallCopy.weeklyPrice;
    const weeklyPeriod = getPeriodLabel(products?.weekly) ?? paywallCopy.weeklyPeriod;

    const yearlyPrice = products?.annual?.product?.priceString ?? paywallCopy.yearlyPrice;
    const yearlyPeriod = getPeriodLabel(products?.annual) ?? paywallCopy.yearlyPeriod;

    const yearlyPerWeekEquivalent = paywallCopy.yearlyPerWeekEquivalent({
        yearlyPrice: products?.annual?.product?.price,
        currencyCode: products?.annual?.product?.currencyCode,
        periodUnit: products?.annual?.product?.subscriptionPeriod?.unit,
        periodValue: products?.annual?.product?.subscriptionPeriod?.value,
    });

    const yearlyPerWeekSubline = paywallCopy.yearlyPerWeekSubline({
        weeklyPrice: products?.weekly?.product?.price,
        weeklyPeriodUnit: products?.weekly?.product?.subscriptionPeriod?.unit,
        weeklyPeriodValue: products?.weekly?.product?.subscriptionPeriod?.value,
        yearlyPrice: products?.annual?.product?.price,
        yearlyPeriodUnit: products?.annual?.product?.subscriptionPeriod?.unit,
        yearlyPeriodValue: products?.annual?.product?.subscriptionPeriod?.value,
    });



    useEffect(() => {
        if (activeScreen !== 2) {
            ctaPulse.setValue(1);
            return;
        }

        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(ctaPulse, {
                    toValue: 1.03,
                    duration: 900,
                    easing: Easing.out(Easing.quad),
                    useNativeDriver: true,
                }),
                Animated.timing(ctaPulse, {
                    toValue: 1,
                    duration: 900,
                    easing: Easing.in(Easing.quad),
                    useNativeDriver: true,
                }),
            ]),
        );

        loop.start();
        return () => loop.stop();
    }, [activeScreen, ctaPulse]);

    const cardStyle = useMemo(
        () => ({
            width: "100%" as const,

            borderRadius: spacing.borderRadius,
            padding: spacing.lg,
            alignItems: "center" as const,
            borderColor: colors.ui.cardBorder,
        }),
        [],
    );

    const contentWrapperStyle = useMemo(
        () => ({
            flex: 1,
            justifyContent: "center" as const,
            alignItems: "center" as const,
            paddingVertical: spacing.lg,
        }),
        [],
    );

    const titleStyle = useMemo(
        () => ({
            ...typography.screenTitle,
            color: colors.text.primary,
            textAlign: "center" as const,
            marginBottom: spacing.sm,
        }),
        [],
    );

    const bodyStyle = useMemo(
        () => ({
            ...typography.body,
            color: colors.text.secondary,
            textAlign: "center" as const,
        }),
        [],
    );

    const subheadlineStyle = useMemo(
        () => ({
            ...typography.body,
            color: colors.text.secondary,
            textAlign: "center" as const,
            marginTop: spacing.xs,
        }),
        [],
    );

    const BenefitRow: React.FC<{ text: string }> = ({ text }) => {
        return (
            <View
                style={{
                    width: "100%",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: spacing.sm,
                    paddingVertical: spacing.xs,
                }}
            >
                <View
                    style={{
                        width: 28,
                        height: 28,
                        borderRadius: spacing.rounded,
                        backgroundColor: colors.ui.iconContainer,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Entypo name="check" size={16} color={colors.ui.primary} />
                </View>
                <Text style={{ ...bodyStyle, textAlign: "left" }}>{text}</Text>
            </View>
        );
    };

    const ProgressDots: React.FC<{ activeIndex: number; total: number }> = ({
        activeIndex,
        total,
    }) => {
        const dots = Array.from({ length: total }, (_, i) => i);
        return (
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: spacing.sm,
                    marginTop: spacing.lg,
                }}
            ></View>
        );
    };

    const renderFirstScreen = () => {
        const previewBenefits = benefits.slice(0, 2);
        return (
            <View style={contentWrapperStyle}>
                <View style={cardStyle}>
                    <View
                        style={{
                            width: 120,
                            height: 120,
                            borderRadius: spacing.rounded,

                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: spacing.md,
                        }}
                    >
                        <Entypo name="leaf" size={58} color={colors.ui.primary} />
                    </View>
                    <Text style={titleStyle}>{config?.reminderPaywallPhrases?.title_1}</Text>
                    <Text style={subheadlineStyle}>
                        {config?.reminderPaywallPhrases?.sub_1}
                    </Text>
                </View>
            </View>
        );
    };

    const renderSecondScreen = () => {
        return (
            <View style={contentWrapperStyle}>
                <View style={cardStyle}>
                    <View
                        style={{
                            width: 120,
                            height: 120,
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: spacing.md,
                        }}
                    >
                        <Entypo name="bell" size={60} color={colors.ui.primary} />
                    </View>
                    <Text style={titleStyle}>{config?.reminderPaywallPhrases?.title_2}</Text>
                    <Text style={subheadlineStyle}>{config?.reminderPaywallPhrases?.sub_2}</Text>
                </View>
            </View>
        );
    };

    const renderThirdScreen = () => {
        return (
            <View style={contentWrapperStyle}>
                <View style={cardStyle}>
                    <Text style={titleStyle}>{config?.reminderPaywallPhrases?.title_3}</Text>
                    <View style={{ width: "100%", marginTop: spacing.sm }}>
                        <BenefitRow text={config?.reminderPaywallPhrases?.benefit_1} />
                        <BenefitRow text={config?.reminderPaywallPhrases?.benefit_2} />
                        <BenefitRow text={config?.reminderPaywallPhrases?.benefit_3} />
                    </View>
                </View>
            </View>
        );
    };

    const handleGoBack = () => {
        if (activeScreen === 0) {
            navigation.goBack();
        } else {
            setActiveScreen((prev) => prev - 1);
        }
    };

    const renderHeader = () => {
        return (
            <View style={{ paddingTop: spacing.md, paddingBottom: spacing.sm }}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    disabled={activeScreen === 0}
                    onPress={handleGoBack}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    style={{ alignSelf: "flex-start" }}
                >
                    <Entypo name="chevron-left" size={24} color={colors.text.primary} />
                </TouchableOpacity>
            </View>
        );
    };

    const renderPlanRow = (plan: {
        key: PlanKey;
        label: string;
        price: string;
        period: string;
        subline: string;
        badge?: string;
        rightHint?: string;
    }) => {
        const isSelected = selectedPlan === plan.key;
        const isYearly = plan.key === "yearly";
        const mainPriceLine = isYearly && plan.rightHint ? plan.rightHint : plan.price;
        const secondaryRightHint = isYearly && plan.rightHint ? `${plan.price} ${plan.period}` : plan.rightHint;

        return (
            <Pressable
                onPress={() => setSelectedPlan(plan.key)}
                style={{
                    height: spacing.paywallPlanRowHeight,
                    borderRadius: 14,
                    paddingHorizontal: spacing.lg,
                    paddingVertical: spacing.md,
                    backgroundColor: isSelected
                        ? colors.ui.listRowIconBackground
                        : colors.ui.componentBackground,
                    borderWidth: 1,
                    borderColor: isSelected ? colors.ui.primary : colors.ui.cardBorder,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: spacing.md,
                    ...(isSelected
                        ? {
                              shadowColor: colors.ui.shadow,
                              shadowOpacity: 0.12,
                              shadowRadius: 12,
                              shadowOffset: { width: 0, height: 6 },
                              elevation: 2,
                          }
                        : null),
                }}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
            >
                <View style={{ flex: 1, gap: 2 }}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: spacing.sm,
                        }}
                    >
                        <Text
                            style={{
                                ...typography.bodySemiBold,
                                color: colors.text.primary,
                            }}
                        >
                            {plan.label}
                        </Text>
                        {!!plan.badge && (
                            <View
                                style={{
                                    paddingHorizontal: spacing.sm,
                                    paddingVertical: 4,
                                    borderRadius: 999,
                                    backgroundColor: colors.ui.listRowIconBackground,
                                    borderWidth: 1,
                                    borderColor: colors.ui.cardBorder,
                                }}
                            >
                                <Text
                                    style={{
                                        ...typography.captionSemiBold,
                                        color: colors.text.primary,
                                    }}
                                >
                                    {config?.reminderPaywallPhrases?.badge}
                                </Text>
                            </View>
                        )}
                    </View>
                    <Text
                        style={{
                            ...(isYearly ? typography.bodySemiBold : typography.small),
                            color: isYearly ? colors.ui.primary : colors.text.secondary,
                        }}
                    >
                        {plan.subline}
                    </Text>
                </View>

                <View style={{ alignItems: "flex-end", gap: 2 }}>
                    <Text style={{ ...typography.bodySemiBold, color: colors.text.primary }}>
                        {mainPriceLine}
                        {!isYearly && (
                            <Text style={{ ...typography.small, color: colors.text.secondary }}>
                                {" "}
                                {plan.period}
                            </Text>
                        )}
                    </Text>
                    {!!secondaryRightHint && (
                        <Text
                            style={{
                                ...typography.caption,
                                color: colors.ui.primary,
                                fontSize: 12,
                                lineHeight: 16,
                            }}
                        >
                            {secondaryRightHint}
                        </Text>
                    )}
                </View>
            </Pressable>
        );
    };

    const renderFooter = () => {
        const isLastScreen = activeScreen === 2;
        return (
            <View style={{ paddingTop: spacing.sm, paddingBottom: spacing.md }}>
                {isLastScreen ? (
                    <View
                        style={{ width: "100%", gap: spacing.sm, marginBottom: spacing.md }}
                    >
                        <View style={{ alignItems: "center" }}>
                            <View
                                style={{
                                    paddingHorizontal: spacing.md,
                                    paddingVertical: spacing.xs,
                                    borderRadius: 999,
                                    backgroundColor: colors.ui.componentBackground,
                                    borderWidth: 1,
                                    borderColor: colors.ui.cardBorder,
                                }}
                            >
                                <Text
                                    style={{
                                        ...typography.captionSemiBold,
                                        color: colors.text.primary,
                                        letterSpacing: 0.6,
                                    }}
                                >
                                    {reminderPaywallCopy.freeTrialLabel}
                                </Text>
                            </View>
                        </View>

                        <View style={{ width: "100%", gap: spacing.sm }}>
                            {renderPlanRow({
                                key: "yearly",
                                label: paywallCopy.yearlyLabel,
                                badge: paywallCopy.yearlyTrialBadge,
                                price: yearlyPrice,
                                period: yearlyPeriod,
                                subline: yearlyPerWeekSubline,
                                rightHint: yearlyPerWeekEquivalent,
                            })}

                            {renderPlanRow({
                                key: "weekly",
                                label: paywallCopy.weeklyLabel,
                                price: weeklyPrice,
                                period: weeklyPeriod,
                                subline: paywallCopy.weeklySubline,
                            })}
                        </View>

                        <Text
                            style={{
                                ...typography.small,
                                textAlign: "center",
                                color: colors.text.secondary,
                                marginTop: spacing.xs,
                            }}
                        >
                            {reminderPaywallCopy.trialFootnote}
                        </Text>
                    </View>
                ) : (
                    <Text
                        style={{
                            ...typography.body,
                            textAlign: "center",
                            marginBottom: spacing.md,
                            color: colors.text.secondary,
                        }}
                    >
                        {reminderPaywallCopy.trialFootnote}
                    </Text>
                )}

                <Animated.View
                    style={
                        isLastScreen ? { transform: [{ scale: ctaPulse }] } : undefined
                    }
                >
                    <PrimaryButtonComponent
                        title={
                            isLastScreen
                                ? config?.reminderPaywallPhrases?.cta_3
                                : activeScreen === 1
                                ? config?.reminderPaywallPhrases?.cta_2
                                : config?.reminderPaywallPhrases?.cta_1
                        }
                   
                        onPress={() => {
                            if (activeScreen === 2) {
                                onCTAPress?.(selectedPlan === "yearly" ? "annual" : "weekly");
                                return;
                            }
                            setActiveScreen((prev) => prev + 1);
                        }}
                        loading={loading}
                    />
                </Animated.View>
                <View
                    style={{
                        paddingHorizontal: spacing.md,
                        marginBottom: spacing.md,
                        gap: spacing.xs,
                        marginTop: spacing.md,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            // TODO: wire to StoreKit/RevenueCat restore when available
                        }}
                        activeOpacity={0.8}
                        style={{ alignSelf: "center" }}
                    >
                        <Text style={{ ...typography.small, textAlign: "center", color: colors.text.secondary }}>
                            Restore purchase
                        </Text>
                    </TouchableOpacity>
                    <Text
                        style={{
                            ...typography.small,
                            color: colors.text.secondary,
                            marginBottom: spacing.sm,
                            textAlign: "center",
                        }}
                    >
                        Subscription renews automatically unless canceled.
                    </Text>
                    <Text style={{ ...typography.small, textAlign: "center", color: colors.text.secondary }}>
                        Cancel anytime in your App Store settings.
                    </Text>
                </View>
        
            </View>
        );
    };

    const renderScreens = () => {
        return (
            <View style={{ flex: 1 }}>
                {renderHeader()}
                <View style={{ flex: 1 }}>
                    {activeScreen === 0 && renderFirstScreen()}
                    {activeScreen === 1 && renderSecondScreen()}
                    {activeScreen === 2 && renderThirdScreen()}
                </View>
                {renderFooter()}
            </View>
        );
    };

    return <View style={globalStyles.container}>{renderScreens()}</View>;
};

export default ReminderPaywall;
