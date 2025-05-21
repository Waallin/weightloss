import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { globalStyles } from "../../../constants/globalStyles";
import { colors } from "../../../constants/colors";
import { spacing } from "../../../constants/spacing";
import { Feather } from "@expo/vector-icons";
import VesselCard from "./components/VesselCard";
import SettingsRow from "./components/SettingsRow";
import SwitchSettingsRow from "./components/SwitchSettingsRow";
import { useNavigation } from "@react-navigation/native";
const dummyVessels = [
  {
    id: 1,
    name: "Vessel 1",
    type: "Yacht",
    image: require("../../../assets/images/vessel1.png"),
  },
  {
    id: 2,
    name: "Vessel 2",
    type: "Speedboat",
    image: require("../../../assets/images/vessel2.png"),
  },
  {
    id: 3,
    name: "Vessel 3",
    type: "Speedboat",
    image: require("../../../assets/images/vessel3.png"),
  },
];

const ProfileScreen = () => {
  const profileImage = require("../../../assets/profile.png");
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState(true);
  const [location, setLocation] = useState(false);
  const accountSettings = [
    {
      id: 1,
      title: "Personal Information",
      icon: "user",
      onPress: () => {
        console.log("Personal Information");
      },
    },
    {
      id: 2,
      title: "Vessel Documentation",
      icon: "file",
      onPress: () => {
        console.log("Vessel Documentation");
      },
    },
    {
      id: 3,
      title: "Preferences",
      icon: "settings",
      onPress: () => {
        navigation.navigate("PreferenceView");
      },
    },
  ];

  const supportSettings = [
    {
      id: 1,
      title: "Help Center",
      icon: "help-circle",
      onPress: () => {
        console.log("Help Center");
      },
    },
    {
      id: 2,
      title: "Logout",
      icon: "log-out",
      onPress: () => {
        console.log("Logout");
      },
    },
  ];

  const handleNavigateToBoatRegistration = () => {
    navigation.navigate("BoatRegistration");
  };

  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        backgroundColor: colors.ui.primaryBackground,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: spacing.xxl,
          flexGrow: 1,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.ui.white,
            margin: spacing.md,
            padding: spacing.md,
            borderRadius: spacing.borderRadius,
            ...globalStyles.cardShadow,
          }}
        >
          <View>
            <Image
              source={profileImage}
              style={{
                width: 75,
                height: 75,
                borderRadius: 50,
                borderWidth: 2,
                borderColor: "#1A406B",
              }}
            />
            <View
              style={{
                backgroundColor: colors.ui.darkBlue,
                padding: spacing.sm,
                borderRadius: spacing.rounded,
                borderWidth: 2,
                borderColor: colors.ui.white,
                position: "absolute",
                bottom: -5,
                right: -5,
              }}
            >
              <Feather name="anchor" size={12} color={colors.ui.white} />
            </View>
          </View>
          <View style={{ marginLeft: spacing.md }}>
            <Text
              style={{
                ...globalStyles.subTitle,
                color: colors.ui.darkBlue,
                fontWeight: "bold",
              }}
            >
              Captain Mike Johnson
            </Text>
            <Text
              style={{
                ...globalStyles.smallText,
                color: colors.ui.darkBlue,
                marginTop: spacing.xs,
              }}
            >
              mike@vstboat.com
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: colors.ui.lightBlueBackground,
                padding: spacing.xs,
                paddingHorizontal: spacing.md,
                borderRadius: spacing.borderRadius,
                alignSelf: "flex-start",
                marginTop: spacing.sm,
              }}
            >
              <Text
                style={{
                  ...globalStyles.smallText,
                  color: colors.ui.darkBlue,
                  fontWeight: "600",
                }}
              >
                Edit Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            marginTop: spacing.lg,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginHorizontal: spacing.md,
          }}
        >
          <Text
            style={{
              ...globalStyles.bodyText,
              color: colors.ui.darkBlue,
              fontWeight: "bold",
            }}
          >
            My Vessels
          </Text>
          <TouchableOpacity
            onPress={handleNavigateToBoatRegistration}
            style={{
              backgroundColor: colors.ui.darkBlue,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.xs,
              borderRadius: spacing.borderRadius,
              alignSelf: "flex-start",
            }}
          >
            <Text
              style={{
                ...globalStyles.smallText,
                color: colors.ui.white,
                fontWeight: "600",
              }}
            >
              Add Vessel
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginTop: spacing.md,
          }}
        >
          <FlatList
            horizontal
            data={dummyVessels}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => <VesselCard vessel={item} />}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{
              gap: spacing.md,
              paddingHorizontal: spacing.md,
            }}
          />
          <View
            style={{ paddingHorizontal: spacing.md, marginTop: spacing.md }}
          >
            <Text
              style={{
                ...globalStyles.bodyText,
                color: colors.ui.darkBlue,
                fontWeight: "bold",
                marginBottom: spacing.sm,
              }}
            >
              Account Settings
            </Text>
            {accountSettings.map((setting, index) => (
              <SettingsRow
                index={index}
                key={setting.id}
                title={setting.title}
                icon={setting.icon}
                last={index === accountSettings.length - 1}
                onPress={setting.onPress}
              />
            ))}
          </View>
        </View>
        <View style={{ paddingHorizontal: spacing.md, marginTop: spacing.md }}>
          <Text
            style={{
              ...globalStyles.bodyText,
              color: colors.ui.darkBlue,
              fontWeight: "bold",
              marginBottom: spacing.sm,
            }}
          >
            Support
          </Text>
          {supportSettings.map((setting, index) => (
            <SettingsRow
              index={index}
              key={setting.id}
              title={setting.title}
              icon={setting.icon}
              last={index === supportSettings.length - 1}
              onPress={setting.onPress}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});
