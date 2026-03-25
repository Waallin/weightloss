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

const HowItWorkScreen: React.FC = () => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const flatListRef = React.useRef<FlatList>(null);
  const navigation = useNavigation();
  const sections = [
    {
      id: 1,
      title: "Want to skip counting calories?",
      description:
        "We calculate points for you based on your body weight, movement, and gender – let the app handle the numbers so you don’t have to.",
    },
    {
      id: 2,
      title: "Need reminders to stay hydrated?",
      description:
        "We log your water intake and send you helpful reminders, ensuring you keep hydrated every day.",
    },
    {
      id: 3,
      title: "Want to move more each day?",
      description:
        "We keep track of your steps and send notifications, so you get moving and reach your daily goals.",
    },
    {
      id: 4,
      title: "Not sure how much you should eat today?",
      description:
        "The app updates your daily points goal in real-time, so you never eat too much or too little.",
    },
    {
      id: 5,
      title: "Looking for healthy, easy recipes?",
      description:
        "Browse ready-made recipes and meal plans for every meal – from delicious breakfasts to tasty dinners.",
    },
  ];
  const handleNext = () => {
    if (activeIndex < sections.length - 1) {
      const nextIndex = activeIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });

      return;
    }
    navigation.navigate("ProfileDetails");
    // TODO: Navigate to auth/main flow when onboarding is finished
  };

  const handleMomentumScrollEnd = (event: {
    nativeEvent: { contentOffset: { x: number } };
  }) => {
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
          width: spacing.xxl * 2,
          height: spacing.xxl * 2,
          borderRadius: spacing.rounded,
          backgroundColor: colors.ui.secondaryBackground,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: spacing.xl,
        }}
      >
        <View
          style={{
            width: spacing.xxl * 1.6,
            height: spacing.xxl * 1.6,
            borderRadius: spacing.rounded,
            backgroundColor: colors.ui.accentSoft,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={require("../../assets/icon.png")}
            resizeMode="contain"
            style={{
              width: "70%",
              height: "70%",
              borderRadius: spacing.rounded,
            }}
          />
        </View>
      </View>
      <View style={{ width: "80%", alignItems: "center", gap: spacing.sm }}>
        <Text
          style={{
            fontWeight: "bold",
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
    <SafeAreaView style={globalStyles.container}>
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
        <RoundedButtonComponent handleNext={handleNext} />
      </View>
    </SafeAreaView>
  );
};

export default HowItWorkScreen;
