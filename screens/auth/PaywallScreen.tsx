import React from "react";
import {
  SafeAreaView,
  Text,
  View,
  ScrollView,
} from "react-native";
import { colors } from "../../constants/colors";
import { spacing } from "../../constants/spacing";
import { fonts } from "../../constants/fonts";
import { globalStyles } from "../../constants/globalStyles";
import RoundedButtonComponent from "../../components/RoundedButtonComponent";
import { useNavigation } from "@react-navigation/native";

const benefits = [
  "Unlimited workouts and plans",
  "Track progress and calories",
  "Personal goals and reminders",
];

const PaywallScreen: React.FC = () => {
  const navigation = useNavigation();
  const handleNext = () => {
    navigation.navigate("MainStack");
  };
  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView
        contentContainerStyle={globalStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <View
            style={{
              width: spacing.xxl * 1.5,
              height: spacing.xxl * 1.5,
              borderRadius: spacing.rounded,
              backgroundColor: colors.ui.secondaryBackground,
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              marginBottom: spacing.xl,
            }}
          >
            <View
              style={{
                width: spacing.xxl * 1.2,
                height: spacing.xxl * 1.2,
                borderRadius: spacing.rounded,
                backgroundColor: colors.ui.accentSoft,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.primary.medium,
                  fontSize: 28,
                  color: colors.ui.primary,
                }}
              >
                ✦
              </Text>
            </View>
          </View>

          <Text
            style={{
              fontFamily: fonts.primary.bold,
              fontSize: 24,
              color: colors.text.primary,
              textAlign: "center",
              marginBottom: spacing.sm,
            }}
          >
            Unlock everything
          </Text>
          <Text
            style={{
              fontFamily: fonts.primary.regular,
              fontSize: 14,
              color: colors.text.secondary,
              textAlign: "center",
              marginBottom: spacing.xl,
              paddingHorizontal: spacing.sm,
            }}
          >
            Get full access to all features and reach your goals faster.
          </Text>

          <View
            style={{
              backgroundColor: colors.ui.secondaryBackground,
              borderRadius: spacing.borderRadius,
              paddingVertical: spacing.lg,
              paddingHorizontal: spacing.lg,
            }}
          >
            {benefits.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: index < benefits.length - 1 ? spacing.md : 0,
                }}
              >
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: colors.ui.primary,
                    marginRight: spacing.sm,
                  }}
                />
                <Text
                  style={{
                    fontFamily: fonts.primary.regular,
                    fontSize: 14,
                    color: colors.text.primary,
                  }}
                >
                  {item}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ marginTop: spacing.xxl }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "baseline",
              justifyContent: "center",
              marginBottom: spacing.sm,
            }}
          >
            <Text
              style={{
                fontFamily: fonts.primary.bold,
                fontSize: 32,
                color: colors.ui.primary,
              }}
            >
              $4.99
            </Text>
            <Text
              style={{
                fontFamily: fonts.primary.regular,
                fontSize: 14,
                color: colors.text.secondary,
                marginLeft: spacing.xs,
              }}
            >
              / month
            </Text>
          </View>
          <Text
            style={{
              fontFamily: fonts.primary.regular,
              fontSize: 12,
              color: colors.text.secondary,
              textAlign: "center",
              marginBottom: spacing.lg,
            }}
          >
            Cancel anytime. 7-day free trial.
          </Text>

          <RoundedButtonComponent handleNext={handleNext} />

          <Text
            style={{
              fontFamily: fonts.primary.regular,
              fontSize: 12,
              color: colors.text.secondary,
              textAlign: "center",
            }}
          >
            Restore purchases
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PaywallScreen;
