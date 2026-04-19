import React, { useState } from "react";
import {
  Text,
  ScrollView,
  Image,
  FlatList,
  ListRenderItem,
} from "react-native";
import { colors } from "../../constants/colors";
import { spacing } from "../../constants/spacing";
import { globalStyles } from "../../constants/globalStyles";
import { paywallCopy, typography } from "../../constants/texts";
import SocialProofItem, {
  SocialProofTestimonial,
} from "./components/SocialProofItem";
import OfferButton from "./components/OfferButton";
import PrimaryButtonComponent from "../../components/PrimaryButtonComponent";
import { useNavigation } from "@react-navigation/native";
import * as haptics from "expo-haptics";
import { MotiText, MotiView } from "moti";
import { ReduceMotion } from "react-native-reanimated"

const IMAGE_SIZE = 150;

const dummySocialProof: SocialProofTestimonial[] = [
  {
    name: "Anna, 23",
    rating: 4.9,
    ratingMax: 5,
    headline: "I finally stayed consistent",
    quote:
      "“For the first time ever, I stuck with it. Seeing my progress each day kept me going.”",
  },
  {
    name: "Daniel, 41",
    rating: 5,
    ratingMax: 5,
    headline: "Fits into my everyday life",
    quote:
      "“I don’t have much time, but this made it simple. Small steps every day actually added up.”",
  },
  {
    name: "Sophie, 29",
    rating: 4.8,
    ratingMax: 5,
    headline: "I started seeing real progress",
    quote:
      "“After just a few days I felt a difference. Watching my weight trend change kept me motivated.”",
  },
  {
    name: "Mark, 62",
    rating: 4.7,
    ratingMax: 5,
    headline: "Keeps me on track every day",
    quote:
      "“It gives me structure and helps me stay consistent. I finally feel in control of my habits.”",
  },
];

const renderSocialProofItem: ListRenderItem<SocialProofTestimonial> = ({
  item,
}) => <SocialProofItem item={item} />;

type PaywallPlan = "yearly" | "weekly";

const PaywallScreen: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<PaywallPlan>("yearly");
  const navigation = useNavigation();
  const handleCTAPress = () => {
    haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
    navigation.replace("AuthScreen");
  };
  const renderImage = () => {
    return (
      <MotiView
        from={{ opacity: 0, translateY: 10, scale: 0.98 }}
        animate={{ opacity: 1, translateY: 0, scale: 1 }}
        transition={{
          type: "timing",
          duration: 450,
          reduceMotion: ReduceMotion.Never,
        }}
        style={{ alignItems: "center" }}
      >
        <MotiView
          from={{ opacity: 0, translateY: 14, scale: 0.96 }}
          animate={{ opacity: 1, translateY: 0, scale: 1 }}
          transition={{
            type: "timing",
            duration: 520,
            delay: 60,
            reduceMotion: ReduceMotion.Never,
          }}
          style={[
            {
              width: IMAGE_SIZE,
              height: IMAGE_SIZE,
              borderRadius: IMAGE_SIZE / 2,
              backgroundColor: colors.ui.secondaryBackground,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: spacing.xl,
              ...globalStyles.shadow,
              overflow: "hidden",
              alignSelf: "center",
            },
          ]}
        >
          <Image
            source={require("../../assets/mascot/thumbsUp.png")}
            resizeMode="cover"
            style={{ width: "100%", height: "100%" }}
          />
        </MotiView>
      </MotiView>
    );
  };

  const renderSocialProof = () => {
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
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={dummySocialProof}
          keyExtractor={(item) => item.name}
          contentContainerStyle={{ paddingRight: spacing.md }}
          renderItem={renderSocialProofItem}
        />
      </MotiView>
    );
  };

  const handleOfferPress = (plan: PaywallPlan) => {
    haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
    setSelectedPlan(plan);
  };
  const renderOffers = () => {
    return (
      <MotiView
        from={{ opacity: 0, translateY: 10, scale: 0.98 }}
        animate={{ opacity: 1, translateY: 0, scale: 1 }}
        transition={{
          type: "timing",
          duration: 450,
          delay: 160,
          reduceMotion: ReduceMotion.Never,
        }}
      >
        <Text
          style={{
            ...typography.buttonSecondary,
            color: colors.text.primary,
            marginBottom: spacing.sm,
          }}
        >
          {paywallCopy.choosePlanTitle}
        </Text>
        <OfferButton
          title={paywallCopy.yearlyLabel}
          priceLine={`${paywallCopy.yearlyPrice} ${paywallCopy.yearlyPeriod}`}

          caption={paywallCopy.yearlyPerWeekEquivalent}
          captionSubline={paywallCopy.yearlyPerWeekSubline}
          badge={paywallCopy.yearlyBadge}
          trialBadge={paywallCopy.yearlyTrialBadge}
          premiumSelected
          selected={selectedPlan === "yearly"}
          onPress={() => handleOfferPress("yearly")}
        />
        <OfferButton
          title={paywallCopy.weeklyLabel}
          priceLine={`${paywallCopy.weeklyPrice} ${paywallCopy.weeklyPeriod}`}
          caption={paywallCopy.weeklySubline}
          footnote={paywallCopy.weeklyAnnualizedHint}
          selected={selectedPlan === "weekly"}
          onPress={() => handleOfferPress("weekly")}
        />
      </MotiView>
    );
  };

  const renderCTA = () => {
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
      >
        <PrimaryButtonComponent
          color={colors.ui.white}
          backgroundColor={selectedPlan === "yearly" ? "#17AD7C" : "#16B97B"}
          title="Start free trial"
          onPress={handleCTAPress}
        />
      </MotiView>
    );
  };

  const renderFootnote = () => {
    return (
      <MotiText
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{
          type: "timing",
          duration: 380,
          delay: 280,
          reduceMotion: ReduceMotion.Never,
        }}
        style={{
          ...typography.body,
          color: colors.text.secondary,
          textAlign: "center",
        }}
      >
        {paywallCopy.trialFootnote}
      </MotiText>
    );
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        ...globalStyles.scrollContainer,
      }}
      style={globalStyles.container}
    >
      {renderImage()}
      {renderSocialProof()}
      {renderOffers()}
      {renderCTA()}
      {renderFootnote()}
    </ScrollView>
  );
};

export default PaywallScreen;
