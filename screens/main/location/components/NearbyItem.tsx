import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { NearbyItemType } from "../types";
import { colors } from "../../../../constants/colors";
import { spacing } from "../../../../constants/spacing";
import { globalStyles } from "../../../../constants/globalStyles";
import { Entypo, Feather, FontAwesome5 } from "@expo/vector-icons";

const NearbyItem = ({ item }: { item: NearbyItemType }) => {
  const returnIcon = () => {
    switch (item.type) {
      case "fuel":
        return <Entypo name="water" size={18} color={colors.ui.white} />;
      case "restaurant":
        return <Entypo name="shop" size={18} color={colors.ui.white} />;
      case "marina":
        return <Feather name="anchor" size={18} color={colors.ui.white} />;
      default:
        return <Entypo name="location-pin" size={18} color={colors.ui.white} />;
    }
  };

  const returnBackgroundColor = () => {
    switch (item.type) {
      case "fuel":
        return colors.nearbyItemColor.fuel;
      case "restaurant":
        return colors.nearbyItemColor.restaurant;
      case "marina":
        return colors.nearbyItemColor.marina;
      default:
        return colors.nearbyItemColor.default;
    }
  };
  return (
    <View
      style={{
        backgroundColor: colors.ui.white,
        padding: spacing.md,
        borderRadius: spacing.borderRadius,
        ...globalStyles.cardShadow,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <View
        style={{
          backgroundColor: returnBackgroundColor(),
          padding: spacing.sm,
          borderRadius: spacing.rounded,
        }}
      >
        {returnIcon()}
      </View>
      <View style={{ marginLeft: spacing.md, flex: 1 }}>
        <Text style={{ ...globalStyles.smallText, fontWeight: "bold" }}>
          {item.name}
        </Text>
        <Text style={{ ...globalStyles.xSmallText, marginTop: spacing.xs }}>
          {item.distance}
        </Text>
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: colors.ui.lightBlue,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.xs,
          borderRadius: spacing.borderRadius,
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.xs,
        }}
      >
        <FontAwesome5
          name="location-arrow"
          size={10}
          color={colors.ui.darkBlue}
        />
        <Text style={{ ...globalStyles.smallText, color: colors.ui.darkBlue }}>
          Go
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default NearbyItem;

const styles = StyleSheet.create({});
