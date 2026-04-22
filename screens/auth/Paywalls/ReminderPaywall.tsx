import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, Text, TouchableOpacity, View } from "react-native";
import { globalStyles } from "../../../constants/globalStyles";
import PrimaryButtonComponent from "../../../components/PrimaryButtonComponent";
import { Entypo } from "@expo/vector-icons";
import { colors } from "../../../constants/colors";
import { spacing } from "../../../constants/spacing";
import { useNavigation } from "@react-navigation/native";
import { reminderPaywallCopy, typography } from "../../../constants/texts";

type ReminderPaywallProps = {
    onCTAPress?: () => void;
};

const ReminderPaywall: React.FC<ReminderPaywallProps> = ({ onCTAPress }) => {
    const [activeScreen, setActiveScreen] = useState(0);
    const navigation = useNavigation();
    const ctaPulse = useRef(new Animated.Value(1)).current;

    const benefits = useMemo(() => reminderPaywallCopy.screen3.benefits, []);

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
            ...typography.headline,
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
                    <Text style={titleStyle}>{reminderPaywallCopy.screen1.headline}</Text>
                    <Text style={subheadlineStyle}>
                        {reminderPaywallCopy.screen1.subheadline}
                    </Text>
                </View>
            </View>
        );
    };

    const renderSecondScreen = () => {
        return (
            <View style={contentWrapperStyle}>
                <View style={cardStyle}>
                    <Text style={titleStyle}>{reminderPaywallCopy.screen2.headline}</Text>
                    <View
                        style={{
                            width: 120,
                            height: 120,
                            borderRadius: spacing.rounded,
                            backgroundColor: colors.ui.white,
                            alignItems: "center",
                            justifyContent: "center",
                            marginVertical: spacing.md,
                        }}
                    >
                        <Entypo name="bell" size={60} color={colors.ui.primary} />
                    </View>
                    <Text style={bodyStyle}>{reminderPaywallCopy.screen2.body}</Text>
                </View>
            </View>
        );
    };

    const renderThirdScreen = () => {
        return (
            <View style={contentWrapperStyle}>
                <View style={cardStyle}>
                    <Text style={titleStyle}>{reminderPaywallCopy.screen3.headline}</Text>
                    <View style={{ width: "100%", marginTop: spacing.sm }}>
                        {benefits.map((text) => (
                            <BenefitRow key={text} text={text} />
                        ))}
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
                    onPress={handleGoBack}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    style={{ alignSelf: "flex-start" }}
                >
                    <Entypo name="chevron-left" size={24} color={colors.text.primary} />
                </TouchableOpacity>
            </View>
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
                        <Text
                            style={{
                                ...typography.bodySemiBold,
                                textAlign: "center",
                                color: colors.text.primary,
                            }}
                        >
                            {reminderPaywallCopy.socialProof.headline}
                        </Text>
                        <Text style={bodyStyle}>
                            {reminderPaywallCopy.socialProof.testimonial}
                        </Text>
                        <Text
                            style={{
                                ...typography.bodySemiBold,
                                textAlign: "center",
                                color: colors.text.primary,
                            }}
                        >
                            {reminderPaywallCopy.urgencyLine}
                        </Text>
                        <Text style={bodyStyle}>{reminderPaywallCopy.pricingLine}</Text>
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
                        title={isLastScreen ? reminderPaywallCopy.cta : "Continue"}
                        onPress={() => {
                            if (activeScreen === 2) {
                                onCTAPress?.();
                                return;
                            }
                            setActiveScreen((prev) => prev + 1);
                        }}
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
                        <Text style={{ ...typography.body, textAlign: "center", color: colors.text.secondary }}>
                            {reminderPaywallCopy.restoreCta}
                        </Text>
                    </TouchableOpacity>
                    <Text
                        style={{
                            ...typography.body,
                            color: colors.text.secondary,
                            marginBottom: spacing.sm,
                            textAlign: "center",
                        }}
                    >
                        {reminderPaywallCopy.autoRenewLine}
                    </Text>
                    <Text style={{ ...typography.body, textAlign: "center", color: colors.text.secondary }}>
                        {reminderPaywallCopy.cancelLine}
                    </Text>
                </View>
            </View>
        );
    };

    const renderScreens = () => {
        return (
            <View style={{ flex: 1 }}>
                {activeScreen > 0 && renderHeader()}
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
