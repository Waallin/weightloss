import React, { useState } from "react";
import {
  Text,
  ScrollView,
  Image,
  FlatList,
  ListRenderItem,
  View,
} from "react-native";
import { colors } from "../../../constants/colors";
import { spacing } from "../../../constants/spacing";
import { globalStyles } from "../../../constants/globalStyles";
import { paywallCopy, typography } from "../../../constants/texts";
import SocialProofItem, {
  SocialProofTestimonial,
} from "../components/SocialProofItem";
import OfferButton from "../components/OfferButton";
import PrimaryButtonComponent from "../../../components/PrimaryButtonComponent";
import { useNavigation } from "@react-navigation/native";
import * as haptics from "expo-haptics";

const IMAGE_SIZE = 150;


const renderSocialProofItem: ListRenderItem<SocialProofTestimonial> = ({
  item,
}) => <SocialProofItem item={item} />;

type PaywallPlan = "yearly" | "weekly";

const DefaultPaywall: React.FC<{ onCTAPress: () => void }> = ({ onCTAPress }) => {
  const [selectedPlan, setSelectedPlan] = useState<PaywallPlan>("yearly");
  const navigation = useNavigation();
  const handleCTAPress = () => {
    haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
    onCTAPress();
  };

  const handleOfferPress = (plan: PaywallPlan) => {
    haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
    setSelectedPlan(plan);
  };

  const renderOffers = () => {
    return (
      <View>
        <Text
          style={{
            ...typography.buttonSecondary,
            color: colors.text.primary,
            textAlign: "center",
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
      <Text
        style={{
          ...typography.body,
          color: colors.text.secondary,
          textAlign: "center",
        }}
      >
        {paywallCopy.trialFootnote}
      </Text>
    );
  };

  return (
    <View
      style={{
        ...globalStyles.container,
        flex: 1,
    
        justifyContent: "center",
      }}
    >
      {renderOffers()}
      {renderCTA()}
      {renderFootnote()}
    </View>
  );
};

export default DefaultPaywall;
