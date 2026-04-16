import {
  Image,
  Keyboard,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import GoBackHeaderComponent from "../../../components/GoBackHeaderComponent";
import PrimaryButtonComponent from "../../../components/PrimaryButtonComponent";
import { colors } from "../../../constants/colors";
import { globalStyles } from "../../../constants/globalStyles";
import { spacing } from "../../../constants/spacing";
import { logWeightCopy, textSizes, textStyles } from "../../../constants/texts";
import * as haptics from "expo-haptics";
import { updateDocument } from "../../../services/firebase";
import useUserStore from "../../../stores/useUserStore";

const IMAGE_SIZE = 220;

const LogWeightScreen: React.FC = () => {
  const navigation = useNavigation();
  const [weightInput, setWeightInput] = useState("");
  const { setUser, user } = useUserStore();  
  const handleSave = async () => {
    haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
    const result = await updateDocument("users", user?.id, { currentWeight: parseFloat(weightInput) });
    if (result) {
      setUser({ ...user, currentWeight: parseFloat(weightInput) });
      navigation.goBack();
    }
  };

  const renderForm = () => {
    return (
      <View
        style={[
          globalStyles.shadow,
          {
            width: "100%",
            backgroundColor: colors.ui.componentBackground,
            borderRadius: spacing.borderRadius,
            padding: spacing.md,
            gap: spacing.md,
          },
        ]}
      >
        <Text style={textStyles.screenSectionTitle}>
          {logWeightCopy.question}
        </Text>
        <Text style={textStyles.secondary}>{logWeightCopy.hint}</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.sm,
          }}
        >
          <TextInput
            value={weightInput}
            onChangeText={setWeightInput}
            placeholder={logWeightCopy.placeholder}
            placeholderTextColor={colors.text.secondary}
            keyboardType="decimal-pad"
            style={{
              flex: 1,
              borderWidth: 0.5,
              borderColor: colors.ui.cardBorder,
              borderRadius: spacing.borderRadius,
              padding: spacing.md,
              backgroundColor: colors.ui.white,
              ...textStyles.primary,
              fontSize: textSizes.xl,
              fontWeight: "700",
              textAlign: "center",
            }}
          />
 
          <Text style={{ ...textStyles.secondary, fontSize: textSizes.md }}>
            {logWeightCopy.unitKg}
          </Text>
        </View>
      </View>
    );
  };

  const renderImage = () => {
    return (
      <View
        style={[
          globalStyles.shadow,
          {
            width: IMAGE_SIZE,
            height: IMAGE_SIZE,
            borderRadius: IMAGE_SIZE / 2,
            backgroundColor: colors.ui.secondaryBackground,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: spacing.xl,
            overflow: "hidden",
          },
        ]}
      >
        <Image
          source={require("../../../assets/mascot/standing.png")}
          resizeMode="cover"
          style={{ width: "100%", height: "100%" }}
        />
      </View>
    );
  };

  const renderButton = () => {
    return (
      <View
        style={{
          position: "absolute",
          bottom: 100,
          left: 0,
          right: 0,
          padding: spacing.md,
          backgroundColor: colors.ui.background,
        }}
      >
        <PrimaryButtonComponent
          title={"Log weight"}
          onPress={handleSave}
        />
      </View>
    );
  };
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <View style={{ ...globalStyles.container, alignItems: "center" }}>
      <GoBackHeaderComponent title={"Log weight"} />
      {renderImage()}
      {renderForm()}
      {renderButton()}
    </View>
    </TouchableWithoutFeedback>
  );
};

export default LogWeightScreen;
