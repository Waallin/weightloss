import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  View,
} from "react-native";
import { colors } from "../../constants/colors";
import { spacing } from "../../constants/spacing";
import { globalStyles } from "../../constants/globalStyles";
import { authCopy, textSizes, textStyles } from "../../constants/texts";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
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
import * as haptics from "expo-haptics";
import PrimaryButtonComponent from "../../components/PrimaryButtonComponent";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type HowItWorkImageKey = (typeof authCopy.howItWorkSections)[number]["imageKey"];

type HowItWorkSection = {
  id: number;
  title: string;
  description: string;
  image: number;
};

type AuthStackParamList = {
  HowItWork: undefined;
  MainStack: undefined;
};

const IMAGE_SIZE = 220;

const imageByKey: Record<HowItWorkImageKey, number> = {
  threeFingers: require("../../assets/mascot/threeFingers.png"),
  standing: require("../../assets/mascot/standing.png"),
  thumbsUp: require("../../assets/mascot/thumbsUp.png"),
};

const HowItWorkSlide = React.memo(
  ({
    item,
    index,
    activeIndex,
    scrollX,
  }: {
    item: HowItWorkSection;
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
          transition={{
            type: "timing",
            duration: 450,
            reduceMotion: ReduceMotion.Never,
          }}
          style={{ alignItems: "center" }}
        >
          <MotiView
            from={{ opacity: 0, translateY: 14, scale: 0.96 }}
            animate={{
              opacity: isActive ? 1 : 0.9,
              translateY: isActive ? 0 : 10,
              scale: isActive ? 1 : 0.98,
            }}
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
            animate={{
              opacity: isActive ? 1 : 0,
              translateY: isActive ? 0 : 10,
            }}
            transition={{
              type: "timing",
              duration: 380,
              delay: 120,
              reduceMotion: ReduceMotion.Never,
            }}
            style={{
              fontWeight: "bold",
              fontSize: textSizes.xxxl,
              color: colors.text.primary,
              textAlign: "center",
              marginBottom: spacing.sm,
            }}
          >
            {item.title}
          </MotiText>

          <MotiText
            from={{ opacity: 0, translateY: 10 }}
            animate={{
              opacity: isActive ? 1 : 0,
              translateY: isActive ? 0 : 10,
            }}
            transition={{
              type: "timing",
              duration: 380,
              delay: 170,
              reduceMotion: ReduceMotion.Never,
            }}
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

HowItWorkSlide.displayName = "HowItWorkSlide";

const PaginationDot = React.memo(({ isActive }: { isActive: boolean }) => {
  return (
    <MotiView
      animate={{
        width: isActive ? 20 : 8,
        opacity: isActive ? 1 : 0.6,
        backgroundColor: isActive ? colors.ui.primary : colors.ui.dotInactive,
      }}
      transition={{
        type: "timing",
        duration: 220,
        reduceMotion: ReduceMotion.Never,
      }}
      style={{
        height: 8,
        borderRadius: 999,
      }}
    />
  );
});

PaginationDot.displayName = "PaginationDot";

const HowItWorkScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
  const [activeIndex, setActiveIndex] = React.useState(0);
  const flatListRef = React.useRef<FlatList>(null);

  const sections: HowItWorkSection[] = React.useMemo(() => {
    console.log(authCopy.howItWorkSections);
    return authCopy.howItWorkSections.map((s) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      image: imageByKey[s.imageKey],
    }));
  }, []);

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

  const handleNext = React.useCallback(() => {
    haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
    if (activeIndex < sections.length - 1) {
      const nextIndex = activeIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setActiveIndex(nextIndex);
      return;
    }
    navigation.navigate("MainStack");
  }, [activeIndex, navigation, sections.length]);

  const renderSlide = React.useCallback(
    ({ item, index }: { item: HowItWorkSection; index: number }) => {
      return (
        <HowItWorkSlide
          item={item}
          index={index}
          activeIndex={activeIndex}
          scrollX={scrollX}
        />
      );
    },
    [activeIndex, scrollX]
  );

  const getItemLayout = React.useCallback((_: unknown, index: number) => {
    return {
      length: SCREEN_WIDTH,
      offset: SCREEN_WIDTH * index,
      index,
    };
  }, []);

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

  const renderSections = () => {
    return (
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
    )
  }

  const renderButton = () => {
    if (activeIndex === sections.length - 1) {
      return (
        <PrimaryButtonComponent
          title="Begin my plan"
          onPress={() => {
            navigation.navigate("MainStack");
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

  return (
    <SafeAreaView style={globalStyles.container}>
      {renderSections()}
      {renderPagination()}
      <View style={{
        paddingBottom: spacing.xxl,
        paddingHorizontal: spacing.md,
      }}>
        {renderButton()}
      </View>

    </SafeAreaView>
  );
};

export default HowItWorkScreen;