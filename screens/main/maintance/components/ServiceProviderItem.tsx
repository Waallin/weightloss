import {
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { ServiceProviderItemType } from "../types";
import { spacing } from "../../../../constants/spacing";
import { colors } from "../../../../constants/colors";
import { globalStyles } from "../../../../constants/globalStyles";
import { Entypo } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

const ServiceProviderItem = ({ item }: { item: ServiceProviderItemType }) => {
  const handleContact = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log("Contact");
  };
  return (
    <View
      style={{
        backgroundColor: colors.ui.white,
        padding: spacing.md,
        borderRadius: spacing.borderRadius,
        ...globalStyles.cardShadow,
      }}
    >
      <View>
        <Text style={{ ...globalStyles.smallText, fontWeight: "bold" }}>
          {item.title}
        </Text>
        <Text style={{ ...globalStyles.xSmallText, color: colors.ui.grey }}>
          {item.name}
        </Text>
      </View>
      <View>
        <Text style={{ ...globalStyles.xSmallText, color: colors.ui.grey }}>
          {item.text}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ ...globalStyles.xSmallText, color: colors.ui.grey }}>
          {item.rating}{" "}
          <Entypo name="star" size={18} color={colors.ui.yellow} />
        </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleContact}
          style={{
            backgroundColor: colors.ui.lightBlueBackground,
            paddingVertical: spacing.sm,
            paddingHorizontal: spacing.md,
            borderRadius: spacing.borderRadius,
          }}
        >
          <Text
            style={{ ...globalStyles.xSmallText, color: colors.ui.darkBlue }}
          >
            Contact
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ServiceProviderItem;

const styles = StyleSheet.create({});
