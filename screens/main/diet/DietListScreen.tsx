import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "../../../constants/colors";
import { globalStyles } from "../../../constants/globalStyles";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { spacing } from "../../../constants/spacing";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FoodItem from "./components/FoodItem";
import {
  dietFoodSearchPlaceholder,
  dietLabels,
  textSizes,
  textStyles,
} from "../../../constants/texts";
import useUserStore from "../../../stores/useUserStore";
import { fonts } from "../../../constants/fonts";
import { getDocuments } from "../../../services/firebase";
import { RecipeDetail, RootStackParamList } from "../../navigation/types";
import { serverTimestamp } from "firebase/firestore";
import { addToDiet } from "../../../services/firebase";
import useTodayDietStore from "../../../stores/useTodayDietStore";
import useTodayProgressStore from "../../../stores/useTodayProgressStore";
import useToastStore from "../../../stores/useToastStore";
import * as haptics from "expo-haptics";

const DietListScreen = () => {
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, "DietListScreen">>();
  const insets = useSafeAreaInsets();
  const { user } = useUserStore();
  const [foodList, setFoodList] = useState<any[]>([]);
  const [recipesList, setRecipesList] = useState<RecipeDetail[]>([]);
  const { todayDiet, setTodayDiet } = useTodayDietStore();
  const { todayProgress, setTodayProgress } = useTodayProgressStore();
  const { showToast } = useToastStore();
  useEffect(() => {
    getFoodList();
    getRecipeList();
  }, []);

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
    }
    setTodayProgress({
      ...todayProgress,
      points: {
        ...todayProgress.points,
        used: todayProgress.points.used + foodItem.points,
      },
    });

    setTodayDiet([...todayDiet, payload]);
    addToDiet(user?.email, payload);

    navigation.pop(2);
  };

  const getRecipeList = async () => {
    const recipeList = await getDocuments("recipes");
    setRecipesList((recipeList ?? []) as RecipeDetail[]);
  };

  const handleNavigateToRecipeDetailScreen = (recipe: RecipeDetail) => {
    haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("RecipeDetailScreen", { recipe });
  };

  const renderHeader = () => {
    return (
      <View
        style={{
          backgroundColor: colors.ui.background,
          paddingTop: insets.top + spacing.sm,
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
              fontFamily: fonts.primary.regular,
              fontSize: textSizes.md,
              color: colors.text.primary,
            }}
          />
        </View>
      </View>
    );
  };

  const renderFoodItems = () => {
    return (
      <View>
        <Text
          style={{
            ...textStyles.screenSectionTitle,
            marginBottom: spacing.md,
          }}
        >
          Food
        </Text>
        <View style={{ flex: 1 }}>
          {foodList.map((item) => (
            <FoodItem
              key={item.id}
              item={item}
              onPress={() => console.log(item)}
              onIconPress={() =>
                handleAddFoodItem(item)
              }
            />
          ))}
        </View>
      </View>
    );
  };

  const renderRecipesItems = () => {
    return (
      <View>
        <Text
          style={{
            ...textStyles.screenSectionTitle,
            marginBottom: spacing.md,
          }}
        >
          Recipes
        </Text>
        <View style={{ flex: 1 }}>
          {recipesList.map((item) => (
            <FoodItem
              key={item.id}
              item={item}
              onPress={() => handleNavigateToRecipeDetailScreen(item)}
              onIconPress={() =>
                handleAddFoodItem(item)
              }
            />
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={globalStyles.container}>
      {renderHeader()}
      <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
        {renderFoodItems()}
        {renderRecipesItems()}
      </ScrollView>
    </View>
  );
};

export default DietListScreen;
