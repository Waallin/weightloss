import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useMemo, useState } from "react";
import { globalStyles } from "../../constants/globalStyles";
import PrimaryButtonComponent from "../../components/PrimaryButtonComponent";
import { colors } from "../../constants/colors";
import { typography } from "../../constants/texts";
import { spacing } from "../../constants/spacing";
import WheelPicker from "../../components/WheelPicker";
import UnitToggle from "../../components/UnitToggle";
import ProfileStepSection from "./components/ProfileStepSection";
import OptionCard from "./components/OptionCard";
import EndowedProgressBar from "./components/EndowedProgressBar";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types";
import * as haptics from "expo-haptics";
import useUserStore from "../../stores/useUserStore";
import useUnitsStore from "../../stores/useUnitsStore";
import { setMixpanelPeopleProperties, trackMixpanelEvent } from "../../services/mixpanel";
import { goalFromWeights } from "../../services/tracking";
import { analyticsEvents } from "../../constants/analytics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UnderageBlockedScreen, {
  UNDERAGE_BLOCKED_KEY,
} from "./UnderageBlockedScreen";
import {
  cmToFeetInches,
  feetInchesToCm,
  formatLb,
  HEIGHT_MAX_CM,
  HEIGHT_MIN_CM,
  kgToLb,
  lbToKg,
} from "../../utils/units";

const currentYear = new Date().getFullYear();
// Age is asked as a group; the stored birth year is the group's midpoint (used for the points calculation)
// Endowed progress: the onboarding slides already count, so the first step starts at 25%
const STEP_PROGRESS: Record<1 | 2 | 3 | 4 | 5, { progress: number; label: string }> = {
  1: { progress: 0.25, label: "Great start, you’re already on your way" },
  2: { progress: 0.4, label: "Nice, keep going" },
  3: { progress: 0.55, label: "More than halfway" },
  4: { progress: 0.7, label: "Almost there" },
  5: { progress: 0.85, label: "Last question" },
};

const AGE_GROUPS = [
  { id: "18-29", label: "18–29", birthYear: currentYear - 24 },
  { id: "30-44", label: "30–44", birthYear: currentYear - 37 },
  { id: "45-59", label: "45–59", birthYear: currentYear - 52 },
  { id: "60+", label: "60+", birthYear: currentYear - 67 },
] as const;
type AgeGroupId = (typeof AGE_GROUPS)[number]["id"];

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

const GOAL_WEIGHT_MIN_KG = 40;
const GOAL_WEIGHT_DEFAULT_LOSS_KG = 10;

const ProfileDetailsScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { setUser } = useUserStore();
  const { heightUnit, weightUnit, setHeightUnit, setWeightUnit } =
    useUnitsStore();
  const [birthYear, setBirthYear] = useState<number>(currentYear - 25);
  const [ageGroup, setAgeGroup] = useState<AgeGroupId | null>(null);
  const advancingRef = React.useRef(false);
  const lastStepAtRef = React.useRef<number | null>(null);
  const [startWeight, setStartWeight] = useState<number>(100);
  const [goalWeight, setGoalWeight] = useState<number>(90);
  const [height, setHeight] = useState<number>(175);
  const [genderChoice, setGenderChoice] = useState<GenderChoice>("Male");
  const gender: "Male" | "Female" =
    genderChoice === "Female" ? "Female" : "Male";
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [ageBlocked, setAgeBlocked] = useState<boolean>(false);
  // A step can only be continued after the user has interacted with it (scrolling back to the default counts)
  const [touchedSteps, setTouchedSteps] = useState<Record<number, boolean>>({});
  // Until the user picks a goal weight themselves, it follows the start weight at 10 kg less
  useEffect(() => {
    if (touchedSteps[5]) return;
    setGoalWeight(Math.max(GOAL_WEIGHT_MIN_KG, startWeight - GOAL_WEIGHT_DEFAULT_LOSS_KG));
  }, [startWeight, touchedSteps]);
  // Gender and goal weight have sensible defaults and can be continued without interaction
  const canContinue = step === 2 || step === 5 || touchedSteps[step];
  const markTouched = (forStep: number) =>
    setTouchedSteps((prev) => (prev[forStep] ? prev : { ...prev, [forStep]: true }));

  const age = useMemo(() => {
    const computed = currentYear - birthYear;
    return computed > 0 ? computed : 0;
  }, [birthYear, currentYear]);

  useEffect(() => {
    if (!ageBlocked) return;
    trackMixpanelEvent(analyticsEvents.underageBlocked);
    navigation.setOptions({ gestureEnabled: false });
  }, [ageBlocked, navigation]);

  useEffect(() => {
    if (ageBlocked) return;
    const stepName =
      step === 1
        ? "birthday"
        : step === 2
          ? "gender"
          : step === 3
            ? "height"
            : step === 4
              ? "weight"
              : "goal";
    const now = Date.now();
    trackMixpanelEvent(analyticsEvents.profileDetailsStepViewed, {
      step: stepName,
      step_index: step,
      total_steps: 5,
      ms_since_previous_step: lastStepAtRef.current ? now - lastStepAtRef.current : undefined,
    });
    lastStepAtRef.current = now;
  }, [step, ageBlocked]);

  const renderHeader = () => {
    return (
      <View style={{ marginBottom: spacing.xl, width: "100%" }}>
        <View
          style={{
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
        <EndowedProgressBar
          progress={STEP_PROGRESS[step].progress}
          label={STEP_PROGRESS[step].label}
        />
      </View>
    );
  };

  const handleUnderage = async () => {
    haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
    await AsyncStorage.setItem(UNDERAGE_BLOCKED_KEY, "true");
    setAgeBlocked(true);
  };

  const renderBirthdayStep = () => {
    return (
      <ProfileStepSection
        title="How old are you?"
        description="We’ll use this so the plan actually fits you."
      >
        <View style={{ width: "100%", gap: spacing.sm }}>
          {AGE_GROUPS.map((group, index) => (
            <OptionCard
              key={group.id}
              index={index}
              label={group.label}
              active={ageGroup === group.id}
              onPress={() => {
                if (advancingRef.current) return;
                advancingRef.current = true;
                markTouched(1);
                setAgeGroup(group.id);
                setBirthYear(group.birthYear);
                haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
                // Kort paus så valet hinner synas innan vi går vidare
                setTimeout(() => {
                  setUser({
                    birthYear: group.birthYear,
                    gender,
                    height,
                    startWeight,
                    goalWeight,
                    currentWeight: startWeight,
                  });
                  setStep(2);
                  advancingRef.current = false;
                }, 250);
              }}
            />
          ))}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleUnderage}
            style={{ alignItems: "center", paddingVertical: spacing.sm }}
          >
            <Text style={{ ...typography.body, color: colors.text.secondary }}>
              I’m under 18
            </Text>
          </TouchableOpacity>
        </View>
      </ProfileStepSection>
    );
  };

  const renderGenderStep = () => {
    const options: GenderChoice[] = ["Male", "Female", "Prefer not to say"];

    return (
      <ProfileStepSection
        title="What is your gender?"
        description="Just so we can tailor your targets."
      >
        <View style={{ width: "100%", gap: spacing.sm }}>
          {options.map((option, index) => (
            <OptionCard
              key={option}
              index={index}
              label={option}
              active={genderChoice === option}
              onPress={() => {
                if (advancingRef.current) return;
                advancingRef.current = true;
                setGenderChoice(option);
                haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
                // Kort paus så valet hinner synas innan vi går vidare
                setTimeout(() => {
                  setUser({
                    birthYear,
                    gender: option === "Female" ? "Female" : "Male",
                    height,
                    startWeight,
                    goalWeight,
                    currentWeight: startWeight,
                  });
                  setStep(3);
                  advancingRef.current = false;
                }, 250);
              }}
            />
          ))}
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
                  onChange={(ft) => {
                    markTouched(3);
                    setHeight(feetInchesToCm(ft, inches));
                  }}
                  getLabel={(ft) => `${ft} ft`}
                />
              </View>
              <View>
                <WheelPicker<number>
                  data={INCHES_OPTIONS}
                  value={inches}
                  onChange={(inch) => {
                    markTouched(3);
                    setHeight(feetInchesToCm(feet, inch));
                  }}
                  getLabel={(inch) => `${inch} in`}
                />
              </View>
            </View>
          ) : (
            <WheelPicker<number>
              data={HEIGHT_CM_OPTIONS}
              value={heightCm}
              onChange={(cm) => {
                markTouched(3);
                setHeight(cm);
              }}
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
              onChange={(lb) => {
                markTouched(4);
                setStartWeight(lbToKg(lb));
              }}
              getLabel={(lb) => formatLb(lb)}
            />
          ) : (
            <WheelPicker<number>
              data={WEIGHT_IN_KG}
              value={weightKg}
              onChange={(kg) => {
                markTouched(4);
                setStartWeight(kg);
              }}
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
              onChange={(lb) => {
                markTouched(5);
                setGoalWeight(lbToKg(lb));
              }}
              getLabel={(lb) => formatLb(lb)}
            />
          ) : (
            <WheelPicker<number>
              data={WEIGHT_IN_KG}
              value={weightKg}
              onChange={(kg) => {
                markTouched(5);
                setGoalWeight(kg);
              }}
              getLabel={(kg) => String(kg)}
            />
          )}
        </View>
      </ProfileStepSection>
    );
  };

  const finishProfile = () => {
    // Grupper i stället för exakta värden: vikt och längd är hälsodata
    const { goal_type, weight_goal_band } = goalFromWeights(startWeight, goalWeight);
    trackMixpanelEvent(analyticsEvents.profileDetailsCompleted, {
      age_group: ageGroup,
      gender,
      goal_type,
      weight_goal_band,
    });
    setMixpanelPeopleProperties({ age_group: ageGroup, gender, goal_type, weight_goal_band });

    navigation.navigate("Auth");
  };
  const handleNext = async () => {
    if (step === 1 && age < 18) {
      await AsyncStorage.setItem(UNDERAGE_BLOCKED_KEY, "true");
      setAgeBlocked(true);
      return;
    }
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
      finishProfile();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4 | 5);
      return;
    }
    if (navigation.canGoBack()) navigation.goBack();
  };

  if (ageBlocked) {
    return <UnderageBlockedScreen />;
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
        <View style={{ paddingBottom: spacing.scrollViewBottomPadding }} />
      </View>
      {step > 2 && (
        <View
          style={{ paddingBottom: spacing.sm, opacity: canContinue ? 1 : 0.4 }}
        >
          <PrimaryButtonComponent
            title={step === 5 ? "See my plan" : "Continue"}
            onPress={handleNext}
            disabled={!canContinue}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default ProfileDetailsScreen;
