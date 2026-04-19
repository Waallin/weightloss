import {
  Image,
  ImageSourcePropType,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useMemo } from "react";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PrimaryButtonComponent from "../../../components/PrimaryButtonComponent";
import { colors } from "../../../constants/colors";
import { fonts } from "../../../constants/fonts";
import { globalStyles } from "../../../constants/globalStyles";
import { spacing } from "../../../constants/spacing";
import {
  dietLabels,
  recipeDetailCopy,
  textSizes,
  textStyles,
} from "../../../constants/texts";
import { RootStackParamList } from "../../navigation/types";
import { addToDiet } from "../../../services/firebase";
import useUserStore from "../../../stores/useUserStore";
import { serverTimestamp } from "firebase/firestore";
import useTodayDietStore from "../../../stores/useTodayDietStore";
import useTodayProgressStore from "../../../stores/useTodayProgressStore";
const fallbackImage = require("../../../assets/potato.png");
import useToastStore from "../../../stores/useToastStore";
import * as haptics from "expo-haptics";
type RecipeDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "RecipeDetailScreen"
>;

interface RecipeDetailScreenProps {
  route: RecipeDetailScreenRouteProp;
}

const RecipeDetailScreen: React.FC<RecipeDetailScreenProps> = ({ route }) => {
  const { recipe } = route.params;
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { user } = useUserStore();
  const { todayDiet, setTodayDiet } = useTodayDietStore();
  const { todayProgress, setTodayProgress } = useTodayProgressStore();
  const { showToast } = useToastStore();
  const imageSource: ImageSourcePropType = useMemo(() => {
    if (recipe.imageUrl?.trim()) {
      return { uri: recipe.imageUrl.trim() };
    }
    return fallbackImage;
  }, [recipe.imageUrl]);

  const title = recipe.title ?? recipe.name ?? "";
  const pointsRaw = recipe.points ?? recipe.kudos;
  const pointsLabel =
    pointsRaw !== undefined && String(pointsRaw).trim() !== ""
      ? String(pointsRaw).trim()
      : null;

  const description = recipe.description?.trim() ?? "";
  const ingredients =
    recipe.ingredients?.filter((i) => (i.text ?? "").trim().length > 0) ?? [];
  const instructions =
    recipe.instructions?.filter((i) => (i.text ?? "").trim().length > 0) ?? [];

  const scrollBottomPadding = 150 + insets.bottom;


  const handleAddToDiet = async (recipe: any) => {
 
    haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
    showToast(recipe.title + " successfully added to your day");
    
    const payload = {
      sourceId: recipe.id,
      type: recipe.mealType,
      title: recipe.title,
      points: recipe.points,
      calories: recipe.calories,
      imagePath: recipe.imagePath,
      createdAt: serverTimestamp(),
    }

    setTodayProgress({
      ...todayProgress,
      points: {
        ...todayProgress.points,
        used: todayProgress.points.used + payload.points,
      },
    });
    setTodayDiet([...todayDiet, payload]);
    addToDiet(user?.email, payload);
    navigation.goBack();
  }
  const renderHeader = () => (
    <View
      style={{
        backgroundColor: colors.ui.background,
        paddingTop: insets.top + spacing.sm,
        paddingBottom: spacing.md,
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
    </View>
  );

  const renderHero = () => (
    <View
      style={{
        borderRadius: spacing.borderRadius,
        overflow: "hidden",
        backgroundColor: colors.ui.secondaryBackground,
        borderWidth: 1,
        borderColor: colors.ui.cardBorder,
      }}
    >
      <Image
        source={imageSource}
        style={{ width: "100%", aspectRatio: 16 / 9 }}
        resizeMode="cover"
      />
    </View>
  );

  const renderTitleRow = () => (
    <View
      style={{
        marginTop: spacing.md,
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: spacing.md,
      }}
    >
      <Text
        style={{
          ...textStyles.listItemTitle,
          fontSize: textSizes.xl,
          flex: 1,
          lineHeight: 26,
        }}
      >
        {title}
      </Text>
      {pointsLabel !== null ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "baseline",
            paddingHorizontal: spacing.sm,
            paddingVertical: spacing.xs,
            borderRadius: spacing.borderRadius,
            backgroundColor: colors.ui.foodPointsChipBackground,
          }}
        >
          <Text
            style={{
              ...textStyles.listItemEmphasis,
              fontSize: textSizes.sm,
            }}
          >
            {pointsLabel}
          </Text>
          <Text
            style={{
              ...textStyles.listItemMeta,
              marginLeft: spacing.xs,
              fontSize: textSizes.xs,
              color: colors.ui.primary,
            }}
          >
            {dietLabels.pointsSuffix}
          </Text>
        </View>
      ) : null}
    </View>
  );

  const renderDescription = () =>
    description.length > 0 ? (
      <Text
        style={{
          ...textStyles.listItemMeta,
          marginTop: spacing.md,
          lineHeight: 20,
        }}
      >
        {description}
      </Text>
    ) : null;

  const renderIngredients = () =>
    ingredients.length > 0 ? (
      <View style={{ marginTop: spacing.lg }}>
        <Text
          style={{
            ...textStyles.screenSectionTitle,
            marginBottom: spacing.md,
          }}
        >
          {recipeDetailCopy.ingredientsSection}
        </Text>
        {ingredients.map((ingredient, index) => (
          <View
            key={
              ingredient.id !== undefined
                ? String(ingredient.id)
                : `ingredient-${index}`
            }
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              marginBottom: spacing.sm,
              gap: spacing.sm,
            }}
          >
            <MaterialCommunityIcons
              name="circle-small"
              size={22}
              color={colors.ui.primary}
              style={{ marginTop: 2 }}
            />
            <Text
              style={{
                ...textStyles.primary,
                flex: 1,
                lineHeight: 22,
              }}
            >
              {ingredient.text}
            </Text>
          </View>
        ))}
      </View>
    ) : null;

  const renderInstructions = () =>
    instructions.length > 0 ? (
      <View style={{ marginTop: spacing.lg }}>
        <Text
          style={{
            ...textStyles.screenSectionTitle,
            marginBottom: spacing.md,
          }}
        >
          {recipeDetailCopy.instructionsSection}
        </Text>
        {instructions.map((instruction, index) => (
          <View
            key={
              instruction.id !== undefined
                ? String(instruction.id)
                : `instruction-${index}`
            }
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              marginBottom: spacing.md,
              gap: spacing.md,
            }}
          >
            <View
              style={{
                minWidth: 28,
                height: 28,
                borderRadius: spacing.borderRadius,
                backgroundColor: colors.ui.primary,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.primary.semiBold,
                  fontSize: textSizes.sm,
                  color: colors.ui.white,
                }}
              >
                {index + 1}
              </Text>
            </View>
            <Text
              style={{
                ...textStyles.primary,
                flex: 1,
                lineHeight: 22,
              }}
            >
              {instruction.text}
            </Text>
          </View>
        ))}
      </View>
    ) : null;

  const renderCTA = () => (
    <View style={{ marginTop: spacing.lg }}>
      <PrimaryButtonComponent
        title={"Add meal"}
        onPress={() => handleAddToDiet(recipe)}
      />
    </View>
  );

  return (
    <View style={globalStyles.container}>
      {renderHeader()}
      <ScrollView
      showsVerticalScrollIndicator={false}
        contentContainerStyle={[
     { paddingBottom: 50}
          
        ]}
      >
        {renderHero()}
        {renderTitleRow()}
        {renderDescription()}
        {renderIngredients()}
        {renderInstructions()}
        {renderCTA()}
      </ScrollView>
    </View>
  );
};

export default RecipeDetailScreen;
