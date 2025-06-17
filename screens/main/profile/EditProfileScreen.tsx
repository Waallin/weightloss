import { ScrollView, StyleSheet, Text, View, Alert } from "react-native";
import React, { useState } from "react";
import { colors } from "../../../constants/colors";
import { spacing } from "../../../constants/spacing";
import { globalStyles } from "../../../constants/globalStyles";
import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import ProfileInputRow from "../../../components/ProfileInputRow";
import ProfileInputRowTitle from "../../../components/ProfileInputRowTitle";
import useUserStore from "../../../stores/useUserStore";
import PrimaryButton from "../../../components/PrimaryButton";
import globalApi from "../../../services/api";
import {
  pickImageFromCamera,
  pickImageFromGallery,
} from "../../../services/permissions";

const EditProfileScreen = () => {
  const { user, setUser } = useUserStore();

  const [fullName, setFullName] = useState(user?.profile?.full_name);
  const [email, setEmail] = useState(user?.profile?.email);
  const [address, setAddress] = useState(user?.profile?.address);
  const [emergencyContact, setEmergencyContact] = useState(
    user?.profile?.emergency_contact
  );
  const [emergencyPhoneNumber, setEmergencyPhoneNumber] = useState(
    user?.profile?.emergency_phone_number
  );

  const handleSave = async () => {
    const payload = {
      full_name: fullName,
      email: email,
      address: address,
      emergency_contact: emergencyContact,
      // emergency_phone_number: emergencyPhoneNumber,
    };
    setUser({ ...user, profile: payload });

    const endpoint = "user/update";
    const response = await globalApi("POST", endpoint, payload, user?.token);
    if (response.success) {
      console.log("success");
    } else {
      console.log("error");
    }
  };
  const handleChangePhoto = async () => {
    try {
      Alert.alert(
        "Choose Image Source",
        "How would you like to add your profile picture?",
        [
          {
            text: "Camera",
            onPress: async () => {
              const imageUri = await pickImageFromCamera();
              if (imageUri) {
                // Handle the captured image here
                console.log("Camera Image URI:", imageUri);
                // Implement logic to upload the image
              }
            },
          },
          {
            text: "Gallery",
            onPress: async () => {
              const imageUri = await pickImageFromGallery();
              if (imageUri) {
                // Handle the selected image here
                console.log("Gallery Image URI:", imageUri);
                // Implement logic to upload the image
              }
            },
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to select image. Please try again.");
      console.error(error);
    }
  };

  return (
    <View style={globalStyles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: spacing.scrollViewBottomPadding,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: spacing.lg,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleChangePhoto}
            style={{
              backgroundColor: colors.ui.lightGrey,
              borderRadius: spacing.rounded,
              justifyContent: "center",
              alignItems: "center",
              padding: spacing.xl,
            }}
          >
            <Feather name="user" size={42} color={colors.ui.grey} />
            <View
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                borderRadius: spacing.rounded,
                backgroundColor: colors.ui.darkBlue,
                padding: spacing.sm,
              }}
            >
              <Feather name="camera" size={18} color={colors.ui.white} />
            </View>
          </TouchableOpacity>
          <Text
            style={{
              ...globalStyles.subTitle,
              fontWeight: "600",
              marginTop: spacing.sm,
            }}
          >
            Upload Photo
          </Text>
        </View>
        <View>
          <ProfileInputRowTitle title="Personal Information" icon="user" />
          <ProfileInputRow
            title="Full name"
            placeholder="Enter your full name"
            value={fullName}
            onChangeText={setFullName}
          />
          <ProfileInputRow
            title="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
          />

          <ProfileInputRow
            title="Address"
            placeholder="Enter your address"
            value={address}
            onChangeText={setAddress}
          />
          <ProfileInputRowTitle title="Emergency Contact" icon="phone" />
          <ProfileInputRow
            title="Emergency Contact"
            placeholder="Emergency name"
            value={emergencyContact}
            onChangeText={setEmergencyContact}
          />
          <ProfileInputRow
            title="Emergency Phone Number"
            placeholder="Emergency phone number"
            value={emergencyPhoneNumber}
            keyboardType="numeric"
            onChangeText={setEmergencyPhoneNumber}
          />
        </View>
        <View style={{ marginTop: spacing.lg }}>
          <PrimaryButton title="Save" onPress={handleSave} />
        </View>
      </ScrollView>
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({});
