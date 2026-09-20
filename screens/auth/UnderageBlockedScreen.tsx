import { BackHandler, Text, View } from "react-native";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "../../constants/globalStyles";
import { authCopy, textStyles } from "../../constants/texts";
import { spacing } from "../../constants/spacing";

export const UNDERAGE_BLOCKED_KEY = "underage_blocked";

const UnderageBlockedScreen = () => {
  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => true);
    return () => sub.remove();
  }, []);

  return (
    <SafeAreaView style={globalStyles.container} edges={["bottom"]}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            ...textStyles.onboardingTitle,
            textAlign: "center",
            marginBottom: spacing.sm,
          }}
        >
          {authCopy.underageBlockedTitle}
        </Text>
        <Text
          style={{
            ...textStyles.onboardingBody,
            textAlign: "center",
            paddingHorizontal: spacing.sm,
            lineHeight: 22,
          }}
        >
          {authCopy.underageBlockedBody}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default UnderageBlockedScreen;
