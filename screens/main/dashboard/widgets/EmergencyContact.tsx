import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { colors } from "../../../../constants/colors";
import { spacing } from "../../../../constants/spacing";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles } from "../../../../constants/globalStyles";
import EmergencyContactItem from "./components/EmergencyContactItem";
import * as Haptics from "expo-haptics";

const dummyContacts = [
  {
    name: "Kustbevakningen",
    phone: "+1234567890",
  },
  {
    name: "Marina Service",
    phone: "+1234567890",
  },
  {
    name: "Emergency Contact",
    phone: "+1234567890",
  },
];
const EmergencyContact = () => {
  const handleEmergencySignal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log("Emergency signal");
  };
  return (
    <View style={{ gap: spacing.md }}>
      <View
        style={{
          backgroundColor: colors.ui.white,
          padding: spacing.md,
          borderRadius: spacing.borderRadius,
        }}
      >
        <TouchableOpacity activeOpacity={0.8} onPress={handleEmergencySignal}>
          <LinearGradient
            colors={["#F8392F", "#DF2828"]}
            style={{
              padding: spacing.md,
              borderRadius: spacing.borderRadius,
              gap: spacing.sm,
              paddingVertical: spacing.lg,
            }}
          >
            <View
              style={{
                alignItems: "center",
                gap: spacing.sm,
              }}
            >
              <Ionicons name="warning" size={52} color={colors.ui.white} />
              <Text
                style={{
                  ...globalStyles.bodyText,
                  color: colors.ui.white,
                  fontWeight: "bold",
                }}
              >
                MAN OVERBOARD
              </Text>
              <Text
                style={{
                  ...globalStyles.smallText,
                  color: colors.ui.white,
                }}
              >
                Press and hold for emergency signal
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <View
        style={{
          backgroundColor: colors.ui.white,
          padding: spacing.md,
          borderRadius: spacing.borderRadius,
        }}
      >
        <View>
          <Text style={{ ...globalStyles.bodyText, fontWeight: "bold" }}>
            Emergency Contact
          </Text>
        </View>
        <View style={{ gap: spacing.md, marginTop: spacing.sm }}>
          {dummyContacts.map((contact) => (
            <EmergencyContactItem key={contact.name} contact={contact} />
          ))}
        </View>
      </View>
    </View>
  );
};

export default EmergencyContact;

const styles = StyleSheet.create({});
