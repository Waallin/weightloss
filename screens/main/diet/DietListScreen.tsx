import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { colors } from "../../../constants/colors";
import { globalStyles } from "../../../constants/globalStyles";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { spacing } from "../../../constants/spacing";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FoodItem from "./components/FoodItem";
import {
  dietFoodSearchPlaceholder,
  typography,
} from "../../../constants/texts";
import useUserStore from "../../../stores/useUserStore";
import { getDocuments } from "../../../services/firebase";
import { RecipeDetail, RootStackParamList } from "../../navigation/types";
import { serverTimestamp } from "firebase/firestore";
import { addToDiet } from "../../../services/firebase";
import useTodayDietStore from "../../../stores/useTodayDietStore";
import useTodayProgressStore from "../../../stores/useTodayProgressStore";
import useToastStore from "../../../stores/useToastStore";
import * as haptics from "expo-haptics";
import { trackMixpanelEvent } from "../../../services/mixpanel";
import { MotiView } from "moti";
import RoundedButtonComponent from "../../../components/RoundedButtonComponent";
import { ReduceMotion } from "react-native-reanimated";
import { CameraView, useCameraPermissions } from "expo-camera";
type DietListTab = "food" | "recipes";

function itemTitleMatchesQuery(
  title: unknown,
  name: unknown,
  searchQuery: string,
): boolean {
  const q = searchQuery.trim().toLowerCase();
  if (!q) return true;
  const haystack = String(title ?? name ?? "").toLowerCase();
  return haystack.includes(q);
}

const DietListScreen = () => {
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, "DietListScreen">>();
  const route = useRoute<RouteProp<RootStackParamList, "DietListScreen">>();
  const insets = useSafeAreaInsets();
  const { user } = useUserStore();
  const [foodList, setFoodList] = useState<any[]>([]);
  const [recipesList, setRecipesList] = useState<RecipeDetail[]>([]);
  const { todayDiet, setTodayDiet } = useTodayDietStore();
  const { todayProgress, setTodayProgress } = useTodayProgressStore();
  const [showContent, setShowContent] = useState<DietListTab>(
    route.params?.initialTab ?? "food",
  );

  const [searchQuery, setSearchQuery] = useState("");
  const { showToast, isVisible } = useToastStore();
  useEffect(() => {
    getFoodList();
    getRecipeList();
  }, []);

  const filteredFoodList = useMemo(
    () =>
      foodList.filter((item) =>
        itemTitleMatchesQuery(item.title, item.name, searchQuery),
      ),
    [foodList, searchQuery],
  );

  const filteredRecipesList = useMemo(
    () =>
      recipesList.filter((item) =>
        itemTitleMatchesQuery(item.title, item.name, searchQuery),
      ),
    [recipesList, searchQuery],
  );

  const getFoodList = async () => {
    const foodList = await getDocuments("food");
    setFoodList(foodList);
  };

  const handleAddFoodItem = (foodItem: any) => {
    haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
    showToast(foodItem.title + " successfully added to your day");

    const payload = {
      sourceId: foodItem.id,
      type: foodItem.mealType,
      title: foodItem.title,
      points: foodItem.points,
      calories: foodItem.calories,
      imagePath: foodItem.imagePath,
      createdAt: serverTimestamp(),
    };
    setTodayProgress({
      ...todayProgress,
      points: {
        ...todayProgress.points,
        used: todayProgress.points.used + parseInt(foodItem.points),
      },
    });
    trackMixpanelEvent("food_added_to_diet", { foodItem: foodItem.title });
    setTodayDiet([...todayDiet, payload]);
    addToDiet(user?.email, payload);
  };

  const getRecipeList = async () => {
    const recipeList = await getDocuments("recipes");
    setRecipesList((recipeList ?? []) as RecipeDetail[]);
  };

  const handleNavigateToRecipeDetailScreen = (recipe: RecipeDetail) => {
    haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("RecipeDetailScreen", { recipe });
  };

  const handleNavigateToScanFoodScreen = () => {
    haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("ScanFoodScreen");
  };

  const renderHeader = () => {
    return (
      <View
        style={{
          backgroundColor: colors.ui.background,
          paddingTop: insets.top + spacing.sm,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
            style={{
              backgroundColor: colors.ui.componentBackground,
              borderRadius: spacing.borderRadius,
              ...globalStyles.shadow,
              justifyContent: "center",
              alignItems: "center",
              width: 44,
              height: 44,
            }}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={26}
              color={colors.text.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleNavigateToScanFoodScreen}
            style={{
              backgroundColor: colors.ui.componentBackground,
              borderRadius: spacing.borderRadius,
              ...globalStyles.shadow,
              justifyContent: "center",
              alignItems: "center",
              width: 44,
              height: 44,
            }}
          >
            <MaterialCommunityIcons
              name="camera"
              size={26}
              color={colors.ui.primary}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: spacing.md,
            minHeight: 56,
            paddingHorizontal: spacing.md,
            borderWidth: 1,
            borderColor: colors.ui.cardBorder,
            borderRadius: spacing.borderRadius,
            backgroundColor: colors.ui.white,
          }}
        >
          <MaterialCommunityIcons
            name="magnify"
            size={24}
            color={colors.text.secondary}
          />
          <TextInput
            placeholder={dietFoodSearchPlaceholder}
            placeholderTextColor={colors.text.secondary}
            style={{
              flex: 1,
              marginLeft: spacing.sm,
              paddingVertical: spacing.md,
              ...typography.titleMedium,
              color: colors.text.primary,
            }}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
    );
  };

  const renderFoodItems = () => {
    return (
      <View>
        <View style={{ flex: 1, gap: spacing.xs }}>
          {filteredFoodList.map((item) => (
            <FoodItem
              key={item.id}
              item={item}
              onPress={() => console.log(item)}
              onIconPress={() => handleAddFoodItem(item)}
            />
          ))}
        </View>
      </View>
    );
  };

  const renderRecipesItems = () => {
    return (
      <View>
        <View style={{ flex: 1, gap: spacing.xs }}>
          {filteredRecipesList.map((item) => (
            <FoodItem
              key={item.id}
              item={item}
              onPress={() => handleNavigateToRecipeDetailScreen(item)}
              onIconPress={() => handleAddFoodItem(item)}
            />
          ))}
        </View>
      </View>
    );
  };

  const renderTabs = () => {
    const segment = (key: DietListTab, label: string) => {
      const active = showContent === key;
      return (
        <TouchableOpacity
          key={key}
          activeOpacity={0.85}
          onPress={() => {
            if (showContent === key) return;
            haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
            setShowContent(key);
          }}
          style={{
            flex: 1,
            paddingVertical: spacing.sm,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: spacing.rounded,
            backgroundColor: active ? colors.ui.white : "transparent",
            borderWidth: active ? 1 : 0,
            borderColor: colors.ui.cardBorder,
            ...(active ? globalStyles.shadow : {}),
          }}
        >
          <Text
            style={{
              ...(active ? typography.bodySemiBold : typography.body),
              color: active ? colors.text.primary : colors.text.secondary,
            }}
          >
            {label}
          </Text>
        </TouchableOpacity>
      );
    };

    return (
      <View
        style={{
          flexDirection: "row",
          padding: spacing.xs,
          backgroundColor: colors.ui.secondaryBackground,
          borderRadius: spacing.rounded,
          marginBottom: spacing.md,
        }}
      >
        {segment("food", "Food")}
        {segment("recipes", "Recipes")}
      </View>
    );
  };

  const renderNote = () => {
    return (
      <View>
        <Text
          style={{
            ...typography.body,
            color: colors.text.secondary,
            textAlign: "center",
          }}
        >
          Points shown are for one portion
        </Text>
      </View>
    );
  };
  const renderContent = () => {
    return (
      <View>
        {showContent === "food" && renderFoodItems()}
        {showContent === "recipes" && renderRecipesItems()}
      </View>
    );
  };

  const renderScanFoodButton = () => {
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
          bottom: 40,
          left: 0,
          alignItems: "center",
          justifyContent: "center",
          padding: spacing.md,
        }}
      >
        <RoundedButtonComponent
          handleNext={() => console.log("test")}
          icon="plus"
        />
      </MotiView>
    );
  };

  return (
    <View style={globalStyles.container}>
      <ScrollView
        contentContainerStyle={globalStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderHeader()}
        {renderTabs()}
        {renderNote()}
        {renderContent()}
      </ScrollView>
    </View>
  );
};

export default DietListScreen;
