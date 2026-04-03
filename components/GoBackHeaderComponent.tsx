import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { spacing } from "../constants/spacing";
import { colors } from "../constants/colors";
import { globalStyles } from "../constants/globalStyles";
import { textStyles } from "../constants/texts";

const BACK_HIT_SIZE = 44;

interface GoBackHeaderComponentProps {
  title: string;
}

const GoBackHeaderComponent: React.FC<GoBackHeaderComponentProps> = ({
  title,
}) => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  return (
    <View
      style={{
        width: "100%",
        marginBottom: spacing.md,
        minHeight: BACK_HIT_SIZE,
        justifyContent: "center",
      }}
    >
      <Text
        numberOfLines={1}
        style={{
          ...textStyles.screenSectionTitle,
          textAlign: "center",
          paddingHorizontal: BACK_HIT_SIZE + spacing.sm,
        }}
      >
        {title}
      </Text>
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={handleGoBack}
        hitSlop={{ top: spacing.sm, bottom: spacing.sm, left: spacing.sm, right: spacing.sm }}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: BACK_HIT_SIZE,
          height: BACK_HIT_SIZE,
          borderRadius: spacing.borderRadius,
          backgroundColor: colors.ui.componentBackground,
          borderWidth: 1,
          borderColor: colors.ui.cardBorder,
          alignItems: "center",
          justifyContent: "center",
          ...globalStyles.shadow,
        }}
      >
        <MaterialCommunityIcons
          name="chevron-left"
          size={26}
          color={colors.text.primary}
        />
      </TouchableOpacity>
    </View>
  );
};

export default GoBackHeaderComponent;
