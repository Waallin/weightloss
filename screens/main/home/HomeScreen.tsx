import { Text, View, ScrollView } from "react-native";
import React, { use, useCallback, useEffect, useState } from "react";
import { MotiView } from "moti";
import { ReduceMotion } from "react-native-reanimated";
import { globalStyles } from "../../../constants/globalStyles";
import { colors } from "../../../constants/colors";
import { fonts } from "../../../constants/fonts";
import { textSizes, textStyles } from "../../../constants/texts";
import ProgressComponents from "../../../components/ProgressComponents";
import { spacing } from "../../../constants/spacing";
import ArticlesComponent from "./components/ArticlesComponent";
import SmallWinComponent from "./components/SmallWinComponent";
import { Ionicons } from "@expo/vector-icons";
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import * as haptics from "expo-haptics";
import useConfettiStore from "../../../stores/useConfettiStore";
import useTodayProgressStore from "../../../stores/useTodayProgressStore";

import {
  PermissionStatus,
  useHealthKitPermissions,
} from "../../../services/healthkit";
import { RootStackParamList } from "../../navigation/types";
import useUserStore from "../../../stores/useUserStore";
import {  updateTodayProgress } from "../../../services/firebase";
import { increment } from "firebase/firestore";
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
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { status, requestPermission } = useHealthKitPermissions();
  const { todayProgress, setTodayProgress } = useTodayProgressStore();
  console.log("🚀 ~ HomeScreen ~ todayProgress:", todayProgress);

  const { setVisibleConfetti } = useConfettiStore();
  const [claimStepsReward, setClaimStepsReward] = useState(
    todayProgress?.progress.steps >= 10000 &&
      todayProgress?.completion.steps === false,
  );
  const [waterCount, setWaterCount] = useState(
    todayProgress?.progress?.water ?? 0,
  );
  const { user } = useUserStore();
  const [overallProgress, setOverallProgress] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const completed = Object.values(todayProgress?.completion ?? {}).filter(
        (completion: any) => completion === true,
      ).length;
      setOverallProgress(completed);
    }, [todayProgress]),
  );

  useFocusEffect(
    useCallback(() => {
      if (
        status?.status === PermissionStatus.DENIED &&
        status?.canAskAgain === false
      ) {
        return;
      }
      void requestPermission();
    }, [requestPermission, status?.status, status?.canAskAgain]),
  );

  const returnStepsMicroCopy = () => {
    const steps = todayProgress?.progress?.steps ?? 0;

    if (steps >= 10000) {
      return "10k done! Congratulations";
    } else if (steps >= 9000) {
      return "So close. Just a little push left";
    } else if (steps >= 8000) {
      return "Almost there. Keep moving";
    } else if (steps >= 7000) {
      return "Great pace. You're getting close";
    } else if (steps >= 6000) {
      return "Nice work. Keep it going";
    } else if (steps >= 5000) {
      return "Halfway there. Stay consistent";
    } else if (steps >= 4000) {
      return "Good momentum. Keep walking";
    } else if (steps >= 3000) {
      return "You're off to a solid start";
    } else if (steps >= 2000) {
      return "Nice start. Let's build on it";
    } else if (steps >= 1000) {
      return "Good start. Keep moving";
    } else {
      return "Let’s get started today";
    }
  };

  const returnWaterMicroCopy = () => {
    const water = waterCount;

    if (water >= 10) {
      return "Hydration goal reached ";
    } else if (water >= 8) {
      return "Almost there. Keep sipping";
    } else if (water >= 6) {
      return "Great job. You're doing well";
    } else if (water >= 4) {
      return "Nice progress. Keep it up";
    } else if (water >= 2) {
      return "Good start. Stay hydrated";
    } else if (water >= 1) {
      return "Nice start ";
    } else {
      return "Let’s get your first glass in";
    }
  };

  const renderHeader = () => {
    return (
      <MotiView
        from={{ opacity: 0, translateY: 10, scale: 0.98 }}
        animate={{ opacity: 1, translateY: 0, scale: 1 }}
        transition={{
          type: "timing",
          duration: 450,
          reduceMotion: ReduceMotion.Never,
        }}
        style={{
          justifyContent: "center",
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
      </MotiView>
    );
  };

  const handleProgressComponentPress = (component: string) => {
    haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
  };

  const handle10kSteps = () => {
    updateTodayProgress(user?.email as string, {
      "completion.steps": true,
    });
    setClaimStepsReward(false);
    setVisibleConfetti(true);
  };

  const handleAddWater = () => {
    updateTodayProgress(user?.email as string, {
      "progress.water": increment(1),
    });

    setWaterCount((prev: number) => prev + 1);

    if (waterCount == 9) {
      updateTodayProgress(user?.email as string, {
        "completion.water": true,
      });
      setVisibleConfetti(true);
    }
  };

  const renderProgressComponents = () => {
    return (
      <MotiView
        from={{ opacity: 0, translateY: 10, scale: 0.98 }}
        animate={{ opacity: 1, translateY: 0, scale: 1 }}
        transition={{
          type: "timing",
          duration: 450,
          delay: 160,
          reduceMotion: ReduceMotion.Never,
        }}
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: spacing.md,
        }}
      >
        <ProgressComponents
          title="Water"
          icon="water"
          number={waterCount}
          goal={10}
          microcopy={returnWaterMicroCopy()}
          width="47%"
          onPress={() => handleAddWater()}
        />
        <ProgressComponents
          title="Steps"
          icon="walk"
          number={todayProgress?.progress?.steps ?? 0}
          goal={10000}
          microcopy={returnStepsMicroCopy()}
          width="47%"
          claimRewardPress={() => handle10kSteps()}
          claimReward={claimStepsReward}
        />
        <ProgressComponents
          title="Points"
          icon="food-apple"
          number={todayProgress?.points?.used ?? 0}
          goal={todayProgress?.points?.total ?? 0}
          microcopy={`${todayProgress?.points?.left ?? 0} left today`}
          width="100%"
          claimRewardPress={() => handleProgressComponentPress("Points")}
        />
      </MotiView>
    );
  };

  const handleArticlePress = (article: any) => {
    haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("ArticleScreen", { article });
  };

  const renderArticlesComponent = () => {
    return (
      <MotiView
        from={{ opacity: 0, translateY: 10, scale: 0.98 }}
        animate={{ opacity: 1, translateY: 0, scale: 1 }}
        transition={{
          type: "timing",
          duration: 450,
          delay: 220,
          reduceMotion: ReduceMotion.Never,
        }}
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
              onPress={() => handleArticlePress(article)}
              key={article.id}
              title={article.title}
              description={article.description}
              color={article.color}
            />
          ))}
        </ScrollView>
      </MotiView>
    );
  };

  const renderProgressInsight = () => {
    return (
      <MotiView
        from={{ opacity: 0, translateY: 10, scale: 0.98 }}
        animate={{ opacity: 1, translateY: 0, scale: 1 }}
        transition={{
          type: "timing",
          duration: 450,
          delay: 100,
          reduceMotion: ReduceMotion.Never,
        }}
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
            <Ionicons name="sparkles" size={24} color={colors.ui.primary} />
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
              {overallProgress} of 3 done 👏
            </Text>
            <Text style={{ ...textStyles.listItemEmphasis }}>
              {3 - overallProgress} more to go
            </Text>
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
                  width: `${(overallProgress / 3) * 100}%`,
                  height: "100%",
                  backgroundColor: colors.ui.primary,
                  borderRadius: 3,
                }}
              />
            </View>
          </View>
        </View>
      </MotiView>
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
      contentContainerStyle={globalStyles.scrollContainer}
      style={globalStyles.container}
    >
      {renderHeader()}
      {renderProgressInsight()}
      {renderProgressComponents()}
      {renderArticlesComponent()}
    </ScrollView>
  );
};

export default HomeScreen;
