import { StyleSheet, Text, View, TextInput, FlatList } from "react-native";
import React from "react";
import { globalStyles } from "../../../constants/globalStyles";
import { spacing } from "../../../constants/spacing";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../constants/colors";
import CrewMemberItem from "./components/CrewMemberItem";

const dummyCrew = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    joinedDate: "2024-01-15",
    profileImage: "https://randomuser.me/api/portraits/men/30.jpg",
    role: "captain",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1987654321",
    joinedDate: "2024-02-01",
    profileImage: "https://randomuser.me/api/portraits/women/45.jpg",
    role: "crew",
  },
  {
    id: 3,
    name: "Robert Johnson",
    email: "robert.j@example.com",
    phone: "+1122334455",
    joinedDate: "2023-12-10",
    profileImage: "https://randomuser.me/api/portraits/men/22.jpg",
    role: "owner",
  },
  {
    id: 4,
    name: "Maria Garcia",
    email: "maria.g@example.com",
    phone: "+1567891234",
    joinedDate: "2024-03-05",
    profileImage: "https://randomuser.me/api/portraits/women/33.jpg",
    role: "crew",
  },
  {
    id: 5,
    name: "David Wilson",
    email: "david.w@example.com",
    phone: "+1678901234",
    joinedDate: "2024-02-20",
    profileImage: "https://randomuser.me/api/portraits/men/41.jpg",
    role: "crew",
  },
  {
    id: 6,
    name: "Emma Anderson",
    email: "emma.a@example.com",
    phone: "+1789012345",
    joinedDate: "2024-01-30",
    profileImage: "https://randomuser.me/api/portraits/women/28.jpg",
    role: "crew",
  },
];
const CrewScreen = () => {
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
            data={dummyCrew}
            contentContainerStyle={{
              gap: spacing.md,
            }}
            renderItem={({ item }) => <CrewMemberItem crew={item} />}
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
