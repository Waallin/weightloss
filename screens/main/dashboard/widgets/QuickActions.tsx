import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import React from "react";
import { spacing } from "../../../../constants/spacing";
import { colors } from "../../../../constants/colors";
import { globalStyles } from "../../../../constants/globalStyles";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";

const QuickActions = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const quickActions = [
    {
      title: "Crew",
      color1: "#33C45A",
      color2: "#27B260",
      icon: <FontAwesome name="users" size={20} color="white" />,
      onPress: () => {
        navigation.navigate("Crew");
      },
    },
    {
      title: "Analytics",
      color1: "#28537E",
      color2: "#1B426C",
      icon: <FontAwesome name="bar-chart" size={20} color="white" />,
      onPress: () => {
        console.log("Analytics");
      },
    },
    {
      title: "Checklist",
      color1: "#8957F4",
      color2: "#8042EF",
      icon: <FontAwesome name="check" size={20} color="white" />,
      onPress: () => {
        console.log("Checklist");
      },
    },
    {
      title: "Navigate",
      color1: "#FF9500",
      color2: "#FF8500",
      icon: <FontAwesome name="map-marker" size={20} color="white" />,
      onPress: () => {
        console.log("Navigate");
      },
    },
  ];

  const handleQuickAction = (action: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    action.onPress();
  };
  const renderQuickActions = () => {
    return (
      <View style={{ flexDirection: "row", gap: spacing.md, flexWrap: "wrap" }}>
        {quickActions.map((action) => (
          <TouchableOpacity
            activeOpacity={0.8}
            key={action.title}
            onPress={action.onPress}
          >
            <LinearGradient
              colors={[action.color1, action.color2]}
              style={{
                width: width * 0.39,
                height: width * 0.25,
                borderRadius: spacing.borderRadius,
                alignItems: "center",
                justifyContent: "center",
                gap: spacing.sm,
                ...globalStyles.cardShadow,
              }}
            >
              {action.icon}
              <Text
                style={{ ...globalStyles.smallText, color: colors.ui.white }}
              >
                {action.title}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  return (
    <View
      style={{
        backgroundColor: colors.ui.white,
        padding: spacing.md,
        borderRadius: spacing.borderRadius,
        gap: spacing.md,
      }}
    >
      <Text style={{ ...globalStyles.bodyText, fontWeight: "bold" }}>
        Quick Actions
      </Text>
      {renderQuickActions()}
    </View>
  );
};

export default QuickActions;

const styles = StyleSheet.create({});
