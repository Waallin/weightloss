import { Text, View, ScrollView, Alert } from "react-native";
import React, { use, useCallback, useEffect, useState } from "react";
import { MotiView } from "moti";
import { ReduceMotion, steps } from "react-native-reanimated";
import { globalStyles } from "../../../constants/globalStyles";
import { colors } from "../../../constants/colors";
import {
  getHomePointsMicroCopy,
  lineHeights,
  textStyles,
  typography,
} from "../../../constants/texts";
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
const currentYear = new Date().getFullYear()
import { RootStackParamList } from "../../navigation/types";
import useUserStore from "../../../stores/useUserStore";
import { updateTodayProgress } from "../../../services/firebase";
import { increment } from "firebase/firestore";
import { useTodaySteps } from "../../../services/healthkit";
import { calculatePoints } from "../../../services/dietPoints";
const PROGRESS_INSIGHT_ICON_SIZE = 40;
import { syncToday } from "../../../services/firebase";

const articles = [
  {
    id: 1,

    title: "How points work",

    description: "A simple way to stay on track without counting calories.",

    content: 
    `Instead of tracking calories, we use a simple point system.

Each meal has a point value based on how it affects your progress. At the start of the day, you get a set number of points.

Every time you eat, you use points. Stay within your points and you're on track.

Why not calories?

Counting calories works, but it's hard to stick to.

You have to measure everything. It's easy to underestimate. And it quickly becomes stressful.

Most people don’t fail because it doesn’t work. They fail because it’s too complicated.

Why this works better

Points are designed to be simple.

You don’t need to think about numbers all day. Just stay within your points.

Meals are already balanced to keep you full and satisfied. No guessing. No overthinking.`,

    color: "#F4B350",
  },
  {
    id: 2,
  
    title: "Stay within your points",
  
    description: "Simple habits that make it easy to stay on track.",
  
    content: `Staying within your points doesn’t have to be hard.
  
  It’s not about being perfect. It’s about making simple choices throughout the day.
  
  Start with meals that keep you full.
  
  Balanced meals help you avoid cravings and make it easier to stay in control.
  
  Don’t wait until you're starving.
  
  When you get too hungry, it’s harder to make good decisions. Try to eat regularly.
  
  Keep it simple.
  
  You don’t need to overthink every meal. Stick to foods and recipes that you know work.
  
  If you're unsure, go for the simpler option.
  
  Leave some room.
  
  You don’t have to use all your points early in the day. Saving a few gives you flexibility later.
  
  And remember:
  
  One meal doesn’t decide your day.
  
  If something goes off plan, just get back on track with your next choice.
  
  That’s how progress happens.`,
  
    color: "#6FCF97",
  },
  {
    id: 3,
  
    title: "Went over your points?",
  
    description: "What to do when things don’t go as planned.",
  
    content: `Went over your points today?
  
  It’s okay.
  
  This happens to everyone. One day will not ruin your progress.
  
  What matters is what you do next.
  
  Don’t try to fix everything at once.
  
  You don’t need to skip meals or “make up for it”. Just get back to normal.
  
  Your next meal is a new chance.
  
  Make a simple choice. Stay within your points. Move on.
  
  Progress isn’t about being perfect.
  
  It’s about being consistent over time.
  
  Most people don’t fail because of one bad day. They fail because they give up after it.
  
  So don’t.
  
  Just continue.
  
  You’re still on track.`,
  
    color: "#56CCF2",
  },
  {
    id: 4,
  
    title: "Consistency beats perfection",
  
    description: "Why small wins every day lead to real results.",
  
    content: `You don’t need to be perfect to see results.
  
  You just need to be consistent.
  
  Most people think they have to follow the plan perfectly every day.
  
  But that’s not how progress works.
  
  Some days will be better than others.
  
  You might go over your points. You might miss a goal. That’s normal.
  
  What matters is that you keep going.
  
  Small actions, repeated over time, create real change.
  
  One good day won’t transform you.
  
  But many consistent days will.
  
  So don’t focus on being perfect.
  
  Focus on showing up.
  
  Stay within your points most days. Move your body when you can. Keep it simple.
  
  That’s enough.
  
  That’s how it works.
  
  And that’s how you win.`,
  
    color: "#BB6BD9",
  }, 
  {

    id: 5,
  
    title: "Reach 10k steps easily",
  
    description: "Simple ways to move more without overthinking it.",
  
    content: `Reaching 10,000 steps doesn’t have to be hard.
  
  You don’t need long workouts or a strict routine. Small movements throughout the day add up quickly.
  
  Start by walking more in your daily life.
  
  Take the stairs. Walk while on the phone. Park a bit further away. These small changes make a big difference.
  
  Break it up.
  
  You don’t have to hit 10k in one go. A few short walks during the day are enough.
  
  Make it part of your routine.
  
  Go for a walk after meals. Add a quick walk in the morning or evening. Keep it simple.
  
  And remember:
  
  More steps give you more flexibility.
  
  Moving more means you burn more, which gives you more room to eat.
  
  It’s not about being perfect.
  
  It’s about moving a little more than yesterday.
  
  That’s enough.`,
  
    
  
    color: "#27AE60",
  
  }
];

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { todayProgress, setTodayProgress } = useTodayProgressStore();

  const { setVisibleConfetti } = useConfettiStore();
  const todaySteps = useTodaySteps();
  const [claimStepsReward, setClaimStepsReward] = useState(
    todayProgress?.progress.steps >= 10000 &&
      todayProgress?.completion.steps === false,
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
      handleSyncToday();
    }, []),
  );
  
  
  const handleSyncToday = async () => {
    const points = calculatePoints(
      user?.currentWeight ?? user?.startWeight,
      user?.height ?? 0,
      currentYear - user?.birthYear,
      user?.gender ?? "Male",
      todaySteps,
    );

    const syncedDay = await syncToday(user.email as string, todaySteps, points);
    if (syncedDay != null) {
      setTodayProgress(syncedDay);
    }
  };
  
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

  const returnPointsMicroCopy = () => {
    const total = todayProgress?.points?.total ?? 0;
    const used = todayProgress?.points?.used ?? 0;
    return getHomePointsMicroCopy(total, used);
  };

  const returnWaterMicroCopy = () => {
    const water = todayProgress?.progress?.water ?? 0;

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
            ...textStyles.screenSectionTitle,
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
    if (!todayProgress?.progress) {
      return;
    }

    const currentWater = todayProgress.progress.water ?? 0;
    const nextWater = currentWater + 1;
    const reachedGoal = nextWater >= 10;

    setTodayProgress({
      ...todayProgress,
      progress: {
        ...todayProgress.progress,
        water: nextWater,
      },
      ...(reachedGoal
        ? {
            completion: {
              ...todayProgress.completion,
              water: true,
            },
          }
        : {}),
    });

    updateTodayProgress(user?.email as string, {
      "progress.water": increment(1),
      ...(reachedGoal ? { "completion.water": true } : {}),
    });

    if (reachedGoal) {
      setVisibleConfetti(true);
    }
  };

  const handleClaimPointsReward = () => {
    if (todayProgress?.completion?.points === true) {
      return;
    }
    Alert.alert(
      "Are you sure?",
      "You will not be able to change your points for today",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Complete the day",
          onPress: () => {
            setVisibleConfetti(true);
            setTodayProgress({
              ...todayProgress,
              completion: {
                ...todayProgress.completion,
                points: true,
              },
            });
            updateTodayProgress(user?.email as string, {
              "completion.points": true,
            });
          },
        },
      ],
    );
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
          number={todayProgress?.progress?.water ?? 0}
          goal={10}
          microcopy={returnWaterMicroCopy()}
          width="48%"
          type="water"
          onPress={() => handleAddWater()}
          completed={todayProgress?.completion?.water === true}
        />
        <ProgressComponents
          title="Steps"
          icon="walk"
          number={todayProgress?.progress?.steps ?? 0}
          goal={10000}
          microcopy={returnStepsMicroCopy()}
          width="48%"
          type="steps"
          completed={todayProgress?.completion?.steps === true}
          claimRewardPress={() => handle10kSteps()}
          claimReward={claimStepsReward}
        />
        <ProgressComponents
          title="Points"
          icon="food-apple"
          completed={todayProgress?.completion?.points === true}
          number={todayProgress?.points?.used ?? 0}
          goal={todayProgress?.points?.total ?? 0}
          microcopy={returnPointsMicroCopy()}
          type="points"
          onPress={() => handleClaimPointsReward()}
          width="100%"
          description="Mark today as done"
        />
      </MotiView>
    );
  };

  const handleArticlePress = (article: any) => {
    haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("ArticleScreen", { article });
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
            ...typography.caption,
            color: colors.text.secondary,
            letterSpacing: 0.8,
            textTransform: "uppercase",
            opacity: 0.55,
            lineHeight: lineHeights.caption,
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
                ...typography.subheadline,
                color: colors.text.primary,
              }}
            >
              {overallProgress} of 3 habits done 👏
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
            ...textStyles.screenSectionTitle,
          }}
        >
          Tips for success
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            gap: spacing.md,
          }}
        >
          {articles.map((article, index) => (
            <ArticlesComponent
              onPress={() => handleArticlePress(article)}
              key={index}
              article={article}
            />
          ))}
        </ScrollView>
      </MotiView>
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
