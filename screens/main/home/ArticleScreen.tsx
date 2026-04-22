import { ScrollView, Text, View } from "react-native";
import React from "react";
import { RouteProp } from "@react-navigation/native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { globalStyles } from "../../../constants/globalStyles";
import { colors } from "../../../constants/colors";
import { spacing } from "../../../constants/spacing";
import { lineHeights, textStyles, typography } from "../../../constants/texts";
import GoBackHeaderComponent from "../../../components/GoBackHeaderComponent";

const ICON_CONTAINER_SIZE = 52;

export type ArticleScreenParams = {
    article: any;
};

type ArticleScreenRouteProp = RouteProp<
  { ArticleScreen: ArticleScreenParams },
  "ArticleScreen"
>;

const ArticleScreen: React.FC<{ route: ArticleScreenRouteProp }> = ({
  route: _route,
}) => {
  const article = _route.params.article;
  const content =
    typeof article?.content === "string" ? normalizeArticleContent(article.content) : "";

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={globalStyles.scrollContainer}
      style={{ ...globalStyles.container }}
    >
      <GoBackHeaderComponent title={article?.title || ""} />

      <View
        style={{
          borderRadius: spacing.borderRadius * 1.5,
          backgroundColor: colors.ui.componentBackground,
          borderWidth: 1,
          borderColor: colors.ui.cardBorder,
          padding: spacing.lg,
          gap: spacing.md,
          ...globalStyles.shadow,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.md,
          }}
        >
          <View
            style={{
              width: ICON_CONTAINER_SIZE,
              height: ICON_CONTAINER_SIZE,
              borderRadius: ICON_CONTAINER_SIZE / 2,
              backgroundColor: article?.color || "",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0.95,
            }}
          >
            <MaterialCommunityIcons
              name="book-open-page-variant"
              size={28}
              color={colors.text.primary}
            />
          </View>
          <View style={{ flex: 1, minWidth: 0, gap: spacing.xs }}>
            <Text
              style={{
                ...typography.headline,
                color: colors.text.primary,
              }}
            >
              {article?.title || ""}
            </Text>
            <Text style={{ ...textStyles.secondary, lineHeight: lineHeights.body }}>
              {article?.description || ""}
            </Text>
          </View>
        </View>

        <View
          style={{
            height: 1,
            backgroundColor: colors.ui.cardBorder,
            marginVertical: spacing.xs,
          }}
        />

        {article?.content && (
          <Text
            style={{
              ...typography.body,
              color: colors.text.primary,
              lineHeight: lineHeights.article,
              letterSpacing: 0.2,
              textAlign: "left",
            }}
          >
            {content}
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

function normalizeArticleContent(input: string): string {
  // Remove template-literal indentation and normalize paragraph spacing.
  const lines = input
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim());

  const collapsed: string[] = [];
  let previousWasEmpty = true;

  for (const line of lines) {
    const isEmpty = line.length === 0;
    if (isEmpty) {
      if (!previousWasEmpty) {
        collapsed.push("");
      }
      previousWasEmpty = true;
      continue;
    }
    collapsed.push(line);
    previousWasEmpty = false;
  }

  return collapsed.join("\n").trim();
}

export default ArticleScreen;
