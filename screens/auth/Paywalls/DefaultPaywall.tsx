import React, { useMemo } from "react";
import { Image, Linking, Pressable, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../../constants/colors";
import { getPaywallSpecialOfferHeadline, paywallCopy, typography } from "../../../constants/texts";
import { spacing } from "../../../constants/spacing";
import { externalLinks } from "../../../constants/links";

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
    onCTAPress: (plan: "annual") => void;
    products?: {
        weekly?: RevenueCatPackage | null;
        annual?: RevenueCatPackage | null;
        monthly?: RevenueCatPackage | null;
    } | null;
    onRestorePurchases?: () => void;
};

const DefaultPaywall: React.FC<Props> = ({ onCTAPress, products, onRestorePurchases }) => {
    const getPeriodLabel = (pkg?: RevenueCatPackage | null): string | null => {
        const unit = pkg?.product?.subscriptionPeriod?.unit;
        if (!unit) return null;
        if (unit === "WEEK") return "/ week";
        if (unit === "MONTH") return "/ month";
        if (unit === "YEAR") return "/ year";
        if (unit === "DAY") return "/ day";
        return null;
    };

    const annualPrice = products?.annual?.product?.priceString ?? paywallCopy.yearlyPrice;
    const annualPeriod = getPeriodLabel(products?.annual) ?? "/ year";

    const perWeekHint = useMemo(() => {
        const price = products?.annual?.product?.price;
        const currencyCode = products?.annual?.product?.currencyCode;
        if (!price || price <= 0 || !currencyCode) return undefined;

        const formatter = new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: currencyCode,
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
        });
        return `${formatter.format(price / 52)} / week`;
    }, [products?.annual?.product?.price, products?.annual?.product?.currencyCode]);

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

    const renderPlanRow = () => {
        return (
            <View
                style={{
                    height: spacing.paywallPlanRowHeight,
                    borderRadius: 14,
                    paddingHorizontal: spacing.lg,
                    paddingVertical: spacing.md,
                    backgroundColor: colors.ui.listRowIconBackground,
                    borderWidth: 1,
                    borderColor: colors.ui.primary,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: spacing.md,
                    shadowColor: colors.ui.shadow,
                    shadowOpacity: 0.12,
                    shadowRadius: 12,
                    shadowOffset: { width: 0, height: 6 },
                    elevation: 2,
                }}
                accessibilityRole="text"
            >
                <View style={{ flex: 1, gap: 2 }}>
                    <Text
                        style={{
                            ...typography.bodySemiBold,
                            color: colors.text.primary,
                        }}
                    >
                        Annual plan
                    </Text>
                    <Text
                        style={{
                            ...typography.bodySemiBold,
                            color: colors.ui.primary,
                        }}
                    >
                        Try 30 days free
                    </Text>
                </View>

                <View style={{ alignItems: "flex-end", gap: 2 }}>
                    <Text
                        style={{
                            ...typography.headlineSemi,
                            color: colors.text.primary,
                        }}
                    >
                        {annualPrice} {annualPeriod}
                    </Text>
                    {!!perWeekHint && (
                        <Text
                            style={{
                                ...typography.small,
                                color: colors.text.secondary,
                            }}
                        >
                            {perWeekHint}
                        </Text>
                    )}
                </View>
            </View>
        );
    };

    const renderPrivacyPolicy = () => {
        return (
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: spacing.sm,
                    paddingVertical: spacing.sm,
                }}
            >
                <TouchableOpacity
                    onPress={() => Linking.openURL(externalLinks.privacyPolicy)}
                    accessibilityRole="link"
                    accessibilityLabel={paywallCopy.privacyPolicy}
                >
                    <Text
                        style={{
                            ...typography.small,
                            color: colors.text.secondary,
                            textDecorationLine: "underline",
                        }}
                    >
                        {paywallCopy.privacyPolicy}
                    </Text>
                </TouchableOpacity>
                <Text style={{ ...typography.small, color: colors.text.secondary }}>
                    {paywallCopy.legalSeparator}
                </Text>
                <TouchableOpacity
                    onPress={() => Linking.openURL(externalLinks.termsOfUse)}
                    accessibilityRole="link"
                    accessibilityLabel={paywallCopy.termsOfUse}
                >
                    <Text
                        style={{
                            ...typography.small,
                            color: colors.text.secondary,
                            textDecorationLine: "underline",
                        }}
                    >
                        {paywallCopy.termsOfUse}
                    </Text>
                </TouchableOpacity>
            </View>
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
                                <Text style={{ ...typography.bodyMedium, color: colors.text.secondary, textAlign: "center" }}>
                                    {paywallCopy.subTitle}
                                </Text>
                                <Text
                                    style={{
                                        ...typography.bodyMedium,
                                        color: colors.ui.primary,
                                        textAlign: "center",
                                        marginTop: spacing.sm,
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
                                    Your Premium plan　
                                    </Text>
                                    <Text style={{ ...typography.caption, color: colors.text.secondary }}>
                                    Best value
                                    </Text>
                                </View>

                                <View style={{ height: 1, backgroundColor: colors.ui.cardBorder }} />

                                {renderPlanRow()}
                            </View>
                        </View>
                    </View>

                    <View style={{ gap: spacing.md }}>
                        <Pressable
                            onPress={() => onCTAPress("annual")}
                            style={{
                                backgroundColor: colors.ui.primary,
                                borderRadius: 999,
                                paddingVertical: spacing.md,
                                paddingHorizontal: spacing.lg,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            accessibilityRole="button"
                            accessibilityLabel={paywallCopy.ctaYearlyFreeTrial}
                        >
                            <Text style={{ ...typography.button, color: colors.ui.white }}>Start my 30 days free trail</Text>
                        </Pressable>

                        <Text
                            style={{
                                ...typography.small,
                                color: colors.text.secondary,
                                textAlign: "center",
                            }}
                        >
                            Cancel anytime
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

                        {renderPrivacyPolicy()}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default DefaultPaywall;
