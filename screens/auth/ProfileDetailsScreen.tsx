import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { globalStyles } from "../../constants/globalStyles";
import PrimaryButtonComponent from "../../components/PrimaryButtonComponent";
import { colors } from "../../constants/colors";
import { authCopy, textStyles, typography } from "../../constants/texts";
import { spacing } from "../../constants/spacing";
import WheelPicker from "../../components/WheelPicker";
import UnitToggle from "../../components/UnitToggle";
import ProfileStepSection from "./components/ProfileStepSection";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types";
import * as haptics from "expo-haptics";
import { MotiView } from "moti";
import { ReduceMotion } from "react-native-reanimated";
import useUserStore from "../../stores/useUserStore";
import useUnitsStore from "../../stores/useUnitsStore";
import { setMixpanelPeopleProperty, trackMixpanelEvent } from "../../services/mixpanel";
import {
  cmToFeetInches,
  feetInchesToCm,
  formatFeetInches,
  formatLb,
  HEIGHT_MAX_CM,
  HEIGHT_MIN_CM,
  kgToLb,
  lbToKg,
} from "../../utils/units";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const SPOTLIGHT_OUTER = Math.min(SCREEN_WIDTH * 0.78, 320);
const SPOTLIGHT_IMAGE_SIZE = SPOTLIGHT_OUTER * 0.84;

const currentYear = new Date().getFullYear();
const BIRTH_YEARS = (() => {
  const list: number[] = [];
  for (let y = currentYear; y >= currentYear - 110; y -= 1) list.push(y);
  return list;
})();

const WEIGHT_IN_LB = (() => {
  const list: number[] = [];
  for (let lb = kgToLb(40); lb <= kgToLb(200); lb += 1) list.push(lb);
  return list;
})();

const WEIGHT_IN_KG = (() => {
  const list: number[] = [];
  for (let kg = 40; kg <= 200; kg += 1) list.push(kg);
  return list;
})();

const HEIGHT_CM_OPTIONS = (() => {
  const list: number[] = [];
  for (let cm = HEIGHT_MIN_CM; cm <= HEIGHT_MAX_CM; cm += 1) list.push(cm);
  return list;
})();

type GenderChoice = "Male" | "Female" | "Prefer not to say";

const FEET_OPTIONS = [3, 4, 5, 6, 7];
const INCHES_OPTIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

const snapToRange = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, Math.round(value)));

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
        borderRadius: spacing.rounded,
      }}
    />
  );
});

PaginationDot.displayName = "PaginationDot";

const ProfileDetailsScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { user, setUser } = useUserStore();
  const { heightUnit, weightUnit, setHeightUnit, setWeightUnit } =
    useUnitsStore();
  const [birthYear, setBirthYear] = useState<number>(currentYear - 25);
  const [startWeight, setStartWeight] = useState<number>(70);
  const [goalWeight, setGoalWeight] = useState<number>(70);
  const [height, setHeight] = useState<number>(175);
  const [genderChoice, setGenderChoice] = useState<GenderChoice>("Male");
  const gender: "Male" | "Female" =
    genderChoice === "Female" ? "Female" : "Male";
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [createdPlan, setCreatedPlan] = useState<boolean>(false);

  const totalSteps = 5;
  const activeIndex = step - 1;
  const age = useMemo(() => {
    const computed = currentYear - birthYear;
    return computed > 0 ? computed : 0;
  }, [birthYear, currentYear]);

  const goalDeltaKg = useMemo(
    () => Math.abs(startWeight - goalWeight),
    [goalWeight, startWeight],
  );

  const goalDirection = useMemo<"lose" | "gain" | "maintain">(() => {
    if (goalWeight < startWeight) return "lose";
    if (goalWeight > startWeight) return "gain";
    return "maintain";
  }, [goalWeight, startWeight]);

  const renderHeader = () => {
    return (
      <View
        style={{
          marginBottom: spacing.xl,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {step > 1 && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleBack}
            style={{
              position: "absolute",
              left: 0,
              paddingVertical: spacing.sm,
              paddingHorizontal: spacing.sm,
              borderRadius: spacing.borderRadius,
              backgroundColor: colors.ui.secondaryBackground,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                ...typography.headline,
                fontWeight: "400",
                color: colors.ui.primary,
                
              }}
            >
              Back
            </Text>
          </TouchableOpacity>
        )}
        <Text
          style={{
            ...typography.socialProofStat,
            color: colors.text.primary,
            textAlign: "center",
          }}
        >
          Profile Details
        </Text>
      </View>
    );
  };

  const renderBirthdayStep = () => {
    return (
      <ProfileStepSection
        title="How old are you?"
        description="We’ll use this so the plan actually fits you."
        summaryIconName="person"
        summaryLabel="Selected age:"
        summaryValue={`${age}`}
      >
        <WheelPicker<number>
          data={BIRTH_YEARS}
          value={birthYear}
          onChange={setBirthYear}
          getLabel={(y) => String(y)}
        />
      </ProfileStepSection>
    );
  };

  const renderGenderStep = () => {
    const options: Array<"Male" | "Female"> = ["Male", "Female"];
    const renderOption = (option: GenderChoice) => {
      const active = genderChoice === option;
      return (
        <TouchableOpacity
          key={option}
          activeOpacity={0.85}
          onPress={() => {
            if (genderChoice === option) return;
            haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
            setGenderChoice(option);
          }}
          style={{
            flex: 1,
            paddingVertical: spacing.md,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: spacing.borderRadius,
            backgroundColor: active ? colors.ui.white : "#E3E3E9",
            borderWidth: active ? 1 : 0,
            borderColor: colors.ui.cardBorder,
            ...(active ? globalStyles.shadow : {}),
          }}
        >
          <Text
            style={{
              ...(active ? typography.bodySemiBold : typography.body),
              color: active ? colors.text.primary : colors.text.secondary,
            }}
          >
            {option}
          </Text>
        </TouchableOpacity>
      );
    };

    return (
      <ProfileStepSection
        title="What is your gender?"
        description="Just so we can tailor your targets."
        summaryIconName="person"
        summaryLabel="Selected gender:"
        summaryValue={genderChoice}
      >
        <View style={{ width: "100%", gap: spacing.sm }}>
          <View
            style={{
              flexDirection: "row",
              padding: spacing.xs,
              backgroundColor: colors.ui.secondaryBackground,
              borderRadius: spacing.borderRadius,
            }}
          >
            {options.map((option) => renderOption(option))}
          </View>

          <View
            style={{
              padding: spacing.xs,
              backgroundColor: colors.ui.secondaryBackground,
              borderRadius: spacing.borderRadius,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                if (genderChoice === "Prefer not to say") return;
                haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
                setGenderChoice("Prefer not to say");
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: spacing.sm,
                paddingVertical: spacing.md,
                paddingHorizontal: spacing.md,
                borderRadius: spacing.borderRadius,
                backgroundColor:
                  genderChoice === "Prefer not to say"
                    ? colors.ui.white
                    : "#E3E3E9",
                borderWidth: genderChoice === "Prefer not to say" ? 1 : 0,
                borderColor: colors.ui.cardBorder,
                ...(genderChoice === "Prefer not to say"
                  ? globalStyles.shadow
                  : {}),
              }}
            >
              <Text
                style={{
                  ...(genderChoice === "Prefer not to say"
                    ? typography.bodySemiBold
                    : typography.body),
                  color:
                    genderChoice === "Prefer not to say"
                      ? colors.text.primary
                      : colors.text.secondary,
                }}
              >
                Prefer not to say
              </Text>
              <MaterialIcons
                name="chevron-right"
                size={20}
                color={
                  genderChoice === "Prefer not to say"
                    ? colors.text.primary
                    : colors.text.secondary
                }
              />
            </TouchableOpacity>
          </View>
        </View>
      </ProfileStepSection>
    );
  };

  const renderHeightStep = () => {
    const { feet, inches } = cmToFeetInches(height);
    const heightCm = snapToRange(height, HEIGHT_MIN_CM, HEIGHT_MAX_CM);
    return (
      <ProfileStepSection
        title="What is your height?"
        description="Helps us set your daily points."
        summaryIconName="person"
        summaryLabel="Selected height:"
        summaryValue={
          heightUnit === "ft"
            ? formatFeetInches(feet, inches)
            : `${heightCm} cm`
        }
      >
        <View style={{ width: "100%", alignItems: "center" }}>
          <View style={{ marginBottom: spacing.md }}>
            <UnitToggle
              options={["ft", "cm"] as const}
              value={heightUnit}
              onChange={setHeightUnit}
            />
          </View>
          {heightUnit === "ft" ? (
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                gap: spacing.xl,
                justifyContent: "center",
              }}
            >
              <View>
                <WheelPicker<number>
                  data={FEET_OPTIONS}
                  value={feet}
                  onChange={(ft) => setHeight(feetInchesToCm(ft, inches))}
                  getLabel={(ft) => `${ft} ft`}
                />
              </View>
              <View>
                <WheelPicker<number>
                  data={INCHES_OPTIONS}
                  value={inches}
                  onChange={(inch) => setHeight(feetInchesToCm(feet, inch))}
                  getLabel={(inch) => `${inch} in`}
                />
              </View>
            </View>
          ) : (
            <WheelPicker<number>
              data={HEIGHT_CM_OPTIONS}
              value={heightCm}
              onChange={setHeight}
              getLabel={(cm) => `${cm} cm`}
            />
          )}
        </View>
      </ProfileStepSection>
    );
  };

  const renderWeightStep = () => {
    const weightKg = snapToRange(startWeight, 40, 120);
    const isLb = weightUnit === "lb";
    return (
      <ProfileStepSection
        title="How much do you weigh?"
        description="No pressure. Just a starting point."
        summaryIconName="person"
        summaryLabel="Selected weight:"
        summaryValue={
          isLb ? `${formatLb(kgToLb(startWeight))} lb` : `${weightKg} kg`
        }
      >
        <View style={{ width: "100%", alignItems: "center" }}>
          <View style={{ marginBottom: spacing.md }}>
            <UnitToggle
              options={["lb", "kg"] as const}
              value={weightUnit}
              onChange={setWeightUnit}
            />
          </View>
          {isLb ? (
            <WheelPicker<number>
              data={WEIGHT_IN_LB}
              value={kgToLb(startWeight)}
              onChange={(lb) => setStartWeight(lbToKg(lb))}
              getLabel={(lb) => formatLb(lb)}
            />
          ) : (
            <WheelPicker<number>
              data={WEIGHT_IN_KG}
              value={weightKg}
              onChange={setStartWeight}
              getLabel={(kg) => String(kg)}
            />
          )}
        </View>
      </ProfileStepSection>
    );
  };

  const renderGoalWeightStep = () => {
    const weightKg = snapToRange(goalWeight, 40, 120);
    const isLb = weightUnit === "lb";
    return (
      <ProfileStepSection
        title="What is your goal weight?"
        description="You can always change this later."
        summaryIconName="person"
        summaryLabel="Selected goal weight:"
        summaryValue={
          isLb ? `${formatLb(kgToLb(goalWeight))} lb` : `${weightKg} kg`
        }
      >
        <View style={{ width: "100%", alignItems: "center" }}>
          <View style={{ marginBottom: spacing.md }}>
            <UnitToggle
              options={["lb", "kg"] as const}
              value={weightUnit}
              onChange={setWeightUnit}
            />
          </View>
          {isLb ? (
            <WheelPicker<number>
              data={WEIGHT_IN_LB}
              value={kgToLb(goalWeight)}
              onChange={(lb) => setGoalWeight(lbToKg(lb))}
              getLabel={(lb) => formatLb(lb)}
            />
          ) : (
            <WheelPicker<number>
              data={WEIGHT_IN_KG}
              value={weightKg}
              onChange={setGoalWeight}
              getLabel={(kg) => String(kg)}
            />
          )}
        </View>
      </ProfileStepSection>
    );
  };

  const handleCreatePlan = () => {
    haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
    trackMixpanelEvent("ProfileDetails_complete", { age, gender, height, startWeight, goalWeight })
    setMixpanelPeopleProperty("age", age);
    setMixpanelPeopleProperty("gender", gender);
    setMixpanelPeopleProperty("height", height);
    setMixpanelPeopleProperty("weight", startWeight);
    setMixpanelPeopleProperty("weight_goal", goalWeight);


    navigation.navigate("SocialProofScreen");
  };
  const renderPlanCreated = () => {
    const goalDeltaKg = Math.abs((user?.goalWeight ?? 0) - (user?.startWeight ?? 0));
    const goalDeltaLabel =
      weightUnit === "lb"
        ? `${formatLb(kgToLb(goalDeltaKg))} lbs`
        : `${Math.round(goalDeltaKg)} kg`;
    const targetValue =
      goalDirection === "maintain"
        ? "Maintain weight"
        : `${goalDirection === "lose" ? "Lose" : "Gain"} ${goalDeltaLabel}`;

    const planRows = [
      { label: "Daily steps", value: "5,000", highlight: false },
      { label: "Daily water", value: "10 glasses", highlight: false },
      { label: "Recipes", value: "Personalized", highlight: false },
      { label: "Target", value: targetValue, highlight: true },
    ];

    return (
      <SafeAreaView style={globalStyles.container} edges={["bottom"]}>

        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            type: "timing",
            duration: 350,
            reduceMotion: ReduceMotion.Never,
          }}
          style={{
            flex: 1,
          }}
        >
          <MotiView
            from={{ opacity: 0, translateY: 30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{
              type: "timing",
              duration: 600,
              delay: 160,
              reduceMotion: ReduceMotion.Never,
            }}
            style={{ width: "100%", alignItems: "center" }}
          >
            <MotiView
              from={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "timing",
                duration: 480,
                delay: 60,
                reduceMotion: ReduceMotion.Never,
              }}
              style={{
                width: SPOTLIGHT_OUTER,
                height: SPOTLIGHT_OUTER,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: spacing.md,
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
                source={require("../../assets/mascot/thumbsUp.png")}
                resizeMode="contain"
                style={{
                  width: SPOTLIGHT_IMAGE_SIZE,
                  height: SPOTLIGHT_IMAGE_SIZE,
                }}
              />
            </MotiView>

            <MotiView
              from={{ opacity: 0, translateY: 24 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{
                type: "timing",
                duration: 380,
                delay: 100,
                reduceMotion: ReduceMotion.Never,
              }}
              style={{ width: "100%" }}
            >
              <Text
                style={{
                  ...textStyles.onboardingTitle,
                  textAlign: "center",
                  marginBottom: spacing.sm,
                }}
              >
                You’re all set
              </Text>
            </MotiView>

            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{
                type: "timing",
                duration: 340,
                delay: 160,
                reduceMotion: ReduceMotion.Never,
              }}
              style={{ width: "100%" }}
            >
              <Text
                style={{
                  ...textStyles.onboardingBody,
                  textAlign: "center",
                  paddingHorizontal: spacing.sm,
                  lineHeight: 22,
                  marginBottom: spacing.lg,
                }}
              >
                Just follow this. We’ll handle the rest.
              </Text>
            </MotiView>

            <MotiView
              from={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "timing",
                duration: 420,
                delay: 210,
                reduceMotion: ReduceMotion.Never,
              }}
              style={{ width: "100%" }}
            >
              <Text
                style={{
                  ...typography.captionSemiBold,
                  color: colors.text.secondary,
                  letterSpacing: 0.6,
                  marginBottom: spacing.sm,
                }}
              >
                YOUR PERSONALIZED PLAN
              </Text>

              <View
                style={{
                  width: "100%",
                  backgroundColor: colors.ui.componentBackground,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.ui.cardBorder,
                  ...globalStyles.shadow,
                  overflow: "hidden",
                }}
              >
                {planRows.map((row, index) => (
                  <View key={row.label}>
                    {index > 0 ? (
                      <View
                        style={{
                          height: 1,
                          backgroundColor: colors.ui.cardBorder,
                          marginHorizontal: spacing.md,
                        }}
                      />
                    ) : null}
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: spacing.md,
                        paddingVertical: spacing.md,
                        paddingHorizontal: spacing.md,
                      }}
                    >
                      <Text
                        style={{
                          ...typography.body,
                          color: colors.text.primary,
                        }}
                      >
                        {row.label}
                      </Text>
                      <Text
                        style={{
                          ...(row.highlight
                            ? typography.bodySemiBold
                            : typography.body),
                          color: row.highlight
                            ? colors.ui.primary
                            : colors.text.secondary,
                        }}
                      >
                        {row.value}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              <Text
                style={{
                  ...typography.small,
                  color: colors.text.secondary,
                  marginTop: spacing.sm,
                }}
              >
                {authCopy.planReadySocialProof}
              </Text>
            </MotiView>
          </MotiView>
          <MotiView
            from={{ opacity: 0, translateY: 30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{
              type: "timing",
              duration: 420,
              delay: 380,
              reduceMotion: ReduceMotion.Never,
            }}
            style={{
              width: "100%",
              paddingBottom: spacing.scrollViewBottomPadding,
            }}
          ></MotiView>
        </MotiView>
        <View style={{ paddingBottom: spacing.sm }}>
          <PrimaryButtonComponent
            title="Unlock my plan"
            onPress={handleCreatePlan}
          />
        </View>
      </SafeAreaView>
    );
  };

  const handleNext = () => {
    const userObj = {
      birthYear,
      gender,
      height,
      startWeight,
      goalWeight,
      currentWeight: startWeight,
    };
    setUser(userObj);
    haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
    if (step < 5) {
      setStep((prev) => (prev + 1) as 1 | 2 | 3 | 4 | 5);
    } else {
      setCreatedPlan(true);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4 | 5);
      return;
    }
    if (navigation.canGoBack()) navigation.goBack();
  };

  if (createdPlan) {
    return renderPlanCreated();
  }

  return (
    <SafeAreaView style={globalStyles.container} edges={["bottom"]}>
      <View style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
          }}
        >
          {renderHeader()}
          {step === 1 && renderBirthdayStep()}
          {step === 2 && renderGenderStep()}
          {step === 3 && renderHeightStep()}
          {step === 4 && renderWeightStep()}
          {step === 5 && renderGoalWeightStep()}
        </View>
        <View
          style={{
            paddingBottom: spacing.scrollViewBottomPadding,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: spacing.lg,
              gap: spacing.xs,
            }}
          >
            {Array.from({ length: totalSteps }).map((_, index) => (
              <PaginationDot
                key={String(index)}
                isActive={index === activeIndex}
              />
            ))}
          </View>
        </View>
      </View>
      <View style={{ paddingBottom: spacing.sm }}>
        <PrimaryButtonComponent title="Continue" onPress={handleNext} />
      </View>
    </SafeAreaView>
  );
};

export default ProfileDetailsScreen;
