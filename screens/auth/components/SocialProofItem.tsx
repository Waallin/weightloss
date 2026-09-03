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
}

interface SocialProofItemProps {
    item: SocialProofTestimonial;
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

const SocialProofItem: React.FC<SocialProofItemProps> = ({ item }) => {
  const {
    rating,
    ratingMax,
    headline,
    quote,
    name,
    role,
    avatarColor,
    avatarImage,
  } = item;

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
