import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from "react-native";
import React, { useMemo } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { spacing } from "../../../../constants/spacing";
import { colors } from "../../../../constants/colors";
import { globalStyles } from "../../../../constants/globalStyles";
import { dietLabels, textSizes, textStyles } from "../../../../constants/texts";

export interface FoodItemData {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  points?: string;
  kudos?: string;
  imageUrl?: string;
  image?: ImageSourcePropType;
  mealType?: string;
  onIconPress: () => void;
}

interface FoodItemProps {
  item: FoodItemData;
  onPress: () => void;
  onIconPress: () => void;
  }

function formatMealTypeLabel(mealType: string): string {
  const trimmed = mealType.trim();
  if (!trimmed) return "";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}

const FoodItem: React.FC<FoodItemProps> = ({ item, onPress, onIconPress }) => {
  const thumbSize = spacing.xl * 2 + spacing.sm;

  const title = item.title ?? item.name ?? "";
  const description = item.description?.trim() ?? "";
  const pointsRaw = item.points ?? item.kudos;
  const pointsLabel =
    pointsRaw !== undefined && String(pointsRaw).trim() !== ""
      ? String(pointsRaw).trim()
      : null;

  const imageSource: ImageSourcePropType | null = useMemo(() => {
    if (item.imageUrl?.trim()) {
      return { uri: item.imageUrl.trim() };
    }
    if (item.image !== undefined) {
      return item.image;
    }
    return null;
  }, [item.image, item.imageUrl]);

  const mealLabel = item.mealType ? formatMealTypeLabel(item.mealType) : "";

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "stretch",
        padding: spacing.md,
        gap: spacing.md,
        borderRadius: spacing.borderRadius,
        backgroundColor: colors.ui.componentBackground,
        borderWidth: 1,
        borderColor: colors.ui.cardBorder,
        ...globalStyles.shadow,
      }}
    >
      <View
        style={{
          width: thumbSize,
          height: thumbSize,
          alignSelf: "center",
          borderRadius: spacing.borderRadius,
          overflow: "hidden",
          backgroundColor: colors.ui.secondaryBackground,
          borderWidth: 1,
          borderColor: colors.ui.cardBorder,
        }}
      >
        {imageSource ? (
          <Image
            source={imageSource}
            style={{ width: "100%", aspectRatio: 1 }}
            resizeMode="cover"
          />
        ) : null}
      </View>

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          minWidth: 0,
        }}
      >
        <Text
          numberOfLines={2}
          style={{
            ...textStyles.listItemTitle,
            lineHeight: 22,
          }}
        >
          {title}
        </Text>

        {description.length > 0 ? (
          <Text
            numberOfLines={2}
            style={{
              ...textStyles.listItemMeta,
              marginTop: spacing.xs,
              lineHeight: 20,
            }}
          >
            {description}
          </Text>
        ) : null}

        {(mealLabel.length > 0 || pointsLabel !== null) && (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "center",
              marginTop: spacing.sm,
              gap: spacing.sm,
            }}
          >
            {pointsLabel !== null ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "baseline",
                  paddingHorizontal: spacing.sm,
                  paddingVertical: spacing.xs,
                  borderRadius: spacing.borderRadius,
                  backgroundColor: colors.ui.foodPointsChipBackground,
                }}
              >
                <Text
                  style={{
                    ...textStyles.listItemEmphasis,
                    fontSize: textSizes.sm,
                  }}
                >
                  {pointsLabel}
                </Text>
                <Text
                  style={{
                    ...textStyles.listItemMeta,
                    marginLeft: spacing.xs,
                    fontSize: textSizes.xs,
                    color: colors.ui.primary,
                  }}
                >
                  {dietLabels.pointsSuffix}
                </Text>
              </View>
            ) : null}
          </View>
        )}
      </View>

      <TouchableOpacity
      onPress={onIconPress}
        style={{
          alignSelf: "center",
          width: 44,
          height: 44,
          borderRadius: spacing.rounded,
          backgroundColor: colors.ui.primary,
          justifyContent: "center",
          alignItems: "center",
          ...globalStyles.shadow,
        }}
      >
        <MaterialCommunityIcons name="plus" size={22} color={colors.ui.white} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default React.memo(FoodItem);
