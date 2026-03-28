import { StyleSheet, Text, View, ScrollView } from "react-native";
import React from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { globalStyles } from "../../../constants/globalStyles";
import { colors } from "../../../constants/colors";
import { fonts } from "../../../constants/fonts";
import { textSizes, textStyles } from "../../../constants/texts";
import ProgressComponents from "../../../components/ProgressComponents";
import { spacing } from "../../../constants/spacing";
import ArticlesComponent from "./components/ArticlesComponent";
import SmallWinComponent from "./components/SmallWinComponent";
import { Ionicons } from "@expo/vector-icons";

const PROGRESS_INSIGHT_ICON_SIZE = 40;

const articles = [
  {
    id: 1,
    title: "Easy ways to reach 10k steps",
    description: "How to hit 10k steps without thinking about it.",
    color: "#F4B350",
  },
  {
    id: 2,
    title: "How to drink more water daily",
    description: "Simple tricks that make it automatic",
    color: "#6BAFB2",
  },
  {
    id: 3,
    title: "Stay within your points without thinking",
    description: "Make better choices without tracking everything.",
    color: "#F4B350",
  },
];

const smallWins = [
  {
    id: 1,
    title: "Good job",
    description: "Walked 3000 steps already!",
  },
  {
    id: 2,
    title: "You're on fire",
    description: "You've completed 20 minutes of yoga today!",
  },
];

const HomeScreen = () => {
  const renderHeader = () => {
    return (
      <View
        style={{
          justifyContent: "center",
           marginTop: spacing.lg,
        }}
      >
        <Text
          style={{
            ...textStyles.primary,
            fontSize: textSizes.xxl,
            fontWeight: "bold",
          }}
        >
          Your day
        </Text>
      </View>
    );
  };

  const renderProgressComponents = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: spacing.md,
          paddingBottom: spacing.lg,
          // justifyContent: 'center',
        }}
      >
        <ProgressComponents
          title="Water"
          icon="water"
          number={4}
          goal={10}
          microcopy="Keep sipping"
          width="47%"
        />
        <ProgressComponents
          title="Steps"
          icon="walk"
          number={2500}
          goal={10000}
          microcopy="You're on track"
          width="47%"
        />
        <ProgressComponents
          title="Points"
          icon="food-apple"
          number={5}
          goal={31}
          microcopy="26 left today"
          width="100%"
        />
      </View>
    );
  };

  const renderArticlesComponent = () => {
    return (
      <View
        style={{
          gap: spacing.md,
        }}
      >
        <Text
          style={{
            ...textStyles.primary,
            fontSize: textSizes.lg,
            fontWeight: "bold",
          }}
        >
          Get there easier
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            gap: spacing.md,
          }}
        >
          {articles.map((article) => (
            <ArticlesComponent
              key={article.id}
              title={article.title}
              description={article.description}
              color={article.color}

            />
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderProgressInsight = () => {
    return (
      <View
        style={{
          backgroundColor: colors.ui.componentBackground,
          borderRadius: spacing.borderRadius * 1.5,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.md,
          ...globalStyles.shadow,
          width: "100%",
        }}
      >
        <Text
          style={{
            ...textStyles.secondary,
            fontSize: textSizes.xxs,
            letterSpacing: 0.8,
            textTransform: "uppercase",
            opacity: 0.55,
            marginBottom: spacing.sm,
          }}
        >
          Today
        </Text>
        <View
          style={{
            flexDirection: "row",
            gap: spacing.md,
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: PROGRESS_INSIGHT_ICON_SIZE,
              height: PROGRESS_INSIGHT_ICON_SIZE,
              borderRadius: PROGRESS_INSIGHT_ICON_SIZE / 2,
              backgroundColor: colors.ui.iconContainer,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name="sparkles"
              size={24}
              color={colors.ui.primary}
            />
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              gap: spacing.sm,
              minWidth: 0,
            }}
          >
            <Text
              style={{
                ...textStyles.primary,
                fontFamily: fonts.primary.semiBold,
                fontSize: textSizes.lg,
                color: colors.text.primary,
              }}
            >
              2 of 3 done 👏
            </Text>
            <Text style={{ ...textStyles.listItemEmphasis }}>1 more to go</Text>
            <View
              style={{
                height: 6,
                borderRadius: 3,
                backgroundColor: colors.ui.dotInactive,
                overflow: "hidden",
                marginTop: spacing.xs,
              }}
            >
              <View
                style={{
                  width: "66.666%",
                  height: "100%",
                  backgroundColor: colors.ui.primary,
                  borderRadius: 3,
                }}
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderSmallWins = () => {
    return (
      <View
        style={{
          gap: spacing.md,
          paddingVertical: spacing.lg,
        }}
      >
        <Text
          style={{
            ...textStyles.primary,
            fontSize: textSizes.lg,
            fontWeight: "bold",
          }}
        >
          Small Wins
        </Text>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: spacing.md,
            justifyContent: "flex-start",
            width: "100%",
          }}
        >
          {smallWins.map((win) => (
            <SmallWinComponent
              key={win.id}
              title={win.title}
              description={win.description}
            />
          ))}
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: spacing.scrollViewBottomPadding,
        gap: spacing.homescreenGap,
      }}
      style={{
        ...globalStyles.container,
      }}
    >
      {renderHeader()}
      {renderProgressInsight()}
      {renderProgressComponents()}
      {renderArticlesComponent()}

    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
