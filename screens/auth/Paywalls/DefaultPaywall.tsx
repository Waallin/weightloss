import React, { useMemo, useState } from "react";
import { Image, Pressable, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../../constants/colors";
import { getPaywallSpecialOfferHeadline, paywallCopy, typography } from "../../../constants/texts";
import { spacing } from "../../../constants/spacing";

type PlanKey = "yearly" | "weekly";

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

type Props = {
    onCTAPress: (plan: "weekly" | "annual") => void;
    products?: {
        weekly?: RevenueCatPackage | null;
        annual?: RevenueCatPackage | null;
    } | null;
        onRestorePurchases?: () => void;
};

const DefaultPaywall: React.FC<Props> = ({ onCTAPress, products, onRestorePurchases }) => {
    console.log("🚀 ~ DefaultPaywall ~ products:", products)
    const navigation = useNavigation();
    const [selectedPlan, setSelectedPlan] = useState<PlanKey>("yearly");

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

    const specialOfferHeadline = useMemo(() => {
        return getPaywallSpecialOfferHeadline({
            weeklyPrice: products?.weekly?.product?.price,
            weeklyPeriodUnit: products?.weekly?.product?.subscriptionPeriod?.unit,
            weeklyPeriodValue: products?.weekly?.product?.subscriptionPeriod?.value,
            yearlyPrice: products?.annual?.product?.price,
            yearlyPeriodUnit: products?.annual?.product?.subscriptionPeriod?.unit,
            yearlyPeriodValue: products?.annual?.product?.subscriptionPeriod?.value,
        });
    }, [
        products?.weekly?.product?.price,
        products?.weekly?.product?.subscriptionPeriod?.unit,
        products?.weekly?.product?.subscriptionPeriod?.value,
        products?.annual?.product?.price,
        products?.annual?.product?.subscriptionPeriod?.unit,
        products?.annual?.product?.subscriptionPeriod?.value,
    ]);

    const ctaLabel = useMemo(() => {
        return selectedPlan === "yearly" ? paywallCopy.ctaYearlyFreeTrial : paywallCopy.ctaWeekly;
    }, [selectedPlan]);

    const footnote = useMemo(() => {
        return selectedPlan === "yearly" ? paywallCopy.trialFootnote : paywallCopy.weeklyFootnote;
    }, [selectedPlan]);

    const handleBackPress = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
            return;
        }
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
                    backgroundColor: isSelected ? colors.ui.listRowIconBackground : colors.ui.componentBackground,
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
                    <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
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
                                    {plan.badge}
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
                                fontSize: 12, // mindre
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

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.ui.background }}>
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingHorizontal: spacing.lg,
                    paddingTop: spacing.md,
                    paddingBottom: spacing.xl,
                }}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ flex: 1, justifyContent: "space-between", gap: spacing.xl }}>
                    <View style={{ gap: spacing.xl }}>

                        <View style={{ alignItems: "center", gap: spacing.md, marginTop: 40 }}>
                            <Image
                                source={require("../../../assets/mascot/thumbsUp.png")}
                                style={{ width: spacing.paywallMascotSize, height: spacing.paywallMascotSize }}
                                resizeMode="contain"
                            />

                            <View style={{ alignItems: "center", gap: spacing.sm }}>
                                <Text style={{ ...typography.headline, textAlign: "center", color: colors.text.primary }}>
                                    {paywallCopy.choosePlanTitle}
                                </Text>
                                <Text
                                    style={{
                                        ...typography.bodyMedium,
                                        color: colors.ui.primary,
                                        textAlign: "center",
                                    }}
                                >
                                    {paywallCopy.urgencyLine}
                                </Text>
                                <Text
                                    style={{
                                        ...typography.body,
                                        color: colors.text.secondary,
                                        textAlign: "center",
                                    }}
                                >
                                    {paywallCopy.subtitle}
                                </Text>
                            </View>
                        </View>

                        <View
                            style={{
                                borderRadius: 18,
                                backgroundColor: colors.ui.componentBackground,
                                borderWidth: 1,
                                borderColor: colors.ui.cardBorder,
                                overflow: "hidden",
                            }}
                        >
                            <View style={{ padding: spacing.lg, gap: spacing.md }}>
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                    <Text style={{ ...typography.bodySemiBold, color: colors.text.primary }}>
                                        {specialOfferHeadline}
                                    </Text>
                                    <Text style={{ ...typography.caption, color: colors.text.secondary }}>
                                        {paywallCopy.socialProofRating}/{paywallCopy.socialProofRatingMax}
                                    </Text>
                                </View>

                                <View style={{ height: 1, backgroundColor: colors.ui.cardBorder }} />

                                <View style={{ gap: spacing.md }}>
                                    {renderPlanRow({
                                        key: "yearly",
                                        label: paywallCopy.yearlyLabel,
                                        badge: paywallCopy.yearlyBadge,
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
                            </View>
                        </View>
                    </View>

                    <View style={{ gap: spacing.md }}>
                        <Pressable
                            onPress={() => onCTAPress(selectedPlan === "yearly" ? "annual" : "weekly")}
                            style={{
                                backgroundColor: colors.ui.primary,
                                borderRadius: 999,
                                paddingVertical: spacing.md,
                                paddingHorizontal: spacing.lg,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            accessibilityRole="button"
                            accessibilityLabel={ctaLabel}
                        >
                            <Text style={{ ...typography.button, color: colors.ui.white }}>{ctaLabel}</Text>
                        </Pressable>

                        <Text
                            style={{
                                ...typography.small,
                                color: colors.text.secondary,
                                textAlign: "center",
                            }}
                        >
                            {footnote}
                        </Text>

                        <TouchableOpacity
                            onPress={onRestorePurchases}
                            style={{ alignSelf: "center", paddingVertical: spacing.sm, paddingHorizontal: spacing.md, backgroundColor: colors.ui.componentBackground, borderRadius: 999, borderWidth: 1, borderColor: colors.ui.cardBorder }}
                            accessibilityRole="button"
                            accessibilityLabel={paywallCopy.restorePurchases}
                        >
                            <Text style={{ ...typography.bodyMedium, color: colors.ui.primary }}>
                                {paywallCopy.restorePurchases}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default DefaultPaywall;
