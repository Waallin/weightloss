import { ScrollView, StyleSheet, Text, View, Alert, Image } from "react-native";
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
import useToastStore from "../../../stores/useToastStore";
import { useNavigation } from "@react-navigation/native";
const EditProfileScreen = () => {
  const navigation = useNavigation();
  const { user, setUser } = useUserStore();
  const { showToast } = useToastStore();
  const [fullName, setFullName] = useState(user?.user_profile?.full_name);
  const [photo, setPhoto] = useState(user?.user_profile?.image?.image_url);
  const [email, setEmail] = useState(user?.user_profile?.email);
  const [address, setAddress] = useState(user?.user_profile?.address);
  const [emergencyContact, setEmergencyContact] = useState(
    user?.user_profile?.emergency_contact
  );
  const [emergencyPhoneNumber, setEmergencyPhoneNumber] = useState(
    user?.user_profile?.emergency_phone_number
  );

  const handleSave = async () => {
    let formData = new FormData();

    formData.append("full_name", fullName);
    formData.append("email", email);
    formData.append("date_of_birth", "1990-01-01");
    formData.append("address", address);
    formData.append("emergency_contact", emergencyContact);
    formData.append("emergency_phone_number", emergencyPhoneNumber);

    if (photo) {
      formData.append("image", {
        uri: photo,
        name: "profile.png",
        type: "image/png",
      } as any);
    }

    try {
      const endpoint = "user/update";

      const response = await globalApi(
        "POST",
        endpoint,
        formData,
        user.auth_token
      );

      if (response.success) {
        showToast("Profile updated successfully");
        setUser({
          ...user,
          user_profile: {
            ...user.user_profile,
            image: { image_url: photo },
            full_name: fullName,
            email: email,
            address: address,
          },
        });

        navigation.goBack();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast("Failed to update profile. Please try again.");
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
                console.log("Camera Image URI:", imageUri);
              }
            },
          },
          {
            text: "Gallery",
            onPress: async () => {
              const imageUri = await pickImageFromGallery();
              if (imageUri) {
                setPhoto(imageUri);
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
          {!photo ? (
            <TouchableOpacity
              onPress={handleChangePhoto}
              activeOpacity={0.8}
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
          ) : (
            <TouchableOpacity
              onPress={handleChangePhoto}
              activeOpacity={0.8}
              style={{
                backgroundColor: colors.ui.lightGrey,
                borderRadius: spacing.rounded,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={{ uri: photo }}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: spacing.rounded,
                }}
                resizeMode="cover"
              />
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
          )}
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
