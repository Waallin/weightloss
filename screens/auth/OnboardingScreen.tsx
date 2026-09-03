import React from "react";
import { Dimensions, FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../constants/colors";
import { spacing } from "../../constants/spacing";
import { textStyles } from "../../constants/texts";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import * as haptics from "expo-haptics";
import PrimaryButtonComponent from "../../components/PrimaryButtonComponent";
import { trackMixpanelEvent } from "../../services/mixpanel";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const SPOTLIGHT_OUTER = Math.min(SCREEN_WIDTH * 0.78, 320);
const SPOTLIGHT_MID = SPOTLIGHT_OUTER * 0.82;
const SPOTLIGHT_INNER = SPOTLIGHT_OUTER * 0.64;
const IMAGE_SIZE = SPOTLIGHT_OUTER * 0.84;
const DOT_SIZE = 8;
const DOT_INACTIVE = "#D8D8D6";

type OnboardingSection = {
  id: number;
  title: string;
  description: string;
  cta: string;
  image: number;
};

type AuthStackParamList = {
  Onboarding: undefined;
  SocialProof: undefined;
  Paywall: undefined;
  HowItWork: undefined;
  ProfileDetails: undefined;
  Auth: undefined;
  MainStack: undefined;
};

const sections: OnboardingSection[] = [
  {
    id: 1,
    title: "Tired of counting calories?",
    description:
      "It’s hard to keep up. What if you didn’t have to think about it at all?",
    cta: "I’m in",
    image: require("../../assets/mascot/standing.png"),
  },
  {
    id: 2,
    title: "Tired of logging everything you eat?",
    description: "Just snap a photo. We’ll do the rest.",
    cta: "Show me how",
    image: require("../../assets/mascot/walk.png"),
  },
  {
    id: 3,
    title: "Don’t feel like going to the gym?",
    description: "You’re not alone. You don’t need it to make real progress.",
    cta: "Let’s do this",
    image: require("../../assets/mascot/pushUps.png"),
  },
  {
    id: 4,
    title: "Struggle to stay consistent?",
    description:
      "You start strong… then life happens. That’s why this is built to be simple.",
    cta: "Sounds good",
    image: require("../../assets/mascot/jump.png"),
  },
  {
    id: 5,
    title: "Wish it was just… easier?",
    description: "Just follow three small habits each day. That’s enough.",
    cta: "Keep going",
    image: require("../../assets/mascot/threeFingers.png"),
  },
  {
    id: 6,
    title: "Ready to try something different?",
    description: "No pressure. Just a simple reset—focus on one day at a time.",
    cta: "That’s more like it",
    image: require("../../assets/mascot/walk.png"),
  },
];

const OnboardingSlide = React.memo(({ item }: { item: OnboardingSection }) => {
  return (
    <View
      style={{
        width: SCREEN_WIDTH,
        flex: 1,
        alignItems: "center",
        paddingHorizontal: spacing.lg,
        alignSelf: "center",
        
      }}
    >
      <View
        style={{
          width: SPOTLIGHT_OUTER,
          height: SPOTLIGHT_OUTER,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: spacing.lg,
        }}
      >
        <View
          style={{
            position: "absolute",
            width: SPOTLIGHT_OUTER,
            height: SPOTLIGHT_OUTER,
            borderRadius: SPOTLIGHT_OUTER / 2,
            backgroundColor: "rgba(255,255,255,0.35)",
          }}
        />


        <Image
          source={item.image}
          resizeMode="contain"
          style={{ width: IMAGE_SIZE, height: IMAGE_SIZE }}
        />
      </View>

      <Text
        style={{
          ...textStyles.onboardingTitle,
          textAlign: "center",
          marginBottom: spacing.sm,
        }}
      >
        {item.title}
      </Text>
      <Text
        style={{
          ...textStyles.onboardingBody,
          textAlign: "center",
          paddingHorizontal: spacing.sm,
          lineHeight: 22,
        }}
      >
        {item.description}
      </Text>
    </View>
  );
});

OnboardingSlide.displayName = "OnboardingSlide";

const PaginationDot = React.memo(({ isActive }: { isActive: boolean }) => {
  return (
    <View
      style={{
        width: DOT_SIZE,
        height: DOT_SIZE,
        borderRadius: DOT_SIZE / 2,
        backgroundColor: isActive ? colors.ui.primary : DOT_INACTIVE,
      }}
    />
  );
});

PaginationDot.displayName = "PaginationDot";

const OnboardingScreen: React.FC = () => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const flatListRef = React.useRef<FlatList>(null);
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();

  const handleContinue = () => {
    haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
    if (activeIndex < sections.length - 1) {
      const nextIndex = activeIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setActiveIndex(nextIndex);
      return;
    }
    trackMixpanelEvent("Onboarding_complete");
    navigation.replace("HowItWork");
  };

  const handleMomentumScrollEnd = React.useCallback(
    (event: { nativeEvent: { contentOffset: { x: number } } }) => {
      const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
      setActiveIndex(index);
    },
    []
  );

  const renderSlide = React.useCallback(
    ({ item }: { item: OnboardingSection }) => {
      return <OnboardingSlide item={item} />;
    },
    []
  );

  const getItemLayout = (_: unknown, index: number) => ({
    length: SCREEN_WIDTH,
    offset: SCREEN_WIDTH * index,
    index,
  });

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.ui.background,
      }}
      edges={["top", "bottom"]}
    >
      <FlatList
        ref={flatListRef}
        data={sections}
        renderItem={renderSlide}
        keyExtractor={(item) => String(item.id)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        getItemLayout={getItemLayout}
        bounces={false}
        decelerationRate="fast"
      />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: spacing.lg,
          gap: spacing.sm,
        }}
      >
        {sections.map((section, index) => (
          <PaginationDot key={section.id} isActive={index === activeIndex} />
        ))}
      </View>

      <View
        style={{
          paddingHorizontal: spacing.md,
          paddingBottom: spacing.sm,
        }}
      >
        <PrimaryButtonComponent
          title={sections[activeIndex].cta}
          onPress={handleContinue}
        />
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;
