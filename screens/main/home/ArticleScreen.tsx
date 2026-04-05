import { ScrollView, Text, View } from "react-native";
import React from "react";
import { RouteProp } from "@react-navigation/native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { globalStyles } from "../../../constants/globalStyles";
import { colors } from "../../../constants/colors";
import { fonts } from "../../../constants/fonts";
import { spacing } from "../../../constants/spacing";
import { textSizes, textStyles } from "../../../constants/texts";
import GoBackHeaderComponent from "../../../components/GoBackHeaderComponent";

const ICON_CONTAINER_SIZE = 52;

/** Placeholder article — swap for API data when ready */
const dummyArticle = {
  title: "How to drink more water daily",
  description: "Simple tricks that make it automatic",
  /** Matches home list card tint for article id 2 */
  accentColor: "#6BAFB2",
  content: `Stay within your points without thinking

Making progress doesn’t have to mean tracking every calorie or constantly doing math in your head.

In fact, the simpler your system is, the more likely you are to stick with it.

That’s where points come in.

Instead of overthinking every meal, points give you a clear and flexible way to stay on track. Each food has a value, and your goal is simply to stay within your daily range. No stress. No perfection needed.

You don’t have to get it right every time.

What matters is consistency over time.

Some days will be better than others—and that’s okay. With a points system, you always know where you stand, and small adjustments become easy.

Had a bigger meal? No problem. You can balance it out later.

This approach removes the mental load. You’re not constantly asking yourself:
“Is this too much?” or “Did I ruin my day?”

You just follow the structure—and keep going.

Over time, this builds something much more powerful than short-term results:
a sustainable routine.

And that’s where real progress happens.`,
};

export type ArticleScreenParams = {
  article?: {
    id: number;
    title: string;
    description: string;
    color: string;
  };
};

type ArticleScreenRouteProp = RouteProp<
  { ArticleScreen: ArticleScreenParams },
  "ArticleScreen"
>;

const ArticleScreen: React.FC<{ route: ArticleScreenRouteProp }> = ({
  route: _route,
}) => {
  const paragraphs = dummyArticle.content
    .split(/\n\n+/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={globalStyles.scrollContainer}
      style={{ ...globalStyles.container }}
    >
      <GoBackHeaderComponent title={dummyArticle.title} />

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
              backgroundColor: dummyArticle.accentColor,
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
                fontFamily: fonts.primary.bold,
                fontSize: textSizes.xl,
                color: colors.text.primary,
              }}
            >
              {dummyArticle.title}
            </Text>
            <Text style={{ ...textStyles.secondary, lineHeight: 22 }}>
              {dummyArticle.description}
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

        {paragraphs.map((paragraph, index) => (
          <Text
            key={`p-${index}`}
            style={{
              fontFamily: fonts.primary.regular,
              fontSize: textSizes.md,
              color: colors.text.primary,
              lineHeight: 24,
            }}
          >
            {paragraph}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
};

export default ArticleScreen;
