import React from "react";
import { Dimensions, FlatList, Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../constants/colors";
import { spacing } from "../../constants/spacing";
import { globalStyles } from "../../constants/globalStyles";
import { textStyles, typography } from "../../constants/texts";
import { useNavigation } from "@react-navigation/native";
import RoundedButtonComponent from "../../components/RoundedButtonComponent";
import { MotiText, MotiView } from "moti";
import Animated, {
  Extrapolation,
  interpolate,
  ReduceMotion,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import type { StackNavigationProp } from "@react-navigation/stack";
import * as haptics from "expo-haptics";
import PrimaryButtonComponent from "../../components/PrimaryButtonComponent";
import { trackMixpanelEvent } from "../../services/mixpanel";
import { useEffect } from "react";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type OnboardingSection = {
  id: number;
  title: string;
  description: string;
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

const IMAGE_SIZE = 220;

const OnboardingSlide = React.memo(
  ({
    item,
    index,
    activeIndex,
    scrollX,
  }: {
    item: OnboardingSection;
    index: number;
    activeIndex: number;
    scrollX: Animated.SharedValue<number>;
  }) => {
    const isActive = index === activeIndex;

    const parallaxStyle = useAnimatedStyle(() => {
      const inputRange = [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ];

      const translateX = interpolate(
        scrollX.value,
        inputRange,
        [-14, 0, 14],
        Extrapolation.CLAMP
      );

      const rotate = interpolate(
        scrollX.value,
        inputRange,
        [-1.25, 0, 1.25],
        Extrapolation.CLAMP
      );

      return {
        transform: [{ translateX }, { rotate: `${rotate}deg` }],
      };
    }, [index, scrollX]);

    return (
      <View
        style={{
          width: SCREEN_WIDTH,
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: spacing.lg,
        }}
      >
        <MotiView
          from={{ opacity: 0, translateY: 10, scale: 0.98 }}
          animate={{
            opacity: isActive ? 1 : 0.85,
            translateY: isActive ? 0 : 6,
            scale: isActive ? 1 : 0.98,
          }}
          transition={{ type: "timing", duration: 450, reduceMotion: ReduceMotion.Never }}
          style={{ alignItems: "center" }}
        >
          <MotiView
            from={{ opacity: 0, translateY: 14, scale: 0.96 }}
            animate={{
              opacity: isActive ? 1 : 0.9,
              translateY: isActive ? 0 : 10,
              scale: isActive ? 1 : 0.98,
            }}
            transition={{ type: "timing", duration: 520, delay: 60, reduceMotion: ReduceMotion.Never }}
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
              },
              parallaxStyle,
            ]}
          >
            <Image
              source={item.image}
              resizeMode="cover"
              style={{ width: "100%", height: "100%" }}
            />
          </MotiView>

          <MotiText
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: isActive ? 1 : 0, translateY: isActive ? 0 : 10 }}
            transition={{ type: "timing", duration: 380, delay: 120, reduceMotion: ReduceMotion.Never }}
            style={{
              ...typography.screenTitle,
              color: colors.text.primary,
              textAlign: "center",
              marginBottom: spacing.sm,
            }}
          >
            {item.title}
          </MotiText>

          <MotiText
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: isActive ? 1 : 0, translateY: isActive ? 0 : 10 }}
            transition={{ type: "timing", duration: 380, delay: 170, reduceMotion: ReduceMotion.Never }}
            style={{
              ...textStyles.secondary,
              textAlign: "center",
              paddingHorizontal: spacing.sm,
              lineHeight: 20,
            }}
          >
            {item.description}
          </MotiText>
        </MotiView>
      </View>
    );
  }
);

OnboardingSlide.displayName = "OnboardingSlide";

const PaginationDot = React.memo(({ isActive }: { isActive: boolean }) => {
  return (
    <MotiView
      animate={{
        width: isActive ? 20 : 8,
        opacity: isActive ? 1 : 0.6,
        backgroundColor: isActive ? colors.ui.primary : colors.ui.dotInactive,
      }}
      transition={{ type: "timing", duration: 220, reduceMotion: ReduceMotion.Never }}
      style={{
        height: 8,
        borderRadius: 999,
      }}
    />
  );
});

PaginationDot.displayName = "PaginationDot";

const OnboardingScreen: React.FC = () => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const flatListRef = React.useRef<FlatList>(null);
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();

  useEffect(() => {
    trackMixpanelEvent("Onboarding");
  }, []); 
  const sections: OnboardingSection[] = [
    {
      id: 1,
      title: "Tired of counting calories?",
      description:
        "It’s hard to keep up. What if you didn’t have to think about it at all?",
      image: require("../../assets/mascot/standing.png"),
    },
    {
      id: 2,
      title: "Don’t feel like going to the gym?",
      description:
        "You’re not alone. You don’t need it to make real progress.",
      image: require("../../assets/mascot/pushUps.png"),
    },
    {
      id: 3,
      title: "Struggle to stay consistent?",
      description:
        "You start strong… then life happens. That’s why this is built to be simple.",
      image: require("../../assets/mascot/jump.png"),
    },
    {
      id: 4,
      title: "Wish it was just… easier?",
      description:
        "Just follow three small habits each day. That’s enough.",
      image: require("../../assets/mascot/threeFingers.png"),
    },
    {
      id: 5,
      title: "Ready to try something different?",
      description:
        "No pressure. Just a simple reset—one day at a time.",
      image: require("../../assets/mascot/walk.png"),
    },
  ];

  const handleNext = () => {
    haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
    if (activeIndex < sections.length - 1) {
      const nextIndex = activeIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setActiveIndex(nextIndex);
      return;
    }
    // TODO: Navigate to auth/main flow when onboarding is finished
  };

  const scrollX = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  const handleMomentumScrollEnd = React.useCallback(
    (event: { nativeEvent: { contentOffset: { x: number } } }) => {
      const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
      setActiveIndex(index);
    },
    []
  );

  const renderSlide = React.useCallback(
    ({ item, index }: { item: OnboardingSection; index: number }) => {
      return (
        <OnboardingSlide
          item={item}
          index={index}
          activeIndex={activeIndex}
          scrollX={scrollX}
        />
      );
    },
    [activeIndex, scrollX]
  );

  const getItemLayout = (_: unknown, index: number) => ({
    length: SCREEN_WIDTH,
    offset: SCREEN_WIDTH * index,
    index,
  });

  const renderPagination = React.useCallback(() => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: spacing.lg,
          gap: spacing.xs,
        }}
      >
        {sections.map((section, index) => (
          <PaginationDot key={section.id} isActive={index === activeIndex} />
        ))}
      </View>
    );
  }, [activeIndex, sections]);

  const renderButton = () => {
    if (activeIndex === sections.length - 1) {
      return (
        <PrimaryButtonComponent
          title="Let’s start"
          onPress={() => {
            navigation.replace("ProfileDetails");
          }}
        />
      )
    }
    return (
      <RoundedButtonComponent
        handleNext={handleNext}
        icon={"arrow-right"}
      />
    )
  }
  

  const ctaStyle = React.useMemo(() => {
    const isLast = activeIndex === sections.length - 1;
    return {
      transform: [{ scale: isLast ? 1 : 1 }],
    };
  }, [activeIndex, sections.length]);

  return (

      <View
        style={{
          flex: 1,
          paddingTop: spacing.lg,
        }}
      >
        <View 
          style={{
            backgroundColor: "#F6F6F5",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />

        <Animated.FlatList
          ref={flatListRef}
          data={sections}
          renderItem={renderSlide}
          keyExtractor={(item) => String(item.id)}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          getItemLayout={getItemLayout}
          bounces={false}
          decelerationRate="fast"
        />
        {renderPagination()}
        <View style={{
          paddingBottom: spacing.ctaButtonBottomPadding,
          paddingHorizontal: spacing.md,
        }}>
          {renderButton()}
        </View>
      </View>

  );
};

export default OnboardingScreen;