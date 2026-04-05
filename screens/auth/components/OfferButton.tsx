import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { colors } from "../../../constants/colors";
import { spacing } from "../../../constants/spacing";
import { fonts } from "../../../constants/fonts";
import { textSizes, textStyles } from "../../../constants/texts";
import { globalStyles } from "../../../constants/globalStyles";

export interface OfferButtonProps {
  title: string;
  /** Main price line, e.g. "349 kr / year" */
  priceLine: string;
  /** Short line under price, e.g. billing rhythm */
  caption?: React.ReactNode;
  /** Short line under price, e.g. billing rhythm */
  captionSubline?: React.ReactNode;
  /** Smaller hint, e.g. annualized weekly cost */
  footnote?: string;
  /** e.g. "Best value" */
  badge?: string;
  /** e.g. trial line — shown in a highlight strip */
  trialBadge?: string;
  /** Subtle premium gradient when selected (e.g. yearly plan) */
  premiumSelected?: boolean;
  selected: boolean;
  onPress: () => void;
}

const OfferButton: React.FC<OfferButtonProps> = ({
  title,
  priceLine,
  caption,
  captionSubline,
  footnote,
  badge,
  trialBadge,
  premiumSelected = false,
  selected,
  onPress,
}) => {
  const onPrimary = selected;
  const usePremiumGradient = premiumSelected && selected;
  const primaryText = onPrimary ? colors.ui.white : colors.text.primary;
  const secondaryText = onPrimary ? "rgba(255,255,255,0.88)" : colors.text.secondary;
  const mutedText = onPrimary ? "rgba(255,255,255,0.72)" : colors.text.secondary;

  const cardShellStyle = {
    borderRadius: spacing.borderRadius,
    borderWidth: selected ? 2 : 1,
    borderColor: selected ? colors.ui.primary : colors.ui.cardBorder,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
    ...(selected ? globalStyles.shadow : {}),
  };

  const cardInner = (
    <>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: spacing.xs,
          }}
        >
          <Text
            style={{
              fontFamily: fonts.primary.semiBold,
              fontSize: textSizes.sm,
              color: primaryText,
              flex: 1,
              paddingRight: spacing.xs,
            }}
          >
            {title}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {badge ? (
              <View
                style={{
                  paddingHorizontal: spacing.xs,
                  paddingVertical: spacing.xs / 2,
                  borderRadius: spacing.rounded,
                  marginRight: spacing.xs,
                  backgroundColor: selected
                    ? "rgba(255,255,255,0.22)"
                    : colors.ui.listRowIconBackground,
                }}
              >
                <Text
                  style={{
                    fontFamily: fonts.primary.semiBold,
                    fontSize: textSizes.xxs,
                    color: selected ? colors.ui.white : colors.ui.primary,
                  }}
                >
                  {badge}
                </Text>
              </View>
            ) : null}
            {selected ? (
              <MaterialCommunityIcons
                name="check-circle"
                size={18}
                color={colors.ui.white}
              />
            ) : (
              <View
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 9,
                  borderWidth: 1.5,
                  borderColor: colors.ui.cardBorder,
                }}
              />
            )}
          </View>
        </View>

        <Text
          style={{
            fontFamily: fonts.primary.bold,
            fontSize: textSizes.md,
            color: primaryText,
            marginBottom: caption || footnote ? spacing.xs : 0,
          }}
        >
          {priceLine}
        </Text>

        {caption ? (
          <Text
            style={{
              ...textStyles.secondary,
              fontSize: textSizes.xs,
              color: secondaryText,
              marginBottom: footnote ? spacing.xs : 0,
            }}
          >
            {caption}
          </Text>
        ) : null}
        {captionSubline ? (
          <Text
            style={{
              ...textStyles.secondary,
              fontSize: textSizes.xs,
              fontWeight: "800",
              color: secondaryText,
              marginTop: spacing.xs,
            }}
          >
            {captionSubline}
          </Text>
        ) : null}

        {footnote ? (
          <Text
            style={{
              fontFamily: fonts.primary.regular,
              fontSize: textSizes.xxs,
              color: mutedText,
              fontStyle: "italic",
            }}
          >
            {footnote}
          </Text>
        ) : null}

        {trialBadge ? (
          selected ? (
            <LinearGradient
              colors={[
                colors.ui.paywallTrialStripGradientStart,
                colors.ui.paywallTrialStripGradientMid,
                colors.ui.paywallTrialStripGradientEnd,
              ]}
              locations={[0, 0.48, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                marginTop: spacing.sm,
                paddingVertical: spacing.sm,
                paddingHorizontal: spacing.md,
                borderRadius: spacing.rounded,
                borderWidth: 1.5,
                borderColor: colors.ui.paywallTrialStripBorderSelected,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.primary.semiBold,
                  fontSize: textSizes.sm,
                  color: colors.ui.white,
                  textAlign: "center",
                  letterSpacing: 0.45,
                }}
              >
                {trialBadge}
              </Text>
            </LinearGradient>
          ) : (
            <View
              style={{
                marginTop: spacing.sm,
                paddingVertical: spacing.sm,
                paddingHorizontal: spacing.md,
                borderRadius: spacing.rounded,
                borderWidth: 1.5,
                borderColor: colors.ui.paywallTrialStripBorderUnselected,
                backgroundColor: colors.ui.paywallTrialStripUnselectedFill,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.primary.semiBold,
                  fontSize: textSizes.sm,
                  color: colors.ui.primary,
                  textAlign: "center",
                  letterSpacing: 0.35,
                }}
              >
                {trialBadge}
              </Text>
            </View>
          )
        ) : null}
    </>
  );

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      {usePremiumGradient ? (
        <LinearGradient
          colors={[
            colors.ui.paywallYearlySelectedGradientStart,
            colors.ui.paywallYearlySelectedGradientEnd,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={cardShellStyle}
        >
          {cardInner}
        </LinearGradient>
      ) : (
        <View
          style={{
            ...cardShellStyle,
            backgroundColor: selected
              ? colors.ui.primary
              : colors.ui.componentBackground,
          }}
        >
          {cardInner}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default React.memo(OfferButton);
