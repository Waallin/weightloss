import { StyleSheet, Text, View, TextInput, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { globalStyles } from "../../../constants/globalStyles";
import { spacing } from "../../../constants/spacing";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../constants/colors";
import CrewMemberItem from "./components/CrewMemberItem";
import globalApi from "../../../services/api";
import useUserStore from "../../../stores/useUserStore";
import { CrewMemberItemType } from "./types";

const CrewScreen = () => {
  const [crew, setCrew] = useState([]);
  const [filteredCrew, setFilteredCrew] = useState([]);
  const { user, mainBoat } = useUserStore();
  useEffect(() => {
    getCrew();
  }, []);

  const getCrew = async () => {
    const endpoint = `boats/${mainBoat()?.id}/users`;
    const response = await globalApi("GET", endpoint, null, user.auth_token);

    if (response.success) {
      setCrew(response.data.users);
      setFilteredCrew(response.data.users);
    }
  };
  const handleSearch = (text: string) => {
    const filtered = crew.filter((item: CrewMemberItemType) =>
      item.user_profile.full_name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredCrew(filtered);
  };
  const renderSearchBar = () => {
    return (
      <View
        style={{
          backgroundColor: colors.ui.white,
          borderRadius: spacing.borderRadius,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.sm,
          }}
        >
          <Ionicons
            name="search"
            size={20}
            color={colors.ui.darkGrey}
            style={{ marginLeft: spacing.md }}
          />
          <TextInput
            onChangeText={handleSearch}
            placeholder="Search"
            style={{
              flex: 1,
              padding: spacing.md,
              ...globalStyles.smallText,
            }}
          />
        </View>
      </View>
    );
  };

  const renderCrewList = () => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.ui.white,
          borderRadius: spacing.borderRadius,
          padding: spacing.md,
        }}
      >
        <Text style={{ ...globalStyles.bodyText, fontWeight: "bold" }}>
          Crew Members
        </Text>
        <View style={{ flex: 1, marginTop: spacing.md }}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={filteredCrew}
            contentContainerStyle={{
              gap: spacing.md,
            }}
            renderItem={({ item }) => <CrewMemberItem member={item} />}
          />
        </View>
      </View>
    );
  };
  return (
    <View
      style={{
        ...globalStyles.container,
        paddingTop: spacing.md,
        backgroundColor: colors.ui.lightBlueBackground,
        gap: spacing.md,
      }}
    >
      {renderSearchBar()}
      {renderCrewList()}
    </View>
  );
};

export default CrewScreen;

const styles = StyleSheet.create({});
