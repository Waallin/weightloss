import React from "react";
import { Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../../constants/colors";
import { spacing } from "../../../constants/spacing";
import { fonts } from "../../../constants/fonts";
import { textSizes, textStyles } from "../../../constants/texts";
import { globalStyles } from "../../../constants/globalStyles";

const STAR_SIZE = 18;

export interface SocialProofTestimonial {
  name: string;
  rating: number;
  ratingMax: number;
  headline: string;
  quote: string;
}

interface SocialProofItemProps {
    item: SocialProofTestimonial;
}

function renderStarIcons(rating: number, ratingMax: number) {
  const icons: React.ReactNode[] = [];
  for (let i = 0; i < ratingMax; i++) {
    const remainder = rating - i;
    const name: "star" | "star-half" | "star-border" =
      remainder >= 1 ? "star" : remainder >= 0.5 ? "star-half" : "star-border";
    const active = remainder >= 0.5;
    icons.push(
      <MaterialIcons
        key={i}
        name={name}
        size={STAR_SIZE}
        color={active ? colors.ui.primary : colors.ui.dotInactive}
      />
    );
  }
  return icons;
}

const SocialProofItem: React.FC<SocialProofItemProps> = ({ item }) => {
  const { rating, ratingMax, headline, quote, name } = item;

  return (
    <View
      style={{
        width: "100%",
        marginRight: spacing.md,
        padding: spacing.md,
        backgroundColor: colors.ui.componentBackground,
        borderWidth: 1,
        borderColor: colors.ui.cardBorder,
        borderRadius: spacing.borderRadius + 4,
        ...globalStyles.shadow,
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
        <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
          {renderStarIcons(rating, ratingMax)}
        </View>
        <Text
          style={{
            ...textStyles.secondary,
            fontSize: textSizes.sm,
            fontFamily: fonts.primary.medium,
            color: colors.text.secondary,
          }}
        >
          {rating.toFixed(1)} / {ratingMax}
        </Text>
      </View>

      <Text
        style={{
          fontFamily: fonts.primary.semiBold,
          fontSize: textSizes.lg,
          color: colors.text.primary,
          marginBottom: spacing.sm,
        }}
      >
        {headline}
      </Text>

      <Text
        style={{
          ...textStyles.secondary,
          fontSize: textSizes.sm,
          color: colors.text.secondary,
          fontStyle: "italic",
          lineHeight: 20,
        }}
      >
        {quote}
      </Text>

      <Text
        style={{
          ...textStyles.listItemMeta,
          marginTop: spacing.md,
          color: colors.text.secondary,
        }}
      >
        — {name}
      </Text>
    </View>
  );
};

export default React.memo(SocialProofItem);
