import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { spacing } from "../../../constants/spacing";
import { globalStyles } from "../../../constants/globalStyles";
import { colors } from "../../../constants/colors";
import DocumentItem from "./components/DocumentItem";
import { Ionicons } from "@expo/vector-icons";
import InformationItem from "./components/InformationItem";
import useUserStore from "../../../stores/useUserStore";

const dummyDocuments = [
  {
    title: "Vessel Health",
    description: "Vessel Health",
    type: "pdf",
    expires: "Dec 1, 2025",
    size: "1.2 MB",
    documentNumber: "1234567890",
    issueDate: "Dec 1, 2025",
    status: "Active",
  },
  {
    title: "Insurance Policy",
    description: "Boat Insurance",
    type: "pdf",
    expires: "Dec 1, 2025",
    size: "1.2 MB",
    documentNumber: "1234567890",
    issueDate: "Dec 1, 2025",
    status: "Active",
  },
  {
    title: "Registration",
    description: "Vessel Registration",
    type: "pdf",
    expires: "Dec 1, 2025",
    size: "1.2 MB",
    documentNumber: "1234567890",
    issueDate: "Dec 1, 2025",
    status: "Active",
  },
];

const BoatScreen = () => {
  const image = require("../../../assets/images/vessel1.png");
  const { mainBoat } = useUserStore();

  const boatInformation = [
    {
      title: "Vessel Name",
      value: mainBoat()?.name || "No Boat Registered",
      icon: (
        <Ionicons name="boat-outline" size={24} color={colors.ui.darkBlue} />
      ),
    },
    {
      title: "Registration Number",
      value: mainBoat()?.registration_number || "No Registration Number",
      icon: (
        <Ionicons name="card-outline" size={24} color={colors.ui.darkBlue} />
      ),
    },
    {
      title: "Model",
      value: mainBoat()?.model || "No Model",
      icon: (
        <Ionicons
          name="construct-outline"
          size={24}
          color={colors.ui.darkBlue}
        />
      ),
    },
    {
      title: "Year",
      value: mainBoat()?.year || "No Year",
      icon: (
        <Ionicons
          name="calendar-outline"
          size={24}
          color={colors.ui.darkBlue}
        />
      ),
    },
  ];

  const renderHeader = () => {
    return (
      <View style={{ position: "relative" }}>
        <Image
          source={image}
          style={{ width: "100%", height: 250, resizeMode: "cover" }}
        />
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            zIndex: 1,
            height: 250,
          }}
        />
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 2,
            padding: spacing.md,
            gap: spacing.sm,
          }}
        >
          <Text style={{ ...globalStyles.smallTitle, color: colors.ui.white }}>
            {mainBoat()?.name || "No Boat Registered"}
          </Text>
          <Text style={{ ...globalStyles.smallText, color: colors.ui.white }}>
            {mainBoat()?.location || "No Location Set"}
          </Text>
        </View>
      </View>
    );
  };

  const renderDocuments = () => {
    return (
      <View
        style={{
          marginTop: spacing.md,
        }}
      >
        <Text
          style={{
            ...globalStyles.bodyText,
            fontWeight: "bold",
          }}
        >
          Documents
        </Text>
        <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
          {dummyDocuments.map((item, index) => {
            return <DocumentItem key={index} item={item} />;
          })}
        </View>
      </View>
    );
  };

  const renderInformation = () => {
    return (
      <View
        style={{
          borderRadius: spacing.borderRadius,
        }}
      >
        <Text
          style={{
            ...globalStyles.bodyText,
            fontWeight: "bold",
          }}
        >
          Information
        </Text>
        <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
          {boatInformation.map((item, index) => {
            return <InformationItem key={index} item={item} />;
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.ui.lightBlueBackground }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{
          paddingBottom: spacing.scrollViewBottomPadding,
        }}
      >
        {renderHeader()}
        <View
          style={{
            ...globalStyles.container,
            backgroundColor: colors.ui.lightBlueBackground,
          }}
        >
          <View
            style={{
              marginTop: spacing.md,
            }}
          >
            {renderInformation()}
            {renderDocuments()}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default BoatScreen;

const styles = StyleSheet.create({});
