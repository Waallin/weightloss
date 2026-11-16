import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import * as haptics from "expo-haptics";
import { globalStyles } from "../../constants/globalStyles";
import { colors } from "../../constants/colors";
import { typography } from "../../constants/texts";
import { spacing } from "../../constants/spacing";
import { analyticsEvents } from "../../constants/analytics";
import { ACQUISITION_SOURCES, type AcquisitionSource } from "../../constants/acquisition";
import ProfileStepSection from "./components/ProfileStepSection";
import OptionCard from "./components/OptionCard";
import useUserStore from "../../stores/useUserStore";
import { setMixpanelPeopleProperties, trackMixpanelEvent } from "../../services/mixpanel";
import { refreshSuperProperties } from "../../services/tracking";
import { updateDocument } from "../../services/firebase";
import { finishFirstDayGuide } from "../../services/finishFirstDayGuide";

// En enda fråga mellan dashboarden och paywallen, så att alla (inte bara de som köper) svarar.
const AcquisitionSourceScreen = () => {
  const navigation = useNavigation();
  const [chosen, setChosen] = useState<AcquisitionSource | null>(null);
  const advancingRef = useRef(false);

  useEffect(() => {
    navigation.setOptions({ gestureEnabled: false });
  }, [navigation]);

  const choose = (source: AcquisitionSource) => {
    if (advancingRef.current) return;
    advancingRef.current = true;
    setChosen(source);
    haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
    trackMixpanelEvent(analyticsEvents.acquisitionSourceAnswered, {
      source,
      skipped: source === "skipped",
    });
    setMixpanelPeopleProperties({ acquisition_source: source });
    const store = useUserStore.getState();
    if (store.user) store.setUser({ ...store.user, acquisitionSource: source });
    const email = useUserStore.getState().user?.email;
    // Sparas i bakgrunden, paywallen ska inte vänta på nätverket
    if (email) {
      updateDocument("users", email, { acquisitionSource: source })
        .then(() => refreshSuperProperties(useUserStore.getState().user))
        .catch((error) => console.log("Could not save acquisition source:", error));
    }
    // Kort paus så valet hinner synas innan vi går vidare
    setTimeout(() => {
      void finishFirstDayGuide(navigation as any, "after_first_scan");
    }, 250);
  };

  return (
    <SafeAreaView style={globalStyles.container} edges={["top", "bottom"]}>
      <View style={{ flex: 1, paddingTop: spacing.xl }}>
        <ProfileStepSection
          title="Where did you hear about Kudoo?"
          description="Helps us reach more people like you."
        >
          <View style={{ width: "100%", gap: spacing.sm }}>
            {ACQUISITION_SOURCES.map((option, index) => (
              <OptionCard
                key={option.id}
                index={index}
                label={option.label}
                active={chosen === option.id}
                onPress={() => choose(option.id)}
              />
            ))}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => choose("skipped")}
              style={{ alignItems: "center", paddingVertical: spacing.sm }}
            >
              <Text style={{ ...typography.body, color: colors.text.secondary }}>Skip</Text>
            </TouchableOpacity>
          </View>
        </ProfileStepSection>
      </View>
    </SafeAreaView>
  );
};

export default AcquisitionSourceScreen;
