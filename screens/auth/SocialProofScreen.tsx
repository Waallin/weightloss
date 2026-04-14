import React, { useEffect } from "react";
import { Text, View, ScrollView } from "react-native";
import { MotiView } from "moti";
import { spacing } from "../../constants/spacing";
import { ReduceMotion } from "react-native-reanimated";
import SocialProofItem from "./components/SocialProofItem";
import { globalStyles } from "../../constants/globalStyles";
import { textSizes, textStyles } from "../../constants/texts";
import { fonts } from "../../constants/fonts";
import { colors } from "../../constants/colors";
import PrimaryButtonComponent from "../../components/PrimaryButtonComponent";
import { useNavigation } from "@react-navigation/native";


const dummySocialProof = [
  {
    name: "Lisa, 31",
    rating: 4.9,
    ratingMax: 5,
    headline: "Down 4kg in the first week",
    quote:
      "“I didn’t change everything, just followed the plan. The progress started faster than I expected.”",
  },
  {
    name: "Marcus, 45",
    rating: 5,
    ratingMax: 5,
    headline: "Finally seeing progress",
    quote:
      "“After one week I could already see changes. It feels simple, which makes me stick with it.”",
  },
];

const SocialProofScreen = () => {

  const navigation = useNavigation();
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
          ...textStyles.primary,
          fontSize: textSizes.xxl,
          fontWeight: "bold",
          fontFamily: fonts.primary.semiBold,
          textAlign: "center",
          marginBottom: spacing.xs,
        }}
      >
        People are seeing real results
      </Text>
      <Text
        style={{
          ...textStyles.secondary,
          fontSize: textSizes.sm,
          fontFamily: fonts.primary.medium,
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
      style={{ gap: spacing.md, width: "100%" }}
    >
      {dummySocialProof.map((item, index) => (
        <SocialProofItem key={index} item={item} />
      ))}
    </MotiView>
  );

  const renderButton = () => (
    <View>
      <PrimaryButtonComponent title="Start my plan" onPress={() => navigation.navigate('AuthScreen')} />
    </View>
  );

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
      <View style={{ paddingBottom: spacing.scrollViewBottomPadding}}>
        {renderButton()}
      </View>
    </View>
  );
};

export default SocialProofScreen;
