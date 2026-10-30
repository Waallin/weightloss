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
import { analyticsEvents } from "../../constants/analytics";
import ScanDemo from "./components/ScanDemo";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const SPOTLIGHT_OUTER = Math.min(SCREEN_WIDTH * 0.78, 320);
const IMAGE_SIZE = SPOTLIGHT_OUTER * 0.84;
const DOT_SIZE = 8;
const DOT_INACTIVE = "#D8D8D6";

type OnboardingSection = {
  id: number;
  title: string;
  description: string;
  cta: string;
  image?: number;
  /** Replaces the mascot image, e.g. a live demo */
  visual?: React.ReactNode;
};

type AuthStackParamList = {
  Onboarding: undefined;
  Paywall: undefined;
  ProfileDetails: undefined;
  Auth: undefined;
  MainStack: undefined;
};

const sections: OnboardingSection[] = [
  {
    id: 1,
    title: "Tired of counting calories?",
    description:
      "Just snap a photo and we’ll do the rest. No counting, no gym needed.",
    cta: "I’m in",
    visual: <ScanDemo width={SPOTLIGHT_OUTER} />,
  },
  {
    id: 2,
    title: "Struggle to stay consistent?",
    description:
      "You start strong… then life happens. That’s why this is built to be simple.",
    cta: "Sounds good",
    image: require("../../assets/mascot/consistent.png"),
  },
  {
    id: 3,
    title: "Wish it was just… easier?",
    description: "Just two simple goals: eat smart and move daily. That’s it.",
    cta: "Keep going",
    image: require("../../assets/mascot/easier.png"),
  },
  {
    id: 4,
    title: "Ready to try something different?",
    description: "No pressure. Just a simple reset—focus on one day at a time.",
    cta: "That’s more like it",
    image: require("../../assets/mascot/somethingnew.png"),
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
        {item.visual ?? (
          <Image
            source={item.image}
            resizeMode="contain"
            style={{ width: IMAGE_SIZE, height: IMAGE_SIZE }}
          />
        )}
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

  React.useEffect(() => {
    trackMixpanelEvent(analyticsEvents.onboardingViewed);
  }, []);

  React.useEffect(() => {
    trackMixpanelEvent(analyticsEvents.onboardingSlideViewed, {
      slide: activeIndex + 1,
    });
  }, [activeIndex]);

  const handleContinue = () => {
    haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
    if (activeIndex < sections.length - 1) {
      const nextIndex = activeIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setActiveIndex(nextIndex);
      return;
    }
    trackMixpanelEvent(analyticsEvents.onboardingCompleted);
    navigation.replace("ProfileDetails");
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
