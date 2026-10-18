import React, { useEffect, useState } from "react";
import { Image, Linking, Pressable, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../../constants/colors";
import { paywallCopy, typography } from "../../../constants/texts";
import { spacing } from "../../../constants/spacing";
import { externalLinks } from "../../../constants/links";
import * as haptics from "expo-haptics";
import { checkTrialEligibility } from "../../../services/revenuecat";
import { getFreeTrialDays, PERIOD_WORD, SelectablePlan } from "./paywallPlanUtils";

type Props = {
    onCTAPress: (plan: SelectablePlan) => void;
    products?: any;
    onRestorePurchases?: () => void;
};

const DefaultPaywall: React.FC<Props> = ({ onCTAPress, products, onRestorePurchases }) => {
    const [selectedPlan, setSelectedPlan] = useState<SelectablePlan>("monthly");
    const [trialEligible, setTrialEligible] = useState<boolean | null>(null);

    const monthlyProduct = products?.monthly?.product;
    const weeklyProduct = products?.weekly?.product;
    const monthlyTrialDays =
        trialEligible === false ? null : getFreeTrialDays(monthlyProduct?.introPrice);
    const trialDays = selectedPlan === "monthly" ? monthlyTrialDays : null;

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

    const ctaText = trialDays != null ? `Claim My ${trialDays}-Day Free Trial` : "Unlock Premium Now";

    const renderPlanRow = (plan: SelectablePlan) => {
        const isSelected = selectedPlan === plan;
        const optionProduct = plan === "monthly" ? monthlyProduct : weeklyProduct;
        const optionTrialDays = plan === "monthly" ? monthlyTrialDays : null;
        const optionPeriod = PERIOD_WORD[optionProduct?.subscriptionPeriod] ?? plan.replace("ly", "");
        const title = plan === "monthly" ? "Monthly Premium" : "Weekly Premium";

        return (
            <TouchableOpacity
                onPress={() => {
                    if (isSelected) return;
                    void haptics.selectionAsync();
                    setSelectedPlan(plan);
                }}
                activeOpacity={0.8}
                style={{
                    height: spacing.paywallPlanRowHeight,
                    borderRadius: 14,
                    paddingHorizontal: spacing.lg,
                    paddingVertical: spacing.md,
                    backgroundColor: isSelected ? colors.ui.listRowIconBackground : colors.ui.componentBackground,
                    borderWidth: isSelected ? 2 : 1,
                    borderColor: isSelected ? colors.ui.primary : colors.ui.cardBorder,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: spacing.md,
                    shadowColor: colors.ui.shadow,
                    shadowOpacity: isSelected ? 0.12 : 0,
                    shadowRadius: 12,
                    shadowOffset: { width: 0, height: 6 },
                    elevation: isSelected ? 2 : 0,
                }}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={title}
            >
                <View style={{ flex: 1, gap: 2 }}>
                    <Text
                        style={{
                            ...typography.bodySemiBold,
                            color: colors.text.primary,
                        }}
                    >
                        {title}
                    </Text>
                    <Text
                        style={{
                            ...typography.bodySemiBold,
                            color: optionTrialDays != null ? colors.ui.primary : colors.text.secondary,
                        }}
                    >
                        {optionTrialDays != null ? `${optionTrialDays}-day free trial` : "No free trial"}
                    </Text>
                </View>

                <View style={{ alignItems: "flex-end" }}>
                    <Text
                        style={{
                            ...typography.headlineSemi,
                            color: colors.text.primary,
                        }}
                    >
                        {optionProduct?.priceString ? `${optionProduct.priceString}/${optionPeriod}` : ""}
                    </Text>
                </View>
            </TouchableOpacity>
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
                                source={require("../../../assets/mascot/doLess.png")}
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
                                </View>

                                <View style={{ height: 1, backgroundColor: colors.ui.cardBorder }} />

                                {renderPlanRow("monthly")}
                                {renderPlanRow("weekly")}
                            </View>
                        </View>
                    </View>

                    <View style={{ gap: spacing.md }}>
                        <Pressable
                            onPress={() => onCTAPress(selectedPlan)}
                            style={{
                                backgroundColor: colors.ui.primary,
                                borderRadius: 999,
                                paddingVertical: spacing.md,
                                paddingHorizontal: spacing.lg,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            accessibilityRole="button"
                            accessibilityLabel={ctaText}
                        >
                            <Text style={{ ...typography.button, color: colors.ui.white }}>{ctaText}</Text>
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
