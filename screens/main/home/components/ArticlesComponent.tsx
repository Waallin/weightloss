import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { spacing } from "../../../../constants/spacing";
import { colors } from "../../../../constants/colors";
import { globalStyles } from "../../../../constants/globalStyles";
import { typography } from "../../../../constants/texts";

const CARD_WIDTH = 300;
const CARD_MIN_HEIGHT = 160;
const ICON_CONTAINER_SIZE = 48;
/** Light overlay on tinted cards — glass-style circle behind icon */
const ICON_GLASS_BG = "rgba(255, 255, 255, 0.25)";

const ArticlesComponent = ({
  article,
  onPress,
}: {
  article: any;
  onPress: (article: any) => void;
}) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(article)}
      style={{
        width: CARD_WIDTH,
        minHeight: CARD_MIN_HEIGHT,
        borderRadius: spacing.borderRadius * 1.5,
        backgroundColor: article.color,
        padding: spacing.md,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: spacing.sm,
        ...globalStyles.shadow,
        opacity: 0.9,
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          gap: spacing.sm,
          paddingRight: spacing.sm,
          minWidth: 0,
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            ...typography.titleBold,
            color: colors.text.primary,
          }}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {article.title}
        </Text>
        <Text
          style={{
            ...typography.body,
            color: colors.text.primary,
            opacity: 0.92,
          }}
          numberOfLines={3}
          ellipsizeMode="tail"
        >
          {article.description}
        </Text>
      </View>
      <View
        style={{
          width: ICON_CONTAINER_SIZE,
          height: ICON_CONTAINER_SIZE,
          borderRadius: ICON_CONTAINER_SIZE / 2,
          backgroundColor: ICON_GLASS_BG,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MaterialCommunityIcons
          name="book-open-page-variant"
          size={26}
          color={colors.text.primary}
        />
      </View>
    </TouchableOpacity>
  );
};

export default ArticlesComponent;
