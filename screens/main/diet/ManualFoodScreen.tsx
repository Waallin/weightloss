import { trackMealLogged } from "../../../services/tracking";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { MotiView } from "moti";
import { ReduceMotion } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { colors } from "../../../constants/colors";
import { globalStyles } from "../../../constants/globalStyles";
import { spacing } from "../../../constants/spacing";
import { typography } from "../../../constants/texts";
import { analyticsEvents } from "../../../constants/analytics";
import { calculateFoodPoints } from "../../../services/dietPoints";
import { addToDiet } from "../../../services/firebase";
import { trackMixpanelEvent } from "../../../services/mixpanel";
import useTodayProgressStore from "../../../stores/useTodayProgressStore";
import useTodayDietStore from "../../../stores/useTodayDietStore";
import useUserStore from "../../../stores/useUserStore";
import useToastStore from "../../../stores/useToastStore";
import { ptsWord, slotForNow } from "../../../utils/goals";
import { RootStackParamList } from "../../navigation/types";

type Portion = "small" | "regular" | "large";

const PORTIONS: { key: Portion; label: string; multiplier: number }[] = [
  { key: "small", label: "Small", multiplier: 0.75 },
  { key: "regular", label: "Regular", multiplier: 1 },
  { key: "large", label: "Large", multiplier: 1.35 },
];

const toNumber = (value: string) => {
  const parsed = parseFloat(value.replace(",", "."));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

const FIELD_BACKGROUND = "#F2F2F4";

const NumberField = ({
  label,
  unit,
  value,
  onChangeText,
  large,
  autoFocus,
}: {
  label: string;
  unit: string;
  value: string;
  onChangeText: (text: string) => void;
  large?: boolean;
  autoFocus?: boolean;
}) => (
  <View style={{ flex: 1, gap: 6 }}>
    <Text style={{ ...typography.bodySemiBold, fontSize: 13, color: colors.goals.muted }}>
      {label}
    </Text>
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        height: large ? 60 : 48,
        paddingHorizontal: 14,
        borderRadius: 14,
        backgroundColor: FIELD_BACKGROUND,
      }}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType="decimal-pad"
        placeholder="0"
        placeholderTextColor={colors.goals.dotEmpty}
        maxLength={6}
        autoFocus={autoFocus}
        style={{
          flex: 1,
          ...typography.bodySemiBold,
          fontSize: large ? 26 : 18,
          color: colors.text.primary,
          padding: 0,
        }}
      />
      <Text style={{ ...typography.body, fontSize: 15, color: colors.goals.muted }}>
        {unit}
      </Text>
    </View>
  </View>
);

const ManualFoodScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "ManualFoodScreen">>();
  const insets = useSafeAreaInsets();
  const { todayProgress, setTodayProgress } = useTodayProgressStore();
  const { todayDiet, setTodayDiet } = useTodayDietStore();
  const { user } = useUserStore();
  const { showToast } = useToastStore();
  const [slot] = useState(slotForNow());

  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [fiber, setFiber] = useState("");
  const [grams, setGrams] = useState("");
  const [portion, setPortion] = useState<Portion>("regular");

  const caloriesValue = toNumber(calories);
  const canAdd = name.trim().length > 0 && caloriesValue > 0;

  const multiplier = PORTIONS.find((p) => p.key === portion)?.multiplier ?? 1;
  const basePoints = calculateFoodPoints({
    calories: caloriesValue,
    protein: toNumber(protein),
    fiber: toNumber(fiber),
    estimatedGrams: toNumber(grams),
  });
  const points = Math.max(0, Math.round(basePoints * multiplier));

  const total = todayProgress?.points?.total ?? 0;
  const used = todayProgress?.points?.used ?? 0;
  const leftAfter = total - used - (caloriesValue > 0 ? points : 0);
  const overAfter = leftAfter < 0;

  const cheer = !canAdd
    ? "Add a name and the calories to see your points."
    : overAfter
      ? "Logged. Honest days count too, and tomorrow starts fresh."
      : "Nice, that fits your day. Add it when you're ready.";

  const handleAdd = async () => {
    if (!canAdd) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const payload = {
      id: "manual",
      type: "manual",
      title: name.trim(),
      points,
    };

    setTodayProgress({
      ...todayProgress,
      points: {
        ...todayProgress.points,
        used: todayProgress.points.used + points,
      },
    });

    try {
      trackMixpanelEvent(analyticsEvents.dietManualAdded, {
        food: payload.title,
        has_macros: toNumber(protein) > 0 || toNumber(fiber) > 0,
      });
      trackMealLogged({ method: "manual", points, slot });
      setTodayDiet([...todayDiet, payload]);
      addToDiet(user?.email, payload);
      showToast(`${slot} added · ${points} ${ptsWord(points)}`);
      if (route.params?.fromFirstDayGuide) {
        navigation.navigate("FirstDayGuide", { mealLogged: true });
      } else {
        navigation.popTo("MainNavigator");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const cardShadow = { ...globalStyles.shadow, shadowOpacity: 0.06 };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.ui.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + spacing.md,
          paddingHorizontal: 20,
          paddingBottom: spacing.lg,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.goBack();
            }}
            accessibilityLabel="Go back"
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              backgroundColor: colors.ui.white,
              alignItems: "center",
              justifyContent: "center",
              ...cardShadow,
            }}
          >
            <Ionicons name="chevron-back" size={20} color={colors.text.primary} />
          </Pressable>
          <Text style={{ ...typography.cardTitle, fontSize: 17, color: colors.text.primary }}>
            {slot}
          </Text>
          <View style={{ width: 44 }} />
        </View>

        <MotiView
          from={{ opacity: 0, translateY: 12, scale: 0.98 }}
          animate={{ opacity: 1, translateY: 0, scale: 1 }}
          transition={{ type: "timing", duration: 420, reduceMotion: ReduceMotion.Never }}
          style={{
            marginTop: 18,
            backgroundColor: colors.ui.white,
            borderRadius: 24,
            padding: 20,
            ...cardShadow,
          }}
        >
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="What did you eat?"
            placeholderTextColor={colors.goals.dotEmpty}
            returnKeyType="done"
            maxLength={60}
            style={{
              ...typography.cardTitle,
              fontSize: 20,
              lineHeight: 26,
              color: colors.text.primary,
              padding: 0,
            }}
          />

          <View style={{ marginTop: 20, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
            <View>
              <View style={{ flexDirection: "row", alignItems: "baseline", gap: 6 }}>
                <Text style={{ ...typography.displayNumeric, fontSize: 56, lineHeight: 62, color: canAdd ? colors.goals.eat : colors.goals.dotEmpty }}>
                  {canAdd ? points : "–"}
                </Text>
                <Text style={{ ...typography.cardTitle, fontSize: 17, color: canAdd ? colors.goals.eat : colors.goals.dotEmpty }}>
                  {points === 1 ? "point" : "points"}
                </Text>
              </View>
              <Text style={{ ...typography.body, fontSize: 15, color: colors.goals.muted }}>this meal</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={{ ...typography.displayNumeric, fontSize: 34, lineHeight: 40, color: overAfter ? colors.goals.over : colors.text.primary }}>
                {overAfter ? -leftAfter : leftAfter}
              </Text>
              <Text style={{ ...typography.body, fontSize: 15, color: colors.goals.muted }}>
                {overAfter ? "over today" : "left today"}
              </Text>
            </View>
          </View>

          <View
            style={{
              marginTop: 18,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              paddingVertical: 10,
              paddingRight: 12,
              paddingLeft: 6,
              borderRadius: 14,
              backgroundColor: colors.goals.eatSoft,
            }}
          >
            <Image
              source={require("../../../assets/mascot/logging.png")}
              resizeMode="contain"
              style={{ width: 52, height: 52 }}
            />
            <Text style={{ flex: 1, ...typography.bodySemiBold, fontSize: 15, lineHeight: 21, color: colors.goals.eatSoftText }}>
              {cheer}
            </Text>
          </View>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 12 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 420, delay: 80, reduceMotion: ReduceMotion.Never }}
          style={{
            marginTop: 12,
            backgroundColor: colors.ui.white,
            borderRadius: 24,
            padding: spacing.md,
            gap: 16,
            ...cardShadow,
            shadowOpacity: 0.04,
          }}
        >
          <NumberField label="Calories" unit="kcal" value={calories} onChangeText={setCalories} large />
          <View>
            <Text style={{ ...typography.small, fontSize: 13, color: colors.goals.muted, marginBottom: 8 }}>
              Optional. More detail gives a fairer score.
            </Text>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <NumberField label="Protein" unit="g" value={protein} onChangeText={setProtein} />
              <NumberField label="Fiber" unit="g" value={fiber} onChangeText={setFiber} />
              <NumberField label="Weight" unit="g" value={grams} onChangeText={setGrams} />
            </View>
          </View>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 12 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 420, delay: 160, reduceMotion: ReduceMotion.Never }}
          style={{
            marginTop: 12,
            backgroundColor: colors.ui.white,
            borderRadius: 24,
            padding: spacing.md,
            ...cardShadow,
            shadowOpacity: 0.04,
          }}
        >
          <View
            accessibilityRole="radiogroup"
            accessibilityLabel="Portion size"
            style={{ flexDirection: "row", gap: 4, padding: 4, borderRadius: 14, backgroundColor: FIELD_BACKGROUND }}
          >
            {PORTIONS.map((p) => {
              const on = portion === p.key;
              return (
                <Pressable
                  key={p.key}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: on }}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setPortion(p.key);
                  }}
                  style={{
                    flex: 1,
                    height: 40,
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: on ? colors.ui.white : "transparent",
                    shadowColor: colors.goals.dark,
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: on ? 0.14 : 0,
                    shadowRadius: 3,
                    elevation: on ? 2 : 0,
                  }}
                >
                  <Text style={{ ...typography.bodySemiBold, fontSize: 15, color: on ? colors.text.primary : colors.goals.muted }}>
                    {p.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={{ ...typography.small, fontSize: 13, color: colors.goals.muted, marginTop: 10 }}>
            Eating more or less than the amounts above? Change the portion size.
          </Text>
        </MotiView>
      </ScrollView>

      <View style={{ paddingTop: 12, paddingHorizontal: 20, paddingBottom: insets.bottom + spacing.sm }}>
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={!canAdd}
          onPress={handleAdd}
          style={{
            height: 58,
            borderRadius: 14,
            backgroundColor: colors.goals.eat,
            alignItems: "center",
            justifyContent: "center",
            opacity: canAdd ? 1 : 0.4,
            shadowColor: colors.goals.eat,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: canAdd ? 0.28 : 0,
            shadowRadius: 10,
            elevation: canAdd ? 6 : 0,
          }}
        >
          <Text style={{ ...typography.button, fontSize: 18, color: colors.ui.white }}>
            Add to {slot.toLowerCase()}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ManualFoodScreen;
