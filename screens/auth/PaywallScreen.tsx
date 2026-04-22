import React from "react";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import DefaultPaywall from "./Paywalls/DefaultPaywall";
import ReminderPaywall from "./Paywalls/ReminderPaywall";
import useConfigStore from "../../stores/useConfigStore";
import { colors } from "../../constants/colors";
import { paywallCopy, textStyles, typography } from "../../constants/texts";
import { spacing } from "../../constants/spacing";

const PaywallScreen: React.FC = () => {
  const navigation = useNavigation();
  const { config } = useConfigStore();

  const handleCTAPress = () => {
    navigation.navigate("MainStack" as never);
  };

  if (config?.showPaywall === "default") {
    return <DefaultPaywall onCTAPress={handleCTAPress} />;
  }

  if (config?.showPaywall === "reminder") {
    return <ReminderPaywall onCTAPress={handleCTAPress} />;
  }

  return <DefaultPaywall onCTAPress={handleCTAPress} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.ui.background }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.xl,
          paddingBottom: spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <View style={{ gap: spacing.lg }}>
            <View style={{ gap: spacing.sm }}>
              <Text style={textStyles.onboardingTitle}>{paywallCopy.title}</Text>
              <Text style={textStyles.onboardingBody}>{paywallCopy.subtitle}</Text>
            </View>

            <View
              style={{
                backgroundColor: colors.ui.componentBackground,
                borderRadius: spacing.borderRadius,
                borderWidth: 1,
                borderColor: colors.ui.cardBorder,
                padding: spacing.lg,
                gap: spacing.md,
              }}
            >
              <Text style={textStyles.screenSectionTitle}>What you’ll get</Text>
              <View style={{ gap: spacing.sm }}>
                {paywallCopy.benefits.map((benefit) => (
                  <View
                    key={benefit}
                    style={{ flexDirection: "row", alignItems: "flex-start", gap: spacing.sm }}
                  >
                    <View
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        backgroundColor: colors.ui.listRowIconBackground,
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 1,
                      }}
                    >
                      <Text
                        style={{
                          ...typography.bodySemiBold,
                          color: colors.ui.primary,
                          lineHeight: 18,
                        }}
                      >
                        ✓
                      </Text>
                    </View>
                    <Text style={{ ...textStyles.primary, flex: 1 }}>{benefit}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View style={{ paddingTop: spacing.xl, gap: spacing.md }}>
            <Pressable
              onPress={handleCTAPress}
              style={{
                backgroundColor: colors.ui.primary,
                borderRadius: spacing.borderRadius,
                paddingVertical: spacing.md,
                paddingHorizontal: spacing.lg,
                alignItems: "center",
                justifyContent: "center",
              }}
              accessibilityRole="button"
              accessibilityLabel="Continue"
            >
              <Text style={{ ...typography.button, color: colors.ui.white }}>
                {paywallCopy.ctaYearlyTrial}
              </Text>
            </Pressable>

            <Text style={{ ...textStyles.secondary, textAlign: "center" }}>
              {paywallCopy.trialFootnote}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PaywallScreen;
