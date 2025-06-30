import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { CrewMemberItemType } from "../types";
import { spacing } from "../../../../constants/spacing";
import { globalStyles } from "../../../../constants/globalStyles";
import { Ionicons } from "@expo/vector-icons";
import TagComponent from "../../../../components/TagComponent";
import { colors } from "../../../../constants/colors";

const CrewMemberItem = ({ member }: { member: CrewMemberItemType }) => {
  const profile = member?.user_profile;
  const roleConfig = {
    owner: {
      backgroundColor: colors.role.owner,
      textColor: colors.ui.white,
      icon: <Ionicons name="person-circle" size={16} color={colors.ui.white} />,
      type: "Owner",
    },
    captain: {
      backgroundColor: colors.role.captain,
      textColor: colors.ui.white,
      icon: <Ionicons name="boat" size={16} color={colors.ui.white} />,
      type: "Captain",
    },
    member: {
      backgroundColor: colors.role.crew,
      textColor: colors.ui.white,
      icon: <Ionicons name="people" size={16} color={colors.ui.white} />,
      type: "Member",
    },
  };

  const returnRole = () => {
    const config = roleConfig[member?.pivot?.role as keyof typeof roleConfig];
    return <TagComponent item={config} />;
  };

  const returnProfileImage = () => {
    const random = Math.floor(Math.random() * 100);
    const gender = Math.random() > 0.5 ? "men" : "women";
    return `https://randomuser.me/api/portraits/${gender}/${random}.jpg`;
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
          source={{ uri: returnProfileImage() }}
          style={{ width: 50, height: 50, borderRadius: 25 }}
        />
      </View>
      <View>
        <Text style={{ ...globalStyles.smallText, fontWeight: "bold" }}>
          {profile?.full_name ? profile?.full_name : "No name"}
        </Text>
        <Text
          style={{
            ...globalStyles.xSmallText,
            color: colors.text.secondary,
            marginTop: spacing.xs,
          }}
        >
          {profile?.email ? profile?.email : "No email"}
        </Text>
        <TouchableOpacity onPress={() => console.log(member)}>
          <Text
            style={{
              ...globalStyles.xSmallText,
              color: colors.text.secondary,
              marginTop: spacing.xs,
              textDecorationLine: "underline",
              textDecorationColor: colors.text.link,
            }}
          >
            {member?.phone_number ? member?.phone_number : "No phone number"}
          </Text>
        </TouchableOpacity>
      </View>
      <View></View>
    </View>
  );
};

export default CrewMemberItem;

const styles = StyleSheet.create({});
