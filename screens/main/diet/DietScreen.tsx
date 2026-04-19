import { Text, View } from "react-native";
import React, { useCallback, useMemo } from "react";
import { MotiView } from "moti";
import { ReduceMotion } from "react-native-reanimated";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { spacing } from "../../../constants/spacing";
import { globalStyles } from "../../../constants/globalStyles";
import { colors } from "../../../constants/colors";
import {
  dietLabels,
  getDietCalorieHeroMicroCopy,
  textSizes,
  textStyles,
} from "../../../constants/texts";
import { ScrollView } from "react-native-gesture-handler";
import { getFormattedDate } from "../../../utils/dateUtils";
import RoundedButtonComponent from "../../../components/RoundedButtonComponent";
import DietCalorieHeroComponent from "./components/DietCalorieHeroComponent";
import useTodayProgressStore from "../../../stores/useTodayProgressStore";
import useUserStore from "../../../stores/useUserStore";
import { useNavigation } from "@react-navigation/native";
import useTodayDietStore from "../../../stores/useTodayDietStore";
import AddedFoodItem, {
  AddedFoodItemData,
} from "./components/AddedFoodItem";
import * as haptics from "expo-haptics";
function mergeDietGroup(items: AddedFoodItemData[]): AddedFoodItemData {
  const first = items[0];
  let totalCalories = 0;
  let caloriesCount = 0;
  for (const entry of items) {
    if (entry.calories !== undefined && entry.calories !== null) {
      totalCalories += Number(entry.calories);
      caloriesCount += 1;
    }
  }
  let totalPoints = 0;
  let pointsNumeric = true;
  for (const entry of items) {
    const raw = entry.points;
    if (raw === undefined || raw === null || String(raw).trim() === "") {
      pointsNumeric = false;
      break;
    }
    const n = Number(raw);
    if (Number.isNaN(n)) {
      pointsNumeric = false;
      break;
    }
    totalPoints += n;
  }
  return {
    ...first,
    calories: caloriesCount > 0 ? totalCalories : first.calories,
    points: pointsNumeric ? totalPoints : first.points,
  };
}

function groupTodayDietBySourceId(
  entries: AddedFoodItemData[] | null | undefined
): { item: AddedFoodItemData; quantity: number }[] {
  if (!entries?.length) return [];
  const groups = new Map<string, AddedFoodItemData[]>();
  const keyOrder: string[] = [];
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const key =
      entry.sourceId?.trim() !== "" ? entry.sourceId : `__row_${i}`;
    if (!groups.has(key)) {
      groups.set(key, []);
      keyOrder.push(key);
    }
    groups.get(key)!.push(entry);
  }
  return keyOrder.map((key) => {
    const group = groups.get(key)!;
    return {
      item: mergeDietGroup(group),
      quantity: group.length,
    };
  });
}
import { useFocusEffect } from "@react-navigation/native";
const DietScreen = () => {
  const navigation = useNavigation();
  const { todayProgress } = useTodayProgressStore();
  const { todayDiet } = useTodayDietStore();

  const groupedTodayDiet = useMemo(
    () => groupTodayDietBySourceId(todayDiet ?? []),
    [todayDiet]
  );

  const pointsTotal = todayProgress?.points?.total ?? 0;
  const pointsUsed = todayProgress?.points?.used ?? 0;
  const pointsRemaining = pointsTotal - pointsUsed;
  const progressFill =
    pointsTotal > 0 ? (pointsUsed * 100) / pointsTotal : 0;

  const renderFoodItems = () => {
    return (
      <View>
        <Text
          style={{
            ...textStyles.screenSectionTitle,
            marginBottom: spacing.md,
          }}
        >
          Today's Diet
        </Text>
        <View style={{ flex: 1, gap: spacing.xs }}>
          {groupedTodayDiet.map(({ item, quantity }, index) => (
            <AddedFoodItem
              key={`${item.sourceId ?? "row"}-${index}`}
              item={item}
              quantity={quantity > 1 ? quantity : undefined}
              onPress={() => console.log(item)}
            />
          ))}
        </View>
      </View>
    );
  };

  const handleNavigateToDietListScreen = () => {
    haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("DietListScreen");
  };
  const renderHeroSection = () => {
    return (
      <MotiView
        from={{ opacity: 0, translateY: 10, scale: 0.98 }}
        animate={{ opacity: 1, translateY: 0, scale: 1 }}
        transition={{
          type: "timing",
          duration: 450,
          reduceMotion: ReduceMotion.Never,
        }}
      >
        <DietCalorieHeroComponent
          dateLabel={getFormattedDate(new Date())}
          eaten={pointsUsed}
          burned={12}
          microcopy={getDietCalorieHeroMicroCopy(pointsTotal, pointsUsed)}
          remaining={pointsRemaining}
          progressFill={progressFill}
        />
      </MotiView>
    );
  };
  const renderEmptyState = () => {
    if ((todayDiet?.length ?? 0) > 0) {
      return null;
    }
    return (
      <MotiView
        from={{ opacity: 0, translateY: 6 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{
          type: "timing",
          duration: 380,
          delay: 160,
          reduceMotion: ReduceMotion.Never,
        }}
        style={{
          marginTop: spacing.sm,
        }}
      >
        <View
          style={{
            alignItems: "center",
            paddingVertical: spacing.xl,
            paddingHorizontal: spacing.lg,
            backgroundColor: colors.ui.secondaryBackground,
            borderRadius: spacing.borderRadius * 2,
            borderWidth: 1,
            borderColor: colors.ui.cardBorder,
          }}
        >
          <MaterialCommunityIcons
            name="food-outline"
            size={28}
            color={colors.text.secondary}
            style={{ opacity: 0.9 }}
          />
          <Text
            style={{
              ...textStyles.listItemTitle,
              fontSize: textSizes.md,
              marginTop: spacing.md,
              textAlign: "center",
            }}
          >
            {dietLabels.emptyDietTitle}
          </Text>
          <Text
            style={{
              ...textStyles.secondary,
              marginTop: spacing.sm,
              textAlign: "center",
              lineHeight: textSizes.md * 1.35,
              maxWidth: 260,
            }}
          >
            {dietLabels.emptyDietSubtitle}
          </Text>
        </View>
      </MotiView>
    );
  };
  const renderButtonSection = () => {
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
          position: "absolute",
          bottom: 100,
          left: 0,
          right: 0,
          alignItems: "center",
          justifyContent: "center",
          padding: spacing.md,
        }}
      >
        <RoundedButtonComponent
          handleNext={handleNavigateToDietListScreen}
          icon="plus"
        />
      </MotiView>
    );
  };
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <ScrollView
        style={globalStyles.container}
        contentContainerStyle={globalStyles.scrollContainer}
      >
        {renderHeroSection()}
        {renderFoodItems()}
        {renderEmptyState()}
      </ScrollView>
      <View
        style={{
          position: "absolute",
          bottom: 20,
          left: 0,
          right: 0,
          alignItems: "center",
          justifyContent: "center",
          padding: spacing.md,
        }}
      >
        {renderButtonSection()}
      </View>
    </View>
  );
};

export default DietScreen;
