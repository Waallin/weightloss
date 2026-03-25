import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../constants/colors";
import { spacing } from "../../constants/spacing";
import { fonts } from "../../constants/fonts";
import { globalStyles } from "../../constants/globalStyles";
import { useNavigation } from "@react-navigation/native";
import RoundedButtonComponent from "../../components/RoundedButtonComponent";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const OnboardingScreen: React.FC = () => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const flatListRef = React.useRef<FlatList>(null);
  const navigation = useNavigation();
  const sections = [
    {
      id: 1,
      title: "Tired of Counting Calories?",
      description:
        "Do you spend too much time tracking every calorie? With our app, you never have to count calories again.",
      image: require("../../assets/onboarding1.png"),
    },
    {
      id: 2,
      title: "No Gym? No Problem.",
      description:
        "Don’t want to go to the gym? We’ve got you covered – no gym or special equipment needed. Achieve results from anywhere.",
      image: require("../../assets/onboarding2.png"),
    },
    {
      id: 3,
      title: "Dont like running?",
      description:
        "We've got you covered – no running or special equipment needed. Achieve results from anywhere.",
      image: require("../../assets/onboarding5.png"),
    },
    {
      id: 4,
      title: "Just 3 Simple Goals",
      description:
        "Imagine simply following 3 daily goals. That's it. The app takes care of the rest so you can focus on living your life.",
      image: require("../../assets/onboarding3.png"),
    },
    {
      id: 5,
      title: "Ready for Change?",
      description:
        "What could you achieve if tracking and planning were effortless? Let our app guide you and see the difference.",
      image: require("../../assets/onboarding4.png"),
    },
  ];

  const handleNext = () => {
    if (activeIndex < sections.length - 1) {
      const nextIndex = activeIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setActiveIndex(nextIndex);
      return;
    }
    navigation.navigate("SocialProof");
    // TODO: Navigate to auth/main flow when onboarding is finished
  };

  const handleMomentumScrollEnd = (event: { nativeEvent: { contentOffset: { x: number } } }) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  const renderSlide = ({ item }: { item: (typeof sections)[0] }) => (
    <View
      style={{
        width: SCREEN_WIDTH,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: spacing.lg,
      }}
    >
      <View
        style={{
          width: 180,
          height: 180,
          backgroundColor: colors.ui.secondaryBackground,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: spacing.xl,
        }}
      >
        <Image
          source={item.image}
          resizeMode="cover"
          style={{
            width: "100%",
            height: "100%",

          }}
        />

      </View>
      <Text
        style={{
          fontFamily: fonts.primary.bold,
          fontSize: 24,
          color: colors.text.primary,
          textAlign: "center",
          marginBottom: spacing.sm,
        }}
      >
        {item.title}
      </Text>
      <Text
        style={{
          fontFamily: fonts.primary.regular,
          fontSize: 14,
          color: colors.text.secondary,
          textAlign: "center",
          paddingHorizontal: spacing.sm,
        }}
      >
        {item.description}
      </Text>
    </View>
  );

  const getItemLayout = (_: unknown, index: number) => ({
    length: SCREEN_WIDTH,
    offset: SCREEN_WIDTH * index,
    index,
  });

  const renderPagination = () => {
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
        {sections.map((section, index) => {
          const isActive = index === activeIndex;

          return (
            <View
              key={section.id}
              style={{
                width: isActive ? 18 : 8,
                height: 8,
                borderRadius: 999,
                backgroundColor: isActive
                  ? colors.ui.primary
                  : colors.ui.dotInactive,
                marginHorizontal: spacing.xs / 2,
              }}
            />
          );
        })}
      </View>
    );
  };



  return (
    <SafeAreaView
      style={
        globalStyles.container
      }
    >
      <View
        style={{
          flex: 1,
          paddingTop: spacing.lg,
        }}
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
        {renderPagination()}
        <RoundedButtonComponent handleNext={handleNext} icon="arrow-right" />
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;