import { Text, View } from "react-native";
import React from "react";
import { MotiView } from "moti";
import { ReduceMotion } from "react-native-reanimated";
import { spacing } from "../../../constants/spacing";
import { globalStyles } from "../../../constants/globalStyles";
import { dietLabels, textSizes, textStyles } from "../../../constants/texts";
import { ScrollView } from "react-native-gesture-handler";
import { getFormattedDate } from "../../../utils/dateUtils";
import RoundedButtonComponent from "../../../components/RoundedButtonComponent";
import DietCalorieHeroComponent from "./components/DietCalorieHeroComponent";
import useTodayProgressStore from "../../../stores/useTodayProgressStore";
import useUserStore from "../../../stores/useUserStore";
import { useNavigation } from "@react-navigation/native";
const DietScreen = () => {
  const navigation = useNavigation();
  const { todayProgress } = useTodayProgressStore();


  const pointsRemaining = todayProgress?.points?.total - (todayProgress?.points?.used ?? 0);
  const progressFill = ((todayProgress?.points?.used ?? 0) * 100) / (todayProgress?.points?.total ?? 0);

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
        ></View>
      </MotiView>
    );
  };
  const handleNavigateToDietListScreen = () => {
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
          eaten={todayProgress?.points?.used ?? 0}
          burned={12}
          remaining={pointsRemaining}
          progressFill={progressFill}
        />
      </MotiView>
    );
  };
  const renderEmptyState = () => {
    return (
      <View>
      <Text>No food items found</Text>
    </View>
    )
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
