import React, { useState } from "react";
import {
  Text,
  View,
  ScrollView,
  Image,
  FlatList,
  ListRenderItem,
} from "react-native";
import { colors } from "../../constants/colors";
import { spacing } from "../../constants/spacing";
import { fonts } from "../../constants/fonts";
import { globalStyles } from "../../constants/globalStyles";
import { paywallCopy, textSizes } from "../../constants/texts";
import SocialProofItem, {
  SocialProofTestimonial,
} from "./components/SocialProofItem";
import OfferButton from "./components/OfferButton";
import PrimaryButtonComponent from "../../components/PrimaryButtonComponent";
import { useNavigation } from "@react-navigation/native";

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

    navigation.navigate("AuthScreen");
  };
  const renderImage = () => {
    return (
      <View
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
      </View>
    );
  };

  const renderSocialProof = () => {
    return (
      <View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={dummySocialProof}
          keyExtractor={(item) => item.name}
          contentContainerStyle={{ paddingRight: spacing.md }}
          renderItem={renderSocialProofItem}
        />
      </View>
    );
  };

  const renderOffers = () => {
    return (
      <View>
        <Text
          style={{
            fontFamily: fonts.primary.bold,
            fontSize: textSizes.sm,
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
          onPress={() => setSelectedPlan("yearly")}
        />
        <OfferButton
          title={paywallCopy.weeklyLabel}
          priceLine={`${paywallCopy.weeklyPrice} ${paywallCopy.weeklyPeriod}`}
          caption={paywallCopy.weeklySubline}
          footnote={paywallCopy.weeklyAnnualizedHint}
          selected={selectedPlan === "weekly"}
          onPress={() => setSelectedPlan("weekly")}
        />
      </View>
    );
  };

  const renderCTA = () => {
    return (
      <View>
        <PrimaryButtonComponent
          color={colors.ui.white}
          backgroundColor={selectedPlan === "yearly" ? "#17AD7C" : "#16B97B"}
          title="Start free trial"
          onPress={handleCTAPress}
        />
      </View>
    );
  };

  const renderFootnote = () => {
    return (
      <View>
        <Text
          style={{
            fontFamily: fonts.primary.regular,
            fontSize: textSizes.sm,
            color: colors.text.secondary,
            textAlign: "center",
          }}
        >
          {paywallCopy.trialFootnote}
        </Text>
      </View>
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
