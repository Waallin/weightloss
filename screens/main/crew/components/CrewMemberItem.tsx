import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { CrewMemberItemType } from "../types";
import { spacing } from "../../../../constants/spacing";
import { globalStyles } from "../../../../constants/globalStyles";

const CrewMemberItem = ({ crew }: { crew: CrewMemberItemType }) => {
  return (
    <View style={{ flexDirection: "row", gap: spacing.md }}>
      <View>
        <Image
          source={{ uri: crew.profileImage }}
          style={{ width: 50, height: 50, borderRadius: 25 }}
        />
      </View>
      <View>
        <Text style={{ ...globalStyles.smallText, fontWeight: "bold" }}>
          {crew.name}
        </Text>
      </View>
      <View></View>
    </View>
  );
};

export default CrewMemberItem;

const styles = StyleSheet.create({});
