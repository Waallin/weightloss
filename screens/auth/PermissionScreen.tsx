import React from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MotiText, MotiView } from "moti";
import { ReduceMotion } from "react-native-reanimated";
import { globalStyles } from "../../constants/globalStyles";
import { colors } from "../../constants/colors";
import { spacing } from "../../constants/spacing";
import PrimaryButtonComponent from "../../components/PrimaryButtonComponent";
import { textSizes, textStyles } from "../../constants/texts";
import { useNavigation } from "@react-navigation/native";

const IMAGE_SIZE = 250;

const PermissionScreen = () => {
  const navigation = useNavigation();
  const handleCTAPress = () => {
    navigation.replace("MainStack");
  };

  const renderImage = () => {
    return (
      <MotiView
        from={{ opacity: 0, translateY: 10, scale: 0.98 }}
        animate={{ opacity: 1, translateY: 0, scale: 1 }}
        transition={{
          type: "timing",
          duration: 450,
          reduceMotion: ReduceMotion.Never,
        }}
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        <MotiView
          from={{ opacity: 0, translateY: 14, scale: 0.96 }}
          animate={{ opacity: 1, translateY: 0, scale: 1 }}
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
              alignSelf: "center",
            },
          ]}
        >
          <Image
            source={require("../../assets/mascot/standing.png")}
            resizeMode="cover"
            style={{ width: "100%", height: "100%" }}
          />
        </MotiView>
      </MotiView>
    );
  };

  const renderText = () => {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MotiText
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{
            type: "timing",
            duration: 380,
            delay: 120,
            reduceMotion: ReduceMotion.Never,
          }}
          style={{
            ...textStyles.primary,
            fontSize: textSizes.xxxl,
            textAlign: "center",
            fontWeight: "bold",
            marginBottom: spacing.sm,
          }}
        >
          Stay consistent every day
        </MotiText>
        <MotiText
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{
            type: "timing",
            duration: 380,
            delay: 170,
            reduceMotion: ReduceMotion.Never,
          }}
          style={{
            ...textStyles.secondary,
            fontSize: textSizes.sm,
            textAlign: "center",
            marginBottom: spacing.sm,
            width: "80%",
          }}
        >
          Enable notifications and connect Health to see real progress
        </MotiText>
      </View>
    );
  };

  const renderCTA = () => {
    return (
      <MotiView
        from={{ opacity: 0, translateY: 10, scale: 0.98 }}
        animate={{ opacity: 1, translateY: 0, scale: 1 }}
        transition={{
          type: "timing",
          duration: 450,
          delay: 220,
          reduceMotion: ReduceMotion.Never,
        }}
      >
        <PrimaryButtonComponent title="Continue" onPress={handleCTAPress} />
      </MotiView>
    );
  };

  const renderSkipButton = () => {
    return (
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{
          type: "timing",
          duration: 380,
          delay: 280,
          reduceMotion: ReduceMotion.Never,
        }}
      >
        <TouchableOpacity
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginBottom: spacing.sm,
            marginTop: spacing.md,
          }}
        >
          <Text
            style={{
              ...textStyles.secondary,
              fontSize: textSizes.sm,
              textAlign: "center",
              marginBottom: spacing.sm,
              color: colors.text.secondary,
            }}
          >
            Skip for now
          </Text>
        </TouchableOpacity>
      </MotiView>
    );
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        ...globalStyles.scrollContainer,
        justifyContent: "center",
      }}
      style={globalStyles.container}
    >
      {renderImage()}
      {renderText()}
      {renderCTA()}
      {renderSkipButton()}
    </ScrollView>
  );
};

export default PermissionScreen;
