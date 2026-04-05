import { Text, View } from "react-native";
import React from "react";
import { MotiView } from "moti";
import { ReduceMotion } from "react-native-reanimated";
import { spacing } from "../../../constants/spacing";
import { globalStyles } from "../../../constants/globalStyles";
import { textSizes } from "../../../constants/texts";
import { textStyles } from "../../../constants/texts";
import { ScrollView } from "react-native-gesture-handler";
import { getFormattedDate } from "../../../utils/dateUtils";
import FoodItem from "./components/FoodItem";
import RoundedButtonComponent from "../../../components/RoundedButtonComponent";
import DietCalorieHeroComponent from "./components/DietCalorieHeroComponent";

import { useNavigation } from "@react-navigation/native";
const DietScreen = () => {
  const navigation = useNavigation();

  const handleFoodItemPress = (name: string) => {
    console.log(name);
  };

  const renderFoodItems = () => {
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
      >
        <Text
          style={{
            fontSize: textSizes.lg,
            fontWeight: "bold",
            marginBottom: spacing.md,
          }}
        >
          Today
        </Text>
        <View
          style={{
            gap: spacing.sm,
          }}
        >
          <FoodItem
            grams={100}
            image={require("../../../assets/potato.png")}
            name="Potatos"
            portion="1 portion"
            kudos="5"
            onPress={() => handleFoodItemPress("Potato")}
          />
          <FoodItem
            grams={100}
            image={require("../../../assets/banana.png")}
            name="Bananas"
            portion="1 portion"
            kudos="2"
            onPress={() => handleFoodItemPress("Banana")}
          />
          <FoodItem
            grams={100}
            image={require("../../../assets/egg.png")}
            name="Eggs"
            portion="3 portion"
            kudos="0.5"
            onPress={() => handleFoodItemPress("Egg")}
          />
        </View>
      </MotiView>
    );
  };

  const handleNavigateToDietListScreen = () => {
    navigation.navigate("DietListScreen");
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
            eaten={4}
            burned={12}
            remaining={3}
            progressFill={82}
          />
        </MotiView>
        {renderFoodItems()}
      </ScrollView>

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
    </View>
  );
};

export default DietScreen;
