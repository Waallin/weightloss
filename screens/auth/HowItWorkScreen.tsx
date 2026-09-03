import React from "react";
import { Dimensions, FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../constants/colors";
import { spacing } from "../../constants/spacing";
import { globalStyles } from "../../constants/globalStyles";
import { authCopy, textStyles, typography } from "../../constants/texts";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import * as haptics from "expo-haptics";
import PrimaryButtonComponent from "../../components/PrimaryButtonComponent";
import { trackMixpanelEvent } from "../../services/mixpanel";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const SPOTLIGHT_OUTER = Math.min(SCREEN_WIDTH * 0.78, 320);
const IMAGE_SIZE = SPOTLIGHT_OUTER * 0.84;
const DOT_SIZE = 8;
const DOT_INACTIVE = "#D8D8D6";

type HowItWorkImageKey = (typeof authCopy.howItWorkSections)[number]["imageKey"];

type HowItWorkSection = {
  id: number;
  title: string;
  subtitle: string;
  items?: readonly string[];
  cta: string;
  image: number;
};

type AuthStackParamList = {
  HowItWork: undefined;
  ProfileDetails: undefined;
  MainStack: undefined;
};

const imageByKey: Record<HowItWorkImageKey, number> = {
  waving: require("../../assets/mascot/waving.png"),
  standing: require("../../assets/mascot/standing.png"),
  thumbsUp: require("../../assets/mascot/thumbsUp.png"),
};

const sections: HowItWorkSection[] = authCopy.howItWorkSections.map((s) => ({
  id: s.id,
  title: s.title,
  subtitle: s.subtitle,
  items: "items" in s ? s.items : undefined,
  cta: s.cta,
  image: imageByKey[s.imageKey],
}));

const HabitListCard = ({ items }: { items: readonly string[] }) => {
  return (
    <View
      style={{
        width: "100%",
        marginTop: spacing.lg,
        backgroundColor: colors.ui.componentBackground,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.ui.cardBorder,
        ...globalStyles.shadow,
        overflow: "hidden",
      }}
    >
      {items.map((item, index) => (
        <View key={item}>
          {index > 0 ? (
            <View
              style={{
                height: 1,
                backgroundColor: colors.ui.cardBorder,
                marginHorizontal: spacing.md,
              }}
            />
          ) : null}
          <Text
            style={{
              ...typography.body,
              color: colors.text.primary,
              paddingVertical: spacing.md,
              paddingHorizontal: spacing.md,
            }}
          >
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
};

const HowItWorkSlide = React.memo(({ item }: { item: HowItWorkSection }) => {
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
        {item.subtitle}
      </Text>

      {item.items ? <HabitListCard items={item.items} /> : null}
    </View>
  );
});

HowItWorkSlide.displayName = "HowItWorkSlide";

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

const HowItWorkScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
  const [activeIndex, setActiveIndex] = React.useState(0);
  const flatListRef = React.useRef<FlatList>(null);

  const handleContinue = () => {
    haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
    if (activeIndex < sections.length - 1) {
      const nextIndex = activeIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setActiveIndex(nextIndex);
      return;
    }
    trackMixpanelEvent("HowItWork_complete");
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
    ({ item }: { item: HowItWorkSection }) => {
      return <HowItWorkSlide item={item} />;
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

export default HowItWorkScreen;
