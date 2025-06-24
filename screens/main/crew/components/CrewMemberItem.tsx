import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { CrewMemberItemType } from "../types";
import { spacing } from "../../../../constants/spacing";
import { globalStyles } from "../../../../constants/globalStyles";
import { Ionicons } from "@expo/vector-icons";
import TagComponent from "../../../../components/TagComponent";
import { colors } from "../../../../constants/colors";

const CrewMemberItem = ({ member }: { member: CrewMemberItemType }) => {
  const roleConfig = {
    owner: {
      backgroundColor: colors.role.owner,
      textColor: colors.ui.white,
      icon: <Ionicons name="crown" size={16} color={colors.ui.white} />,
      type: "Owner",
    },
    captain: {
      backgroundColor: colors.role.captain,
      textColor: colors.ui.white,
      icon: <Ionicons name="boat" size={16} color={colors.ui.white} />,
      type: "Captain",
    },
    crew: {
      backgroundColor: colors.role.crew,
      textColor: colors.ui.white,
      icon: <Ionicons name="people" size={16} color={colors.ui.white} />,
      type: "Crew",
    },
  };

  const returnRole = () => {
    const config = roleConfig[member.role as keyof typeof roleConfig];
    return <TagComponent item={config} />;
  };

  return (
    <View
      style={{
        flexDirection: "row",
        gap: spacing.md,
        backgroundColor: colors.ui.white,
        paddingVertical: spacing.md,
        borderRadius: spacing.borderRadius,
        ...globalStyles.cardShadow,
      }}
    >
      <View
        style={{
          position: "absolute",
          top: 10,
          right: 10,
        }}
      >
        {returnRole()}
      </View>
      <View>
        <Image
          source={{ uri: member.profileImage }}
          style={{ width: 50, height: 50, borderRadius: 25 }}
        />
      </View>
      <View>
        <Text
          onPress={() => console.log("test", member)}
          style={{ ...globalStyles.smallText, fontWeight: "bold" }}
        >
          {member.name}
        </Text>
        <Text
          style={{
            ...globalStyles.xSmallText,
            color: colors.text.secondary,
            marginTop: spacing.xs,
          }}
        >
          {member.email}
        </Text>
        <TouchableOpacity>
          <Text
            style={{
              ...globalStyles.xSmallText,
              color: colors.text.secondary,
              marginTop: spacing.xs,
              textDecorationLine: "underline",
              textDecorationColor: colors.text.link,
            }}
          >
            {member.phone}
          </Text>
        </TouchableOpacity>
      </View>
      <View></View>
    </View>
  );
};

export default CrewMemberItem;

const styles = StyleSheet.create({});
