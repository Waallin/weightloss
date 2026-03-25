import { StyleSheet, Text, View, ScrollView } from "react-native";
import React from "react";
import { globalStyles } from "../../../constants/globalStyles";
import { colors } from "../../../constants/colors";
import { textSizes, textStyles } from "../../../constants/texts";
import ProgressComponents from "../../../components/ProgressComponents";
import { spacing } from "../../../constants/spacing";
import DailyTipsComponent from "./components/DailyTipsComponent";
import SmallWinComponent from "./components/SmallWinComponent";


const dailyTips = [
  {
    id: 1,
    title: "Reach 10k steps",
    description: "Take 10,000 steps today to stay active and healthy.",
    emoji: "🔥",
    color: "#FEB74F",
  },
  {
    id: 2,
    title: "Stop evening snacking",
    description: "Avoid late night snacking",
    emoji: "💧",
    color: "#51949F",
  },
  {
    id: 3,
    title: "Eat More Fruits",
    description: "Add one extra fruit to your meals today.",
    emoji: "🍉",
    color: "#E46651",
  },
  {
    id: 4,
    title: "Stretch Break",
    description: "Do a 5-minute stretch after lunch.",
    emoji: "🧘‍♂️",
    color: "#4FC3F7",
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
          height: 100,
          justifyContent: "center",
          paddingVertical: spacing.lg,
        }}
      >
        <Text
          style={{
            ...textStyles.primary,
            fontSize: textSizes.xxl,
            fontWeight: "bold",
          }}
        >
          Hi, Jane
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
          justifyContent: 'center',
        }}
      >
        <ProgressComponents
          title="Streak"
          description="Days"
          icon="fire"
          number={"24"}
        />
        <ProgressComponents
          title="Water"
          description="Glasses"
          icon="water"
          number={"4"}
        />
        <ProgressComponents
          title="Points"
          description="Left"
          icon="food-apple"
          number={"5"}
        />
        <ProgressComponents
          title="Steps"
          description="Today"
          icon="walk"
          number={"2k"}
        />
      </View>
    );
  };

  const renderDailyTipComponent = () => {
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
          Daily Tips
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            gap: spacing.md,
          }}
        >
          {dailyTips.map((tip) => (
            <DailyTipsComponent
              key={tip.id}
              title={tip.title}
              description={tip.description}
              emoji={tip.emoji}
              color={tip.color}
            />
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderPogressInsight = () => {
    return (
      <View style={{
        flexDirection: 'row',
        gap: spacing.md,
        backgroundColor: colors.ui.componentBackground, 
        borderRadius: spacing.borderRadius,
        padding: spacing.md,
        ...globalStyles.shadow,
        width: '100%',
        height: 100,
        alignItems: 'center',
      }}>
        <View style={{
          width: 50,
          height: 50,
          borderRadius: 50,
          backgroundColor: colors.ui.iconContainer,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Text style={{ fontSize: textSizes.xxxl, fontWeight: 'bold' }}>🎉</Text>
        </View>
        <View style={{
          flexDirection: 'column',
          gap: spacing.sm,
        }}>
          <Text style={{ fontSize: textSizes.lg, fontWeight: 'bold' }}>Weekly result</Text>
          <Text style={{ fontSize: textSizes.sm, color: colors.text.secondary }}>You walked 31,200 steps</Text>

        </View>
      </View>
    );
  };

  const renderSmallWins = () => {
    return (
      <View style={{
        gap: spacing.md,
        paddingVertical: spacing.lg,
      }}>
        <Text style={{
          ...textStyles.primary,
          fontSize: textSizes.lg,
          fontWeight: 'bold',
        }}>
          Small Wins
        </Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: spacing.md,
            justifyContent: 'flex-start',
            width: '100%',
          }}>
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
      }}
      style={{
        ...globalStyles.container,
      }}
    >
      {renderHeader()}
      {renderProgressComponents()}
      {renderDailyTipComponent()}
      {renderPogressInsight()}
      {renderSmallWins()}
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
