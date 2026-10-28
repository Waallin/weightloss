import React from "react";
import { Image, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../../constants/colors";
import { spacing } from "../../../constants/spacing";
import { typography } from "../../../constants/texts";
import { globalStyles } from "../../../constants/globalStyles";

const STAR_SIZE = 14;
const AVATAR_SIZE = 32;

export interface SocialProofTestimonial {
  name: string;
  role: string;
  rating: number;
  ratingMax: number;
  headline: string;
  quote: string;
  avatarColor: string;
  avatarImage?: number;
  // Phrases in the headline to emphasise (premium variant only)
  highlights?: string[];
}

interface SocialProofItemProps {
    item: SocialProofTestimonial;
    // "premium" is the elevated card used on the social proof screen; the default card is used on the paywall
    variant?: "default" | "premium";
}

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Renders text with the given phrases emphasised in bold primary green
function renderHighlighted(text: string, highlights: string[] = []) {
  const phrases = highlights.filter(Boolean);
  if (phrases.length === 0) return text;
  const pattern = new RegExp(`(${phrases.map(escapeRegExp).join("|")})`, "gi");
  const lowered = phrases.map((phrase) => phrase.toLowerCase());
  return text.split(pattern).map((part, index) =>
    lowered.includes(part.toLowerCase()) ? (
      <Text
        key={index}
        style={{
          fontWeight: "700",
          color: colors.ui.primary,
        }}
      >
        {part}
      </Text>
    ) : (
      part
    ),
  );
}

function renderStarIcons(rating: number, ratingMax: number) {
  const filled = Math.round(rating);
  const icons: React.ReactNode[] = [];
  for (let i = 0; i < ratingMax; i++) {
    icons.push(
      <MaterialIcons
        key={i}
        name="star"
        size={STAR_SIZE}
        color={i < filled ? colors.ui.primary : colors.ui.dotInactive}
      />
    );
  }
  return icons;
}

const SocialProofItem: React.FC<SocialProofItemProps> = ({ item, variant = "default" }) => {
  const {
    rating,
    ratingMax,
    headline,
    quote,
    name,
    role,
    avatarColor,
    avatarImage,
    highlights,
  } = item;

  if (variant === "premium") {
    return (
      <View
        style={{
          width: "100%",
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.lg,
          paddingBottom: spacing.md + 2,
          backgroundColor: colors.ui.componentBackground,
          borderWidth: 1,
          borderColor: colors.ui.cardBorder,
          borderRadius: spacing.borderRadius + 10,
          overflow: "hidden",
          ...globalStyles.shadow,
          shadowOpacity: 0.07,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 8 },
        }}
      >
        <View
          style={{
            position: "absolute",
            top: 0,
            left: spacing.lg,
            width: 36,
            height: 3,
            borderBottomLeftRadius: 3,
            borderBottomRightRadius: 3,
            backgroundColor: colors.ui.primary,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: spacing.sm,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
            {renderStarIcons(rating, ratingMax)}
          </View>
          <MaterialIcons
            name="format-quote"
            size={30}
            color={colors.ui.primary}
            style={{ opacity: 0.25 }}
          />
        </View>

        <Text
          style={{
            ...typography.cardTitle,
            color: colors.text.primary,
            marginBottom: spacing.xs + 2,
            letterSpacing: -0.2,
          }}
        >
          {renderHighlighted(headline, highlights)}
        </Text>

        <Text
          style={{
            ...typography.body,
            color: colors.text.secondary,
            lineHeight: 23,
          }}
        >
          {quote}
        </Text>

        <View
          style={{
            height: 1,
            backgroundColor: colors.ui.cardBorder,
            marginTop: spacing.md,
            marginBottom: spacing.md - 2,
          }}
        />

        <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm + 2 }}>
          <View
            style={{
              width: AVATAR_SIZE + 8,
              height: AVATAR_SIZE + 8,
              borderRadius: (AVATAR_SIZE + 8) / 2,
              borderWidth: 2,
              borderColor: colors.ui.primary,
              padding: 2,
              backgroundColor: colors.ui.componentBackground,
            }}
          >
            <View
              style={{
                flex: 1,
                borderRadius: AVATAR_SIZE / 2,
                backgroundColor: avatarColor,
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {avatarImage ? (
                <Image
                  source={avatarImage}
                  resizeMode="cover"
                  style={{ width: "100%", height: "100%" }}
                />
              ) : (
                <MaterialIcons name="person" size={20} color={colors.text.secondary} />
              )}
            </View>
          </View>
          <View>
            <Text style={{ ...typography.bodySemiBold, color: colors.text.primary }}>
              {name}
            </Text>
            <Text style={{ ...typography.small, color: colors.text.secondary }}>
              {role}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View
      style={{
        width: "100%",
        padding: spacing.md,
        backgroundColor: colors.ui.componentBackground,
        borderWidth: 1,
        borderColor: colors.ui.cardBorder,
        borderRadius: spacing.borderRadius + 4,
        
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: spacing.sm,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {renderStarIcons(rating, ratingMax)}
        </View>
        <Text
          style={{
            ...typography.small,
            color: colors.text.secondary,
          }}
        >
          {rating.toFixed(1)}
        </Text>
      </View>

      <Text
        style={{
          ...typography.cardTitle,
          color: colors.text.primary,
          marginBottom: spacing.xs,
        }}
      >
        {headline}
      </Text>

      <Text
        style={{
          ...typography.body,
          color: colors.text.secondary,
          lineHeight: 20,
        }}
      >
        {quote}
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.sm,
          marginTop: spacing.md,
        }}
      >
        <View
          style={{
            width: AVATAR_SIZE,
            height: AVATAR_SIZE,
            borderRadius: AVATAR_SIZE / 2,
            backgroundColor: avatarColor,
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {avatarImage ? (
            <Image
              source={avatarImage}
              resizeMode="cover"
              style={{ width: "100%", height: "100%" }}
            />
          ) : (
            <MaterialIcons
              name="person"
              size={20}
              color={colors.text.secondary}
            />
          )}
        </View>
        <Text
          style={{
            ...typography.small,
            color: colors.text.secondary,
          }}
        >
          {name} · {role}
        </Text>
      </View>
    </View>
  );
};

export default React.memo(SocialProofItem);
