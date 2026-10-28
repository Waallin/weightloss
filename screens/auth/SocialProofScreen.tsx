import React, { useEffect } from "react";
import { Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MotiView } from "moti";
import { MaterialIcons } from "@expo/vector-icons";
import { spacing } from "../../constants/spacing";
import { ReduceMotion } from "react-native-reanimated";
import SocialProofItem from "./components/SocialProofItem";
import { testimonialWeight } from "../../utils/region";
import { globalStyles } from "../../constants/globalStyles";
import { planBuildingCopy, textStyles } from "../../constants/texts";
import { colors } from "../../constants/colors";
import PrimaryButtonComponent from "../../components/PrimaryButtonComponent";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import PlanBuildingLoader from "./components/PlanBuildingLoader";
import {
  PermissionStatus,
  useHealthKitPermissions,
} from "../../services/healthkit";
import { getNotificationToken } from "../../services/notifications";
import useUserStore from "../../stores/useUserStore";
import useConfigStore from "../../stores/useConfigStore";
import { trackMixpanelEvent } from "../../services/mixpanel";
import { analyticsEvents } from "../../constants/analytics";

const dummySocialProof = [
  {
    name: "Marcus K.",
    role: "Kudoo user",
    rating: 5,
    ratingMax: 5,
    headline: "Finally seeing progress",
    quote:
      "“Not having to count calories changed everything. The points system just makes sense.”",
    highlights: ["progress"],
    avatarColor: colors.ui.primarySoft,
    avatarImage: require("../../assets/users/marcus.jpg"),
  },
  {
    name: "Amina T.",
    role: "Kudoo user",
    rating: 5,
    ratingMax: 5,
    headline: `Lost ${testimonialWeight(13)} without overthinking`,
    quote:
      "“I don’t think about food all day anymore. I just follow the points and it works.”",
    highlights: [`Lost ${testimonialWeight(13)}`],
    avatarColor: colors.ui.warning,
    avatarImage: require("../../assets/users/amina.jpg"),
  },
  {
    name: "Jonas P.",
    role: "Kudoo user",
    rating: 4.9,
    ratingMax: 5,
    headline: "Actually started moving more",
    quote:
      "“Seeing my steps affect my points made it fun to move more. I’ve never been this consistent.”",
    highlights: ["moving more"],
    avatarColor: colors.ui.accentSoft,
    avatarImage: require("../../assets/users/jonas.jpg"),
  },
  {
    name: "Emily R.",
    role: "Kudoo user",
    rating: 5,
    ratingMax: 5,
    headline: "So simple compared to calories",
    quote:
      "“Counting calories always stressed me out. Points are way easier and less overwhelming.”",
    highlights: ["So simple"],
    avatarColor: colors.ui.iconContainer,
    avatarImage: require("../../assets/users/emily.jpg"),
  },
];

const SocialProofScreen = () => {
  const navigation = useNavigation<any>();
  const [isPlanReady, setIsPlanReady] = React.useState(false);
  const { config } = useConfigStore();
  const { requestPermission } = useHealthKitPermissions();
  const { user, setUser } = useUserStore();


  useEffect(() => {
    setTimeout(async () => {
      const token = await getNotificationToken();
      setUser({
        ...user,
        notificationToken: token,
      });
    }, 1000);
  }, []);

  useEffect(() => {
    if (!isPlanReady) return;
    trackMixpanelEvent(analyticsEvents.socialProofViewed);
  }, [isPlanReady]);

  const handleGetPermissions = async () => {
    trackMixpanelEvent(analyticsEvents.socialProofCompleted);
    navigation.replace("Auth");
  };

  const renderHeader = () => (
    <MotiView
      from={{ opacity: 0, translateY: 8 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 450, reduceMotion: ReduceMotion.Never }}
      style={{
        marginBottom: spacing.xl,
        width: "100%",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "flex-start",
          gap: spacing.xs + 2,
          paddingVertical: spacing.xs + 1,
          paddingHorizontal: spacing.sm + 2,
          marginBottom: spacing.md,
          borderRadius: 999,
          backgroundColor: colors.ui.listRowIconBackground,
          borderWidth: 1,
          borderColor: colors.ui.primary + "33",
        }}
      >
        <MaterialIcons name="star" size={13} color={colors.ui.primary} />
        <Text
          style={{
            ...textStyles.onboardingBody,
            fontSize: 12,
            fontWeight: "700",
            letterSpacing: 1.4,
            color: colors.ui.primary,
          }}
        >
          REAL RESULTS
        </Text>
      </View>
      <Text
        style={{
          ...textStyles.onboardingTitle,
          letterSpacing: -0.6,
          marginBottom: spacing.sm,
        }}
      >
        People are seeing{" "}
        <Text style={{ color: colors.ui.primary }}>real results</Text>
      </Text>
      <Text
        style={{
          ...textStyles.onboardingBody,
          lineHeight: 22,
        }}
      >
        You're not alone in this.
      </Text>
    </MotiView>
  );

  const renderSocialProof = () => (
    <View style={{ gap: spacing.md + 4, width: "100%" }}>
      {dummySocialProof.map((item, index) => (
        <MotiView
          key={index}
          from={{ opacity: 0, translateY: 14, scale: 0.985 }}
          animate={{ opacity: 1, translateY: 0, scale: 1 }}
          transition={{
            type: "timing",
            duration: 500,
            delay: 150 + index * 120,
            reduceMotion: ReduceMotion.Never,
          }}
        >
          <SocialProofItem item={item} variant="premium" />
        </MotiView>
      ))}
    </View>
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

  const renderLoadingComponent = () => (
    <PlanBuildingLoader
      onComplete={() => setIsPlanReady(true)}
      config={config}
    />
  );

  return (
    <SafeAreaView style={{ ...globalStyles.container }} edges={["top"]}>
      <ScrollView
        style={{ flex: 1, width: "100%" }}
        contentContainerStyle={{
          paddingTop: spacing.md,
          paddingBottom: spacing.md,
        }}
        showsVerticalScrollIndicator={false}
      >
        {renderHeader()}
        {renderSocialProof()}
      </ScrollView>
      <View style={{ paddingBottom: spacing.ctaButtonBottomPadding }}>
        {isPlanReady ? renderButton() : renderLoadingComponent()}
      </View>
    </SafeAreaView>
  );
};

export default SocialProofScreen;
