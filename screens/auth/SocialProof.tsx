import React from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../constants/colors";
import { spacing } from "../../constants/spacing";
import { fonts } from "../../constants/fonts";
import { globalStyles } from "../../constants/globalStyles";
import { useNavigation } from "@react-navigation/native";

interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  initials?: string;
}

const reviews: Review[] = [
  {
    id: "1",
    name: "Emma L.",
    rating: 5,
    initials: "EL",
    text: "Finally an app that keeps me motivated. Lost 6 kg in two months without feeling restricted.",
  },
  {
    id: "2",
    name: "Marcus K.",
    rating: 5,
    initials: "MK",
    text: "Simple and effective. The daily reminders and progress tracking made all the difference.",
  },
  {
    id: "3",
    name: "Sofia M.",
    rating: 4,
    initials: "SM",
    text: "Love the clean design. Easy to log meals and workouts. Would recommend to anyone starting their journey.",
  },
  {
    id: "4",
    name: "Johan P.",
    rating: 5,
    initials: "JP",
    text: "Best weight loss app I've tried. No gimmicks, just solid tracking and great tips.",
  },
  {
    id: "5",
    name: "Linda H.",
    rating: 4,
    initials: "LH",
    text: "Helped me build better habits. The goals feature keeps me accountable every week.",
  },
];

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const full = "★";
  const empty = "☆";
  return (
    <View style={{ flexDirection: "row", gap: spacing.xs / 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text
          key={i}
          style={{
            fontSize: 14,
            color: i <= rating ? colors.ui.primary : colors.ui.dotInactive,
          }}
        >
          {i <= rating ? full : empty}
        </Text>
      ))}
    </View>
  );
};

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
  const initials = review.initials ?? review.name.split(" ").map((n) => n[0]).join("").slice(0, 2);
  return (
    <View
      style={{
        backgroundColor: colors.ui.secondaryBackground,
        borderRadius: spacing.borderRadius,
        padding: spacing.lg,
        marginBottom: spacing.md,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.sm }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: spacing.rounded,
            backgroundColor: colors.ui.accentSoft,
            alignItems: "center",
            justifyContent: "center",
            marginRight: spacing.sm,
          }}
        >
          <Text
            style={{
              fontFamily: fonts.primary.semiBold,
              fontSize: 14,
              color: colors.ui.primary,
            }}
          >
            {initials}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: fonts.primary.medium,
              fontSize: 14,
              color: colors.text.primary,
            }}
          >
            {review.name}
          </Text>
          <StarRating rating={review.rating} />
        </View>
      </View>
      <Text
        style={{
          fontFamily: fonts.primary.regular,
          fontSize: 14,
          color: colors.text.secondary,
          lineHeight: 20,
        }}
      >
        {review.text}
      </Text>
    </View>
  );
};

const SocialProof: React.FC = () => {
  const navigation = useNavigation();

  const renderHeader = () => (
    <View style={{ marginBottom: spacing.xl, paddingHorizontal: spacing.xs }}>
      <Text
        style={{
          fontFamily: fonts.primary.bold,
          fontSize: 24,
          color: colors.text.primary,
          textAlign: "center",
          marginBottom: spacing.sm,
        }}
      >
        Loved by thousands
      </Text>
      <Text
        style={{
          fontFamily: fonts.primary.regular,
          fontSize: 14,
          color: colors.text.secondary,
          textAlign: "center",
        }}
      >
        See what our users say about their journey
      </Text>
    </View>
  );

  const renderCTA = () => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => (navigation as { navigate: (name: string) => void }).navigate("ProfileDetails")}
      style={{
        alignSelf: "center",
        marginTop: spacing.lg,
        marginBottom: spacing.xxl,
      }}
    >
      <View
        style={{
          width: 60,
          height: 60,
          borderRadius: spacing.rounded,
          backgroundColor: colors.ui.primary,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontFamily: fonts.primary.medium,
            fontSize: 35,
            color: colors.ui.background,
          }}
        >
          →
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={{ flex: 1, paddingTop: spacing.lg }}>
        {renderHeader()}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: spacing.lg }}
          showsVerticalScrollIndicator={false}
        >
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </ScrollView>
        {renderCTA()}
      </View>
    </SafeAreaView>
  );
};

export default SocialProof;
