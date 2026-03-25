import { Text, View } from "react-native";
import React from "react";
import { colors } from "../../../constants/colors";
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
      <View>
        <Text style={{
          fontSize: textSizes.lg,
          fontWeight: "bold",
          marginBottom: spacing.md,
        }}>
          Today
        </Text>
        <View style={{
          gap: spacing.xs,
        }}>
          <FoodItem grams={100} image={require("../../../assets/potato.png")} name="Potatos" portion="1 portion" kudos="5" onPress={() => handleFoodItemPress("Potato")} />
          <FoodItem grams={100} image={require("../../../assets/banana.png")} name="Bananas" portion="1 portion" kudos="2" onPress={() => handleFoodItemPress("Banana")} />
          <FoodItem grams={100} image={require("../../../assets/egg.png")} name="Eggs" portion="3 portion" kudos="0.5" onPress={() => handleFoodItemPress("Egg")} />
        </View>
      </View>
    );
  };

  const handleNavigateToDietListScreen = () => {
    navigation.navigate("DietListScreen");
  };

  return (
    <View style={{
      flex: 1,
    }}>
      <ScrollView style={globalStyles.container} contentContainerStyle={globalStyles.contentContainer}>
        <DietCalorieHeroComponent
          dateLabel={getFormattedDate(new Date())}
          eaten={4}
          burned={12}
          remaining={3}
          progressFill={82}
        />
        {renderFoodItems()}
     
      </ScrollView>
    
      <View style={{
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.md,
      }}>
      <RoundedButtonComponent handleNext={handleNavigateToDietListScreen} icon="plus" />
      </View>
    </View>
  );
};

export default DietScreen;
