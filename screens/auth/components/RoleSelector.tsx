import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import React, { useRef } from "react";
import { spacing } from "../../../constants/spacing";
import { colors } from "../../../constants/colors";
import { globalStyles } from "../../../constants/globalStyles";
import Feather from "@expo/vector-icons/Feather";
import * as Haptics from "expo-haptics";

const RoleSelector = ({
  title,
  icon,
  selected,
  onPress,
}: {
  title: string;
  icon: React.ReactNode;
  selected: boolean;
  onPress: () => void;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Animated.View style={{ flex: 1, transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          flex: 1,
          backgroundColor: selected ? colors.ui.background : "white",
          borderWidth: selected ? 2 : 0,
          borderColor: colors.ui.border,
          padding: spacing.md,
          borderRadius: spacing.md,
          alignItems: "center",
          justifyContent: "center",
          ...globalStyles.cardShadow,
        }}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View
          style={{
            backgroundColor: selected
              ? colors.ui.darkBlue
              : colors.ui.background,
            width: 50,
            height: 50,
            borderRadius: 25,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather
            name={icon as any}
            size={24}
            color={selected ? colors.ui.white : colors.brand.primary}
          />
        </View>
        <Text
          style={{
            ...globalStyles.smallText,
            fontWeight: "bold",
            marginTop: spacing.sm,
          }}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default RoleSelector;

const styles = StyleSheet.create({});
