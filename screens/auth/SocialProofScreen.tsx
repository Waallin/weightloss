import React, { useEffect } from "react";
import { Text, View, ScrollView } from "react-native";
import { MotiView } from "moti";
import { spacing } from "../../constants/spacing";
import { ReduceMotion } from "react-native-reanimated";
import SocialProofItem from "./components/SocialProofItem";
import { globalStyles } from "../../constants/globalStyles";
import { planBuildingCopy, typography } from "../../constants/texts";
import { colors } from "../../constants/colors";
import PrimaryButtonComponent from "../../components/PrimaryButtonComponent";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import PlanBuildingLoader from "./components/PlanBuildingLoader";
import { PermissionStatus, useHealthKitPermissions } from "../../services/healthkit";
import { getNotificationToken } from "../../services/notifications";


const dummySocialProof = [
  {
    name: "Lisa, 31",
    rating: 4.9,
    ratingMax: 5,
    headline: "Down 4kg in the first week",
    quote:
      "“I just followed the recipes and tracked points instead of calories. It’s so much easier to stick to.”",
  },
  {
    name: "Marcus, 45",
    rating: 5,
    ratingMax: 5,
    headline: "Finally seeing progress",
    quote:
      "“Not having to count calories changed everything. The points system just makes sense.”",
  },
  {
    name: "Emma, 27",
    rating: 5,
    ratingMax: 5,
    headline: "Lost 6kg without overthinking",
    quote:
      "“I don’t think about food all day anymore. I just follow the points and it works.”",
  },
  {
    name: "Jonas, 38",
    rating: 4.9,
    ratingMax: 5,
    headline: "Actually started moving more",
    quote:
      "“Seeing my steps affect my points made it fun to move more. I’ve never been this consistent.”",
  },
  {
    name: "Sofia, 34",
    rating: 5,
    ratingMax: 5,
    headline: "So simple compared to calories",
    quote:
      "“Counting calories always stressed me out. Points are way easier and less overwhelming.”",
  },
];

const SocialProofScreen = () => {
  const navigation = useNavigation();
  const [isPlanReady, setIsPlanReady] = React.useState(false);
  const { requestPermission } = useHealthKitPermissions();



  const handleGetPermissions = async () => {

    navigation.navigate("Auth");
    return;    
    await getNotificationToken()
    await requestPermission();

  };

  const renderHeader = () => (
    <View
      style={{
        marginBottom: spacing.xl,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          ...typography.socialProofStat,
          color: colors.text.primary,
          textAlign: "center",
          marginBottom: spacing.xs,
        }}
      >
        People are seeing real results
      </Text>
      <Text
        style={{
          ...typography.bodyMedium,
          color: colors.text.secondary,
          textAlign: "center",
        }}
      >
        You're not alone in this
      </Text>
    </View>
  );

  const renderSocialProof = () => (
    <MotiView
      from={{ opacity: 0, translateY: 10, scale: 0.98 }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      transition={{
        type: "timing",
        duration: 450,
        delay: 100,
        reduceMotion: ReduceMotion.Never,
      }}
      style={{ gap: spacing.listItemGap, width: "100%" }}
    >
      {dummySocialProof.map((item, index) => (
        <SocialProofItem key={index} item={item} />
      ))}
    </MotiView>
  );

  const renderButton = () => (
    <View>
      <PrimaryButtonComponent
        title={planBuildingCopy.cta}
        // onPress={() => navigation.navigate("AuthScreen" as never)}
        onPress={handleGetPermissions}
      />
    </View>
  );

  const renderLoadingComponent = () => <PlanBuildingLoader onComplete={() => setIsPlanReady(true)} />;

  return (
    <View style={{ ...globalStyles.container }}>
      <ScrollView
        style={{ flex: 1, width: "100%" }}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
    
        }}
        showsVerticalScrollIndicator={false}
      >
        {renderHeader()}
        {renderSocialProof()}
      </ScrollView>
      <View style={{ paddingBottom: spacing.ctaButtonBottomPadding }}>
        {isPlanReady ? renderButton() : renderLoadingComponent()}
      </View>
    </View>
  );
};

export default SocialProofScreen;
