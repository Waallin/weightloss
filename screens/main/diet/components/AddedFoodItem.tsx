import {
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { getDownloadURL, ref as storageRef } from "firebase/storage";
import { spacing } from "../../../../constants/spacing";
import { colors } from "../../../../constants/colors";
import { globalStyles } from "../../../../constants/globalStyles";
import { dietLabels, textSizes, textStyles, typography } from "../../../../constants/texts";
import { storage } from "../../../../services/firebaseConfig";

export interface AddedFoodItemData {
  sourceId: string;
  title: string;
  type: string;
  points?: number | string;
  calories?: number;
  imagePath?: string;
  createdAt?: { seconds: number; nanoseconds: number };
}

interface AddedFoodItemProps {
  item: AddedFoodItemData;
  /** When several entries share the same sourceId, show this count in a corner badge */
  quantity?: number;
  onPress: () => void;
}

function formatTypeLabel(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}

const AddedFoodItem: React.FC<AddedFoodItemProps> = ({
  item,
  quantity,
  onPress,
}) => {
  const thumbSize = spacing.xl * 2 + spacing.sm;
  const [resolvedImageUrl, setResolvedImageUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const path = item.imagePath?.trim();
    if (!path) {
      setResolvedImageUrl(null);
      return;
    }
    (async () => {
      try {
        const url = await getDownloadURL(storageRef(storage, path));
        if (!cancelled) {
          setResolvedImageUrl(url);
        }
      } catch {
        if (!cancelled) {
          setResolvedImageUrl(null);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [item.imagePath]);

  const title = item.title ?? "";
  const typeLabel = item.type ? formatTypeLabel(item.type) : "";

  const metaParts: string[] = [];
  if (item.calories !== undefined && item.calories !== null) {
    metaParts.push(`${item.calories} ${dietLabels.caloriesUnit}`);
  }
  if (typeLabel.length > 0) {
    metaParts.push(typeLabel);
  }
  const metaLine = metaParts.join(" · ");

  const pointsRaw = item.points;
  const pointsLabel =
    pointsRaw !== undefined && String(pointsRaw).trim() !== ""
      ? String(pointsRaw).trim()
      : null;

  const imageSource: ImageSourcePropType | null = useMemo(() => {
    if (resolvedImageUrl?.trim()) {
      return { uri: resolvedImageUrl.trim() };
    }
    return null;
  }, [resolvedImageUrl]);

  return (
    <View
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
      {quantity !== undefined && quantity > 1 ? (
        <View
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            minWidth: spacing.lg,
            height: spacing.lg,
            paddingHorizontal: spacing.xs,
            borderRadius: spacing.lg / 2,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.ui.primary,
            borderWidth: 2,
            borderColor: colors.ui.componentBackground,
          }}
        >
          <Text
            style={{
              ...typography.buttonSecondary,
              fontSize: textSizes.xs,
              color: colors.ui.white,
            }}
          >
            {quantity}
          </Text>
        </View>
      ) : null}

      <View
        style={{
          width: thumbSize,
          height: thumbSize,
          alignSelf: "center",
          borderRadius: spacing.borderRadius,
          overflow: "visible",
          backgroundColor: colors.ui.secondaryBackground,
          borderWidth: 1,
          borderColor: colors.ui.cardBorder,
        }}
      >
        <View
          style={{
            borderRadius: spacing.borderRadius,
            overflow: "hidden",
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

        {metaLine.length > 0 ? (
          <Text
            numberOfLines={2}
            style={{
              ...textStyles.listItemMeta,
              marginTop: spacing.xs,
              lineHeight: 20,
            }}
          >
            {metaLine}
          </Text>
        ) : null}

        {pointsLabel !== null ? (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "center",
              marginTop: spacing.sm,
              gap: spacing.sm,
            }}
          >
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
                }}
              >
                {pointsLabel}
              </Text>
              <Text
                style={{
                  ...typography.small,
                  marginLeft: spacing.xs,
                  color: colors.ui.primary,
                }}
              >
                {dietLabels.pointsSuffix}
              </Text>
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default React.memo(AddedFoodItem);
