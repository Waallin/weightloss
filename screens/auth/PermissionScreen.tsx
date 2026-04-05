import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { globalStyles } from "../../constants/globalStyles";
import { colors } from "../../constants/colors";
import { spacing } from "../../constants/spacing";
import { Image, ScrollView } from "react-native";
import PrimaryButtonComponent from "../../components/PrimaryButtonComponent";
import { textSizes, textStyles } from "../../constants/texts";
import { useNavigation } from "@react-navigation/native";

const IMAGE_SIZE = 250;

const PermissionScreen = () => {
  const navigation = useNavigation();
  const handleCTAPress = () => {
    navigation.navigate("MainStack");
  };

  const renderImage = () => {
    return (
      <View
        style={{
          justifyContent: "center",
        }}
      >
        <View
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
        </View>
      </View>
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
        <Text
          style={{
            ...textStyles.primary,
            fontSize: textSizes.xxxl,
            textAlign: "center",
            fontWeight: "bold",
            marginBottom: spacing.sm,
          }}
        >
          Stay consistent every day
        </Text>
        <Text
          style={{
            ...textStyles.secondary,
            fontSize: textSizes.sm,
            textAlign: "center",
            marginBottom: spacing.sm,
            width: "80%",
          }}
        >
          Enable notifications and connect Health to see real progress
        </Text>
      </View>
    );
  };
  const renderCTA = () => {
    return (
      <View style={{}}>
        <PrimaryButtonComponent title="Continue" onPress={handleCTAPress} />
      </View>
    );
  };

  const renderSkipButton = () => {
    return (
      <TouchableOpacity style={{
        alignItems: "center",
        justifyContent: "center",
        marginBottom: spacing.sm,
        marginTop: spacing.md,

      }}>
        <Text style={{
            
            ...textStyles.secondary,
            fontSize: textSizes.sm,
            textAlign: "center",
            marginBottom: spacing.sm,
            color: colors.text.secondary,
        }}>
            Skip for now
        </Text>
      </TouchableOpacity>
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
